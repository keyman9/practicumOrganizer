import psycopg2
import student as stu
import teacher as teach
import report as rep
import os as os

def connect_to_db():
    return psycopg2.connect('dbname=practicum user=practicum_normal password=password host=localhost')

def connect_to_db_admin():
    return psycopg2.connect('dbname=practicum user=practicum_admin password=password host=localhost')
    
def select_query_db(query, data=None, returnOne=False):
    
    db = connect_to_db()
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    results = []
    
    try:
        if data is None:
            mog = cur.mogrify(query)
        else:
            mog = cur.mogrify(query, data)
            
        cur.execute(mog)
        if returnOne == True:
            results = cur.fetchone()
        else:
            results = cur.fetchall()
        
    except Exception as e:
        print(e)
        db.rollback()
        
    cur.close()
    db.close()
    
    return results
    
def write_query_db(query, data, returnOne=False):
    
    db = connect_to_db()
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    results = []
    try:
        
        mog = cur.mogrify(query, data)
        print(mog)
        cur.execute(mog)
        db.commit()
        if returnOne == True:
            results = cur.fetchone()
        
    except Exception as e:
        print(e)
        db.rollback()
        
    cur.close()
    db.close()
    
    if results:
        return results
        
def delete_query_db(query, data):
    hasError = False
    db = connect_to_db_admin()
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        mog = cur.mogrify(query, (data,))
        cur.execute(mog)
        db.commit()
        
    except Exception as e:
        print(e)
        hasError = True
        db.rollback()
        
    cur.close()
    db.close()
    return hasError
    
def submit_student(data):
    
    studentTable = """INSERT INTO students(email, firstName, lastName, hasCar, passengers) VALUES (%s, %s, %s, %s, %s)"""
    studentSelect = """SELECT email FROM students WHERE email=%s"""
    studentUpdate = """UPDATE students SET firstName=%s, lastName=%s, hasCar=%s, passengers=%s WHERE email=%s"""
    endorseTable = """INSERT INTO endorsements(endorsementName, studentemail) VALUES (%s, %s)"""
    meetingInsert = """INSERT INTO meetingdays(monday, tuesday, wednesday, thursday, friday) VALUES (%s, %s, %s, %s, %s) RETURNING meetingid"""
    meetingSelect = """SELECT meetingId from meetingDays where monday = '%s' AND tuesday = '%s' AND wednesday = '%s' AND thursday = '%s' AND friday = '%s'"""
    prevPracTable = """INSERT INTO previousPractica(school,grade,course,studentEmail) VALUES (%s, %s, %s, %s)"""
    enrolledCourseTable = """INSERT INTO enrolledCourses(courseName,studentEmail) VALUES (%s, %s)"""
    availableInsert = """INSERT INTO availabletimes (starttime, endtime, meetingid, studentemail) VALUES (%s, %s, %s, %s)"""
    deletePreviousPrac = """DELETE FROM previousPractica WHERE studentEmail=%s""";
    deleteEnrolled = """DELETE FROM enrolledCourses WHERE studentEmail=%s""";
    deleteEndorsements = """DELETE FROM endorsements WHERE studentEmail=%s""";
    deleteAvailability = """DELETE FROM availableTimes WHERE studentEmail=%s""";
    
    print(data)
    #print(data['email'])
    studentData = [data['email'], data['firstName'], data['lastName'], data['hasCar'], int(data['passengers'])]
    print(studentData)
    
    studentEmail = data['email']
    error = delete_query_db(deletePreviousPrac, studentEmail)
    if error:
        print("error deleting previous practica")
    error = delete_query_db(deleteEnrolled, studentEmail)
    if error:
        print("error deleting enrolled courses")
    error = delete_query_db(deleteEndorsements, studentEmail)
    if error:
        print("error deleting endorsements")
    error = delete_query_db(deleteAvailability, studentEmail)
    if error:
        print("error deleting availability")

    studentExists = select_query_db(studentSelect, (data['email'],), True)
    if studentExists:
        write_query_db(studentUpdate, (data['firstName'], data['lastName'], data['hasCar'], int(data['passengers']), data['email']))
    else:       
        write_query_db(studentTable, studentData)
        
        
    #endorsement Table
    for endorsement in data['endorsements']:
        endorsementData = [endorsement, data['email']]
        write_query_db(endorseTable, endorsementData)
    
    #previousPractica Table
    for practica in data['previousPractica']:
        grade = 0
        course = ''
        if 'grade' in practica:
            grade = practica['grade']
        if 'course' in practica:
            course = practica['course']
        practicaData = [practica['school'], grade, course, data['email']]
        write_query_db(prevPracTable, practicaData)
        
    #enrolledCourses Table
    for enrolledIn in data['enrolledClasses']:
        coursesData = [enrolledIn, data['email']]
        write_query_db(enrolledCourseTable, coursesData)
       
    #meetingDays Table 
    #availableTimes Table
    for times in data['availability']:
        meetingData = [times['monday'], times['tuesday'], times['wednesday'], times['thursday'], times['friday']]
        meetingID = write_query_db(meetingInsert, meetingData, True)
        availabilityData = [times['startTime'], times['endTime'], meetingID[0], data['email']]  
        write_query_db(availableInsert, availabilityData)

  

    
def load_students():
    
    selectStudents = "SELECT * FROM students"
    selectStudentPractica = "SELECT * FROM previousPractica WHERE studentEmail IN (SELECT email FROM students)"
    availableColSelect = "availableTimes.studentEmail, availableTimes.starttime, availableTimes.endtime, availableTimes.meetingid, meetingDays.monday, meetingDays.tuesday, meetingDays.wednesday, meetingDays.thursday, meetingDays.friday"
    selectStudentAvailability = "SELECT " + availableColSelect + " FROM availableTimes JOIN meetingDays ON availableTimes.meetingID = meetingDays.meetingID WHERE studentEmail IN (SELECT email FROM students)"
    selectStudentEndorsements = "SELECT * FROM endorsements WHERE studentemail IN (SELECT email FROM students)"
    selectStudentCourses = "SELECT * FROM enrolledcourses WHERE studentemail IN (SELECT email FROM students)"   
    
    # Grab all students
    studentsFromDB = select_query_db(selectStudents)    
    
    # Grab all students practicas
    studentsPractica = select_query_db(selectStudentPractica)
   
    # Grab all students availablities
    studentsAvailability = select_query_db(selectStudentAvailability)
        
    # Grab all students endorsements
    studentsEndorsements = select_query_db(selectStudentEndorsements)

    # Grab all students enrolled courses
    studentsCourses = select_query_db(selectStudentCourses)
    
    queryResults = {
        'practica' : studentsPractica,
        'availability' : studentsAvailability,
        'endorsements' : studentsEndorsements,
        'courses' : studentsCourses
    }
    
    listOfStudents = [stu.zip_students(student, queryResults) for student in studentsFromDB]
    #print(listOfStudents)
    return listOfStudents
    
def load_teachers():

    selectTeacherCols = "t.teacherid as teacherid, t.email, t.firstname, t.lastname, t.grade, t.hostfall, t.hostspring, sch.schoolname as schoolname, sd.divisionname as divisionname"
    selectTeachers = "SELECT + "+ selectTeacherCols + " FROM teachers AS t JOIN schools AS sch ON t.schoolid = sch.schoolid JOIN schoolDivisions AS sd ON t.divisionId = sd.divisionId"
    availableColSelect = "availableTimes.studentEmail, availableTimes.starttime, availableTimes.endtime, availableTimes.meetingid, meetingDays.monday, meetingDays.tuesday, meetingDays.wednesday, meetingDays.thursday, meetingDays.friday"
    selectTeacherElem = "select * from elementarySchedule join meetingDays Using (meetingId) WHERE teacherId in (select teacherId from teachers)"
    selectTeacherSec = "SELECT * FROM middleSchoolSchedule WHERE teacherID IN (SELECT teacherID FROM teachers)"

    #Select Teachers
    teachersFromDB = select_query_db(selectTeachers)    
        
    #Elementary Schedules
    teachersElementary = select_query_db(selectTeacherElem)

    #Secondary Schedules
    teachersSecondary = select_query_db(selectTeacherSec)
    
    queryResults = {
        'elemSched' : teachersElementary,
        'secondSched' : teachersSecondary,
    }
    
    #print(queryResults)
    
    listOfTeachers = [teach.zip_teachers(teacher, queryResults) for teacher in teachersFromDB]
    print(listOfTeachers)
    return listOfTeachers    



def load_practica():
    practicaCols = "s.email, t.teacherId, p.startTime, p.endTime, p.course, m.monday, m.tuesday, m.wednesday, m.thursday, m.friday, p.practicum"
    selectPractica = "SELECT " + practicaCols +  " FROM practicumArrangement AS p \
                        JOIN students AS s ON s.email = p.studentEmail \
                        JOIN teachers as t USING (teacherID) \
                        JOIN meetingDays as m USING (meetingid)"
    
    allPractica = select_query_db(selectPractica)
    
    #print(allPractica)
    payload = []
    for row in allPractica:
        match = {}
        print(row)
        match['studentEmail'] = row[0] 
        match['teacherId'] = row[1] 
        match['startTime'] = row[2]
        match['endTime'] = row[3]
        match['class'] = row[4]
        match['monday'] = row[5]
        match['tuesday'] = row[6]
        match['wednesday'] = row[7]
        match['thursday'] = row[8]
        match['friday'] = row[9]
        match['practicum'] = row[10]
        payload.append(match)
    print(payload)
    return payload

def load_practica_matches_for_reports():
    
    practicaCols = "s.email as email, s.firstname as stuFirstname, s.lastname as stuLastname, \
                    sch.schoolname, sch.schoolid as schid, \
                    t.firstname as teacherFirstname, t.lastname as teacherLastname, t.teacherId, p.startTime as starttime, t.schoolid, \
                    p.endTime as endtime, p.course as course, \
                    m.monday, m.tuesday, m.wednesday, m.thursday, m.friday"
                    
    selectPractica = "SELECT " + practicaCols +  " FROM practicumArrangement AS p \
                        JOIN students AS s ON s.email = p.studentEmail \
                        JOIN teachers as t USING (teacherId) \
                        JOIN meetingDays as m USING (meetingid) \
                        JOIN schools as sch USING (schoolid)"
    

    results = select_query_db(selectPractica)
    return results
    
def load_transportation():
    
    selectTransportation = """SELECT driverEmail, ARRAY_AGG(passengerEmail) FROM transportation GROUP BY driverEmail"""
    transport = select_query_db(selectTransportation, ())
    print (transport)
 
    return transport

def archiveSemester(semester):
    
    #archive the database
    rep.batch_reports()
    
    #drop the necessary database elements
    hasError = False
    query = ""
    reloadSqlFile = ""
    msg = ""
    #set variables for query and reloading
    if semester == 'spring':
        reloadSqlFile = "spring.sql"
        query = "\\c postgres"
    elif semester == 'fall':
        reloadSqlFile = "fall.sql"
        query = """DROP TABLE IF EXISTS practicumArrangment,enrolledCourses,endorsements,previousPractica, \
               transportation,students cascade"""
    #drop necessary tables or database
    db = connect_to_db_admin()
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        mog = cur.mogrify(query)
        cur.execute(query)
        db.commit()
    except Exception as e:
        print(e)
        msg = e
        hasError = True
        db.rollback()
    
    #reload db tables or database
    try:
        with open(reloadSqlFile, "r") as s: 
            for line in s:
                stripped = line.rstrip()
                if stripped and stripped[0] != '-':
                    print(stripped)
                    cur.execute(stripped)
                    db.commit()
    except Exception as e:
        msg = e
        print(e)
        hasError = True
        db.rollback()

    cur.close()
    db.close()
    return {'failure': hasError, 'message': msg}