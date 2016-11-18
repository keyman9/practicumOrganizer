import psycopg2
import student as stu

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
    


studentTable = "INSERT INTO students(email, firstName, lastName, hasCar, passengers) VALUES (%s, %s, %s, %s, %s)"
endorseTable = "INSERT INTO endorsements(endorsementName, studentemail) VALUES (%s, %s)"
meetingInsert = "INSERT INTO meetingdays(monday, tuesday, wednesday, thursday, friday) VALUES (%s, %s, %s, %s, %s) RETURNING meetingid"
meetingSelect = """SELECT meetingId from meetingDays where monday = '%s' AND tuesday = '%s' AND wednesday = '%s' AND thursday = '%s' AND friday = '%s'"""
prevPracTable = "INSERT INTO previousPractica(school,grade,course,studentEmail) VALUES (%s, %s, %s, %s)"
enrolledCourseTable = "INSERT INTO enrolledCourses(courseName,studentEmail) VALUES (%s, %s)"
availableInsert = "INSERT INTO availabletimes (starttime, endtime, meetingid, studentemail) VALUES (%s, %s, %s, %s)"

def submit_student(data):
    print(data)
    #print(data['email'])
    studentData = [data['email'], data['firstName'], data['lastName'], data['hasCar'], int(data['passengers'])]
    print(studentData)
    
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

  
selectStudents = "SELECT * FROM students"
selectStudentPractica = "SELECT * FROM previousPractica WHERE studentEmail IN (SELECT email FROM students)"
availableColSelect = "availableTimes.studentEmail, availableTimes.starttime, availableTimes.endtime, availableTimes.meetingid, meetingDays.monday, meetingDays.tuesday, meetingDays.wednesday, meetingDays.thursday, meetingDays.friday"
selectStudentAvailability = "SELECT " + availableColSelect + " FROM availableTimes JOIN meetingDays ON availableTimes.meetingID = meetingDays.meetingID WHERE studentEmail IN (SELECT email FROM students)"
selectStudentEndorsements = "SELECT * FROM endorsements WHERE studentemail IN (SELECT email FROM students)"
selectStudentCourses = "SELECT * FROM enrolledcourses WHERE studentemail IN (SELECT email FROM students)"   
    
def load_students():
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
    return listOfStudents
    