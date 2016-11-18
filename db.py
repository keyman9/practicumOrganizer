import psycopg2

def connect_to_db():
    return psycopg2.connect('dbname=practicum user=practicum_normal password=password host=localhost')

def connect_to_db_admin():
    return psycopg2.connect('dbname=practicum user=practicum_admin password=password host=localhost')

selectStudents = "SELECT * FROM students"
selectStudentPractica = "SELECT * FROM previousPractica WHERE studentEmail IN (SELECT email FROM students)"
availableColSelect = "availableTimes.studentEmail, availableTimes.starttime, availableTimes.endtime, availableTimes.meetingid, meetingDays.monday, meetingDays.tuesday, meetingDays.wednesday, meetingDays.thursday, meetingDays.friday"
selectStudentAvailability = "SELECT " + availableColSelect + " FROM availableTimes JOIN meetingDays ON availableTimes.meetingID = meetingDays.meetingID WHERE studentEmail IN (SELECT email FROM students)"
selectStudentEndorsements = "SELECT * FROM endorsements WHERE studentemail IN (SELECT email FROM students)"
selectStudentCourses = "SELECT * FROM enrolledcourses WHERE studentemail IN (SELECT email FROM students)"
    
def load_students():
    
    students = []
    studentsFromDB = []
    studentsPractica = []
    studentsAvailability = []
    studentsEndorsements = []
    studentsCourses = []
    hasError = False
    
    db = connect_to_db()
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # Grab all students
    try:
        query = cur.mogrify(selectStudents) 
        
        cur.execute(query)
        studentsFromDB = cur.fetchall()
        print("Students", studentsFromDB)
        
    except Exception as e:
        print("Error: Invalid SELECT on 'students' table: %s" % e)
        db.rollback()
        hasError = True
    
    if not hasError:
        # Grab all students practicas
        try:
            query = cur.mogrify(selectStudentPractica) 
            
            cur.execute(query)
            studentsPractica = cur.fetchall()
            print("Previous Pactica", studentsPractica)
            
        except Exception as e:
            print("Error: Invalid SELECT on 'students' or 'availableTimes' tables: %s" % e)
            db.rollback()
            hasError = True
    
    if not hasError:    
        # Grab all students availablities
        try:
            query = cur.mogrify(selectStudentAvailability) 
            
            cur.execute(query)
            studentsAvailability = cur.fetchall()
            print("Availability", studentsAvailability)
            
        except Exception as e:
            print("Error: Invalid SELECT on 'students' or 'availableTimes' or 'meetingDays' table: %s" % e)
            db.rollback()
            hasError = True
    
    if not hasError:
        # Grab all students endorsements
        try:
            query = cur.mogrify(selectStudentEndorsements) 
            
            cur.execute(query)
            studentsEndorsements = cur.fetchall()
            print("Endorsements", studentsEndorsements)
            
        except Exception as e:
            print("Error: Invalid SELECT on 'students' or 'endorsements' table: %s" % e)
            db.rollback()
            hasError = True
    
    if not hasError:
        # Grab all students enrolled courses
        try:
            query = cur.mogrify(selectStudentCourses) 
            
            cur.execute(query)
            studentsCourses = cur.fetchall()
            print("Courses", studentsCourses)
            
        except Exception as e:
            print("Error: Invalid SELECT on 'students' or 'enrolledcourses' table: %s" % e)
            db.rollback()
            hasError = True
            
    listOfStudents = []
    
    for student in studentsFromDB:
        newStudent = {}
        newStudent['email'] = student['email']
        newStudent['firstName'] = student['firstname']#
        newStudent['lastName'] = student['lastname']#
        newStudent['hasCar'] = student['hascar']#
        newStudent['passengers'] = student['passengers'] #
        newStudent['previousPractica'] = []#
        newStudent['availability'] = []#
        newStudent['endorsements'] = []#
        newStudent['enrolledClasses'] = []#
        
        ###
        for student in studentsPractica:
            if newStudent['email'] == student['studentemail']:
                payload = {}
                payload['school'] = student['school']
                if student['grade'] == 0:
                    payload['course'] = student['course']
                else:
                    payload['course'] = student['grade']
                
                
                #col.remove(newStudent['email'])
                newStudent['previousPractica'].append(payload)
        
        print(newStudent['previousPractica'])
        
        
        ##  availableTimes.starttime, availableTimes.endtime, meetingDays.monday, meetingDays.tuesday, meetingDays.wednesday, meetingDays.thursday, meetingDays.friday
        for student in studentsAvailability:
            if newStudent['email'] == student['studentemail']:
                payload = {}
                payload['startTime'] = student['starttime']
                payload['endTime'] = student['endtime']
                payload['monday'] = student['monday']
                payload['tuesday'] = student['tuesday']
                payload['wednesday'] = student['wednesday']
                payload['thursday'] = student['thursday']
                payload['friday'] = student['friday']
                
            
                newStudent['availability'].append(payload)
        
        print(newStudent['availability'])
        
        endorsementPayload = []   
        for student in studentsEndorsements:
            
            if newStudent['email'] == student['studentemail']:
                endorsementPayload.append(student['endorsementname'])
                
        newStudent['endorsements'] = endorsementPayload
        print(newStudent['endorsements'])
                
        
        enrolledPayload = []
        for student in studentsCourses:
            if newStudent['email'] == student['studentemail']:
                enrolledPayload.append(student['coursename'])
        
        print(newStudent['enrolledClasses'])
        newStudent['enrolledClasses'] = enrolledPayload
                
        listOfStudents.append(newStudent)
    
    return listOfStudents