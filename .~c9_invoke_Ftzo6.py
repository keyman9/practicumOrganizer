import sys
reload(sys)
sys.setdefaultencoding("UTF8")
import os
from flask import *
from flask_socketio import SocketIO, emit
import psycopg2
import psycopg2.extras
from collections import OrderedDict
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from db import *
import uuid
import string
import random

app = Flask(__name__)
socketio = SocketIO(app)

app.secret_key= os.urandom(24).encode('hex')

globalDict = {'accessCode': ''}

#Queries
loginQuery = "SELECT passwordid FROM login WHERE password = crypt(%s, password)"
updatePasswordQuery = "UPDATE login SET password=crypt(%s, gen_salt('bf')) WHERE passwordid = 1"


studentTable = "INSERT INTO students(email, firstName, lastName, hasCar, passengers) VALUES (%s, %s, %s, %s, %s)"
endorseTable = "INSERT INTO endorsements(endorsementName, studentemail) VALUES (%s, %s)"
meetingTable = "SELECT meetingid from meetinday where "
meetingAddon = "%s = %s"
meetingInsert = "INSERT INTO meetingdays(monday, tuesday, wednesday, thursday, friday) VALUES (%s, %s, %s, %s, %s) RETURNING meetingid"
prevPracTable = "INSERT INTO previousPractica(school,grade,course,studentEmail) VALUES (%s, %s, %s, %s)"
enrolledCourseTable = "INSERT INTO enrolledCourses(courseName,studentEmail) VALUES (%s, %s)"
availableInsert = "INSERT INTO availabletimes (starttime, endtime, meetingid, studentemail) VALUES (%s, %s, %s, %s)"

@socketio.on('submit', namespace='/student')
def submitStudent(data):
    print(data)
    print(data['email'])
    studentData = [data['email'], data['firstName'], data['lastName'], data['hasCar'], int(data['passengers'])]
    #print(studentData)
    
    #student Table
    try:
        db = connect_to_db()
        cur = db.cursor()
        #cur.mogrify(studentTable, studentData)
        cur.execute(studentTable, studentData)
        db.commit()
    except Exception as e:
        print(e)
    
    #endorsement Table
    for endorsement in data['endorsements']:
        try:
            endorsementData = [endorsement, data['email']]
            #cur.mogrify(endorseTable, endorsementData)
            cur.execute(endorseTable, endorsementData)
            print("inserted into endorsements table")
            db.commit()
        except Exception as e:
            print(e)
    
    #previousPractica Table
    for practica in data['previousPractica']:
        try:
            grade = 0
            course = ''
            if 'grade' in practica:
                grade = practica['grade']
            if 'course' in practica:
                course = practica['course']
            
            practicaData = [practica['school'], grade, course ,data['email']]
            cur.execute(prevPracTable, practicaData)
            print("inserted into prev practica table")
            db.commit()
        except Exception as e:
            print(e)
            
    #enrolledCourses Table
    for enrolledIn in data['enrolledClasses']:
       try:
            coursesData = [enrolledIn, data['email']]       
            cur.execute(enrolledCourseTable, coursesData)
            print("inserted into enrolled courses")
       except Exception as e:
            print(e) 
       
    #meetingDays Table 
    #availableTimes Table
    for times in data['availability']:
        try:
            meetingData = [times['monday'], times['tuesday'], times['wednesday'], times['thursday'], times['friday']]
            cur.execute(meetingInsert, meetingData)
            meetingID = cur.fetchone()[0]
            
            availabilityData = [times['startTime'], times['endTime'], meetingID, data['email']]       
            cur.execute(availableInsert, availabilityData)
            db.commit()
            print("inserted into meeting table and availabletimes tables")
        except Exception as e:
            print(e) 
    
 

selectStudents = "SELECT * FROM students"
selectStudentPractica = "SELECT * FROM previousPractica WHERE studentEmail IN (SELECT email FROM students)"
availableColSelect = "availableTimes.studentEmail, availableTimes.starttime, availableTimes.endtime, availableTimes.meetingid, meetingDays.monday, meetingDays.tuesday, meetingDays.wednesday, meetingDays.thursday, meetingDays.friday"
selectStudentAvailability = "SELECT " + availableColSelect + " FROM availableTimes JOIN meetingDays ON availableTimes.meetingID = meetingDays.meetingID WHERE studentEmail IN (SELECT email FROM students)"
selectStudentEndorsements = "SELECT * FROM endorsements WHERE studentemail IN (SELECT email FROM students)"
selectStudentCourses = "SELECT * FROM enrolledcourses WHERE studentemail IN (SELECT email FROM students)"

@socketio.on('loadStudents', namespace='/practica) 
def loadStudents():
    
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
        newStudent['passengers'] = student['passengers']
        newStudent['lastname'] = student['lastname']
        newStudent['hascar'] = student['hascar']
        newStudent['passengers'] = student['passengers']
        newStudent['assignedpracticum'] = student['assignedpracticum']
        newStudent['previousPractica'] = []
        newStudent['availability'] = []
        newStudent['endorsements'] = []
        newStudent['enrolledClasses'] = []
        
        for col in studentsPractica:
            if newStudent['email'] == col['studentemail']:
                #col.remove(newStudent['email'])
                newStudent['previousPractica'].append(col)
                
        for col in studentsAvailability:
            if newStudent['email'] == col['studentemail']:
                #col.remove(newStudent['email'])
                newStudent['availability'].append(col)
                
        for col in studentsEndorsements:
            if newStudent['email'] == col['studentemail']:
                #col.remove(newStudent['email'])
                newStudent['endorsements'].append(col)
                
        for col in studentsCourses:
            if newStudent['email'] == col['studentemail']:
                #col.remove(newStudent['email'])
                newStudent['enrolledClasses'].append(col)
                
        listOfStudents.append(newStudent)
    

    emit('initStudents', payload)

    
@app.route('/')
def mainIndex():
    return render_template('index.html', currentPage='home')
    
@app.route('/student', methods=['GET'])
def getStudentData():
    # if request.method == "POST":
    #     print(request.form)
    return render_template('student_form.html')
    

@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')
    
@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()
    flash('You have successfully logged out!')
    return redirect(url_for('login'))
    
@app.route('/practica', methods=['GET', 'POST'])
def assignPractica():
    hasRedirect = False
    error = ''
    if request.method == "POST":
        
        if 'password' in request.form:
            pd = request.form['password']
            hasRedirect = True
        
        db = connect_to_db()
        cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

        cur.execute("""SELECT passwordid FROM login WHERE password = crypt(%s, password)""",(pd,))
        results = cur.fetchone()
        if not results:
            error+= 'Incorrect Password.\n'
            flash('Invalid Password')
            
            hasRedirect = False
        else:
            session['userid'] = results['passwordid']
            session['loggedIn'] = True
            
        
        cur.close()
        db.close()
        if hasRedirect:
            return render_template('practicum_assignment.html')
        return redirect(url_for('login'))
        
    flash('Please log in to access practica')
    return redirect(url_for('login'))

@socketio.on('forgotPassword', namespace='/login') 
def forgotPassword():
    
    chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
    accessCode = ''.join(random.SystemRandom().choice(chars) for _ in range(10))
    globalDict['accessCode'] = accessCode
    print accessCode
    message = "A password reset has been requested for the Practicum Organizer application.\n\n" + \
    "If you did not make this request, you can ignore this email. This password reset can only be made by those who have access to the login site." + \
    "It does not indicate that the application is in any danger of being accessed by someone else.\n\n" + \
    "The access code to reset your password is: " + accessCode + "\n\nThank you."
    # emailMSG = "Your new password is:  " + accessCode + "\n\nThank you, \nBuyMyBooks"
    print(message)
    msg = MIMEText(message)
    msg['Subject'] = '[Practicum Organizer] Reset password'
    msg['From'] = 'buymybooks350@gmail.com'
    msg['To'] = 'sheldonmcclung@gmail.com' #Just to test
    sender='buymybooks350@gmail.com'
    receiver= 'sheldonmcclung@gmail.com'
    
    
    try:
        smtpObj = smtplib.SMTP("smtp.gmail.com", 587)
        #server.set_debuglevel(1)
        smtpObj.ehlo()
        smtpObj.starttls()
        smtpObj.login('buymybooks350@gmail.com', 'zacharski350')
        smtpObj.sendmail(msg['From'], msg['To'], msg.as_string())
        smtpObj.close()
        print "Successfully sent email"
    except Exception as e:
        print(e)
            
    emit('forgotPassword')
    
# @app.route('/forgotpassword', methods=['GET', 'POST'])
# def forgotPassword():
#     loggedIn = False
#     passChanged = False
#     passFailed = False
#     wrongUsername = False
#     if request.method=="POST":
#         receiver=['sheldonmcclung@gmail.com']#[request.form['email']]
#         sender = ['buymybooks350@gmail.com']
        
#         chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
#         accessCode = ''.join(random.choice(chars) for _ in range(10))
#         print accessCode
        
#         emailMSG = "Your new password is:  " + accessCode + "\n\nThank you, \nBuyMyBooks"
#         #msg = MIMEText(emailMSG)
#         #msg['Subject'] = 'Reset password'
#         #msg['From'] = 'buymybooks350@gmail.com'
#         #msg['To'] = 'sheldonmcclung@gmail.com'#request.form['email']
        
#         #conn = connectToDB()
#         #cur = conn.cursor()
        
#         # query = cur.mogrify("""SELECT * FROM users WHERE email = %s;""", ('sheldonmcclung@gmail.com',))#(request.form['email'],))
#         # print query
#         # cur.execute(query)
#         # results = cur.fetchall()
#         # print results
#         # if results != []:
#         #     try:
#         #         query = cur.mogrify("""UPDATE users SET password=crypt(%s, gen_salt('bf')) WHERE email = %s;""", (accessCode, 'sheldonmcclung@gmail.com'))#request.form['email'])) 
#         #         print query
#         #         cur.execute(query)
#         #         conn.commit()
#         #         passChanged = True
#         #         print "Password changed"
#         try:
#             smtpObj = smtplib.SMTP('smtp.gmail.com', 587)
#             #server.set_debuglevel(1)
#             smtpObj.ehlo()
#             smtpObj.starttls()
#             smtpObj.login('buymybooks350@gmail.com', 'zacharski350')
#             smtpObj.sendmail('buymybooks350@gmail.com', 'sheldonmcclung@gmail.com', emailMSG.as_string())         
#             print "Successfully sent email"
#         except Exception as e:
#             print(e)
#             # except:
#             #     print("Error changing password")
#             #     conn.rollback()
#             #     passFailed = True
#         else:
#             wrongUsername = True
#             print "Incorrect email"
#     return render_template('forgotpassword.html', loggedIn=loggedIn, passChanged=passChanged, passFailed=passFailed,
#     wrongUsername=wrongUsername)
    


@socketio.on('resetPassword', namespace='/login') 
def resetPassword(payload):
    print("Payload: %s", payload['accessCode'])
    print(payload)
    print("Access Code: " + globalDict['accessCode'])
    
    if payload['accessCode'] == globalDict['accessCode']:
        globalDict['accessCode'] = ''
        message = {'success' : 'The access code inputted is accepted!\n'}
        emit('resetPassword', message)
        
    else:    
        message = {'error' : 'The access code inputted is denied!\n'}
        emit('resetPassword', message)
    

@socketio.on('updatePassword', namespace='/login') 
def updatePassword(payload):
    print("Payload: %s", payload)
    newpass = payload['password']
    
    db = connect_to_db()
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    try:
        query = cur.mogrify(updatePasswordQuery, (newpass, )) 
        print query
        cur.execute(query)
        db.commit()
        print "Password changed"
    except Exception as e:
        print("Error: Invalid UPDATE in 'login' table: %s" % e)
        db.rollback()
    
    emit('updatePassword')
    
@socketio.on('getDivisions', namespace='/student')
def getSchoolDivisions():
    db = connect_to_db()
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    schoolDivisions = []
    
    # Grab all school divisions
    try:
        query = cur.mogrify("SELECT schoolDivisions.divisionName, ARRAY_AGG(schools.schoolName) FROM \
        schoolDivisions JOIN schools ON schoolDivisions.divisionId = schools.divisionId \
        GROUP BY schoolDivisions.divisionName ORDER BY schoolDivisions.divisionName")
        print query
        cur.execute(query)
        schoolDivisions = cur.fetchall()
        print schoolDivisions
    except Exception as e:
        print("Error: Invalid SELECT on 'schoolDivision' table: %s" % e)
        db.rollback()
    emit("retrievedDivisions", schoolDivisions)

@socketio.on('getPracticumBearing', namespace='/student')
def getPracticumBearingForStudent():
    courses = getPracticumBearing()
    emit("retrievedPracticumBearing", courses)
    
@socketio.on('getPracticumBearing', namespace='/practica')
def getPracticumBearingForAssignment():
    courses = getPracticumBearing()
    emit("retrievedPracticumBearing", courses)

def getPracticumBearing():
    db = connect_to_db()
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    courses = []
    
    # Grab all school divisions
    try:
        query = cur.mogrify("SELECT practicumCourses.courseName FROM practicumCourses")
        cur.execute(query)
        courses = cur.fetchall()
        print courses
    except Exception as e:
        print("Error: Invalid SELECT on 'practicumCourses' table: %s" % e)
        db.rollback()
    return courses
    
    

    
# @app.route('/resetpassword', methods=['GET', 'POST'])
# def resetPassword():
#     loggedIn = False
#     passChanged = False
#     passFailed = False
#     wrongPass = False
#     if 'user' in session:
#         currentUser = session['user']
#         loggedIn = True
#     if request.method=="POST":
#         oldpass = request.form['oldpassword']
#         newpass = request.form['password1']
#         conn = connectToDB()
#         cur = conn.cursor()
#         query = cur.mogrify("""SELECT * FROM users WHERE email = %s AND password = crypt(%s, password);""", (currentUser, oldpass)) 
#         print(query)
#         cur.execute(query)
#         results = cur.fetchall()
#         print results
#         if results != []:
#             try:
#                 query = cur.mogrify("""UPDATE users SET password=crypt(%s, gen_salt('bf')) WHERE email = %s;""", (newpass, currentUser)) 
#                 print query
#                 cur.execute(query)
#                 conn.commit()
#                 passChanged = True
#                 print "Password changed"
#             except:
#                 print("Error changing password")
#                 conn.rollback()
#                 passFailed = True
#         else:
#             wrongPass = True
#             print "Incorrect password"
#     return render_template('resetpassword.html', loggedIn=loggedIn, passChanged=passChanged, passFailed=passFailed, 
#     wrongPass=wrongPass)
    
if __name__ == '__main__':
    socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port =int(os.getenv('PORT', 8080)), debug=True)