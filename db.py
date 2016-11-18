import psycopg2
import student as stu

def connect_to_db():
    return psycopg2.connect('dbname=practicum user=practicum_normal password=password host=localhost')

def connect_to_db_admin():
    return psycopg2.connect('dbname=practicum user=practicum_admin password=password host=localhost')
    
def query_db(db, cur, query):
    results = []
    try:
        mog = cur.mogrify(query) 
        cur.execute(mog)
        results = cur.fetchall()
        
    except Exception as e:
        print(e)
        db.rollback()
    
    return results
    
    
def load_students():
    
    selectStudents = "SELECT * FROM students"
    selectStudentPractica = "SELECT * FROM previousPractica WHERE studentEmail IN (SELECT email FROM students)"
    availableColSelect = "availableTimes.studentEmail, availableTimes.starttime, availableTimes.endtime, availableTimes.meetingid, meetingDays.monday, meetingDays.tuesday, meetingDays.wednesday, meetingDays.thursday, meetingDays.friday"
    selectStudentAvailability = "SELECT " + availableColSelect + " FROM availableTimes JOIN meetingDays ON availableTimes.meetingID = meetingDays.meetingID WHERE studentEmail IN (SELECT email FROM students)"
    selectStudentEndorsements = "SELECT * FROM endorsements WHERE studentemail IN (SELECT email FROM students)"
    selectStudentCourses = "SELECT * FROM enrolledcourses WHERE studentemail IN (SELECT email FROM students)"
    
    db = connect_to_db()
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # Grab all students
    studentsFromDB = query_db(db, cur, selectStudents)    
    
    # Grab all students practicas
    studentsPractica = query_db(db, cur, selectStudentPractica)
   
    # Grab all students availablities
    studentsAvailability = query_db(db, cur, selectStudentAvailability)
        
    # Grab all students endorsements
    studentsEndorsements = query_db(db, cur, selectStudentEndorsements)

    # Grab all students enrolled courses
    studentsCourses = query_db(db, cur, selectStudentCourses)
    
    cur.close()
    db.close()
    
    queryResults = {
        'practica' : studentsPractica,
        'availability' : studentsAvailability,
        'endorsements' : studentsEndorsements,
        'courses' : studentsCourses
    }
    
    listOfStudents = [stu.zip_students(student, queryResults) for student in studentsFromDB]
    return listOfStudents