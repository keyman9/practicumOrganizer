import sys
reload(sys)
sys.setdefaultencoding("UTF8")
import os
from flask import *
from flask_socketio import SocketIO, emit
import psycopg2
import psycopg2.extras
from collections import OrderedDict
from collections import defaultdict
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from db import *
import uuid
import string
import random
import ast

psycopg2.extensions.register_type(psycopg2.extensions.UNICODE)
psycopg2.extensions.register_type(psycopg2.extensions.UNICODEARRAY)

app = Flask(__name__)
socketio = SocketIO(app)

app.secret_key= os.urandom(24).encode('hex')

globalDict = {'accessCode': ''}

#Queries
loginQuery = "SELECT passwordid FROM login WHERE password = crypt(%s, password)"
updatePasswordQuery = "UPDATE login SET password=crypt(%s, gen_salt('bf')) WHERE passwordid = 1"


studentTable = "INSERT INTO students(email, firstName, lastName, hasCar, passengers) VALUES (%s, %s, %s, %s, %s)"
endorseTable = "INSERT INTO endorsements(endorsementName, studentemail) VALUES (%s, %s)"
meetingInsert = "INSERT INTO meetingdays(monday, tuesday, wednesday, thursday, friday) VALUES (%s, %s, %s, %s, %s) RETURNING meetingid"
meetingSelect = """SELECT meetingId from meetingDays where monday = '%s' AND tuesday = '%s' AND wednesday = '%s' AND thursday = '%s' AND friday = '%s'"""

prevPracTable = "INSERT INTO previousPractica(school,grade,course,studentEmail) VALUES (%s, %s, %s, %s)"
enrolledCourseTable = "INSERT INTO enrolledCourses(courseName,studentEmail) VALUES (%s, %s)"
availableInsert = "INSERT INTO availabletimes (starttime, endtime, meetingid, studentemail) VALUES (%s, %s, %s, %s)"

@socketio.on('submit', namespace='/student')
def submitStudent(data):
    print(data)
    print(data['email'])
    studentData = [data['email'], data['firstName'], data['lastName'], data['hasCar'], int(data['passengers'])]
    #print(studentData)
    error = False
    msg = ""
    
    #student Table
    try:
        db = connect_to_db()
        cur = db.cursor()
        #cur.mogrify(studentTable, studentData)
        cur.execute(studentTable, studentData)
        db.commit()
    except Exception as e:
        error = True
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
            error = True
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
            error = True
            print(e)
            
    #enrolledCourses Table
    for enrolledIn in data['enrolledClasses']:
       try:
            coursesData = [enrolledIn, data['email']]       
            cur.execute(enrolledCourseTable, coursesData)
            print("inserted into enrolled courses")
       except Exception as e:
            error = True
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
            error = True
            print(e)
    
    if not error:
        msg = "Your information has been submitted!"
    else:
        msg = "There was an error submitting your information. Try again."
    
    emit("submissionResult", {"error": error, "msg": msg})
    
##Teacher Start

selectSchool = """SELECT schoolid FROM schools WHERE schoolname = '%s'"""
selectDivision = """SELECT (divisionid) FROM schoolDivisions WHERE divisionId = '%s'"""
schoolIdByDivision = """SELECT (schoolid,divisionid) FROM schools WHERE schoolName = %s""" 
teacherInsert = """INSERT INTO teachers(email, firstname, lastname, hostSpring, hostFall, grade, schoolid, divisionid) \
                                VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING teacherid"""
insertClass = """INSERT INTO elementarySchedule(course, startTime, endTime, teacherID, schoolID, meetingID) \
                                            VALUES (%s,%s,%s,%s,%s,%s)"""
selectTeacher = """SELECT teacherid FROM teachers WHERE email = %s"""
updateTeacher = """UPDATE teachers SET firstName = %s,lastName = %s,hostSpring = %s,hostFall = %s,grade = %s,schoolid = %s ,divisionid = %s WHERE email = %s RETURNING teacherid"""
@socketio.on('submit', namespace='/teacher')
def submitTeacher(data):
    print(data)
    if 'grade' not in data:
        data['grade'] = 'Other'
    
    teacherData = [data['email'], data['firstName'], data['lastName'], data['hostSpring'], data['hostFall'], data['grade']]

    error = False
    msg = ""
    
    schoolIdDivId = []
    teacherId = ""
    
    teacherPresent = False
    try:
        db = connect_to_db()
        cur = db.cursor()
        cur.execute(selectTeacher,(teacherData[0],))
        teacherId = cur.fetchone()[0]
        print(teacherId)
        if teacherId:
            teacherPresent = True
    except Exception as e:
        print(e)
            
    ###edge case -- Other School, no course info
    if data['school'] == "Other":
        #get school id
        try:
            db = connect_to_db()
            cur = db.cursor()
            print(cur.mogrify(schoolIdByDivision,(data['school'],)))
            #get schoolId
            cur.execute(schoolIdByDivision,(data['school'],))
            db.commit()
            schoolIdDivId = cur.fetchone()[0]
            #remove braces and comma
            schoolIdDivId = schoolIdDivId[1:-1].split(',')
            #insert teacher
            try:
                cur = db.cursor()
                #print(cur.mogrify(teacherInsert,(teacherData[0],teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1])))
                if teacherPresent:
                    print("teacherPresent")
                    cur.execute(updateTeacher,(teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1],teacherData[0]))
                else:   
                    print("teacherNotPresent")
                    cur.execute(teacherInsert,(teacherData[0],teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1]))
                db.commit()
                teacherId = cur.fetchone()[0]
                print(teacherId)
            except Exception as e:
                error = True
                print(e)
        except Exception as e:
            error = True
            print(e)
        
    else:
        print("Else")
        schoolDiv = data['schoolDivision']
        elementaryGrades = ['K','1','2','3','4','5','6','Art','Music']
        #select schoolid, divisionid
            #add to teacherData object
        try:
            db = connect_to_db()
            cur = db.cursor()
            print(cur.mogrify(schoolIdByDivision,(data['school'],)))
            #get schoolId
            cur.execute(schoolIdByDivision,(data['school'],))
            schoolIdDivId = cur.fetchone()[0]
            #remove braces and comma
            schoolIdDivId = schoolIdDivId[1:-1].split(',')
            #insert teacher
            print(schoolIdDivId)
            #try to select by email, and if so, update instead of inserting
            try:
                cur = db.cursor()
                #print(cur.mogrify(teacherInsert,(teacherData[0],teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1])))
                if teacherPresent == True:
                    print("teacherPresent")
                    print(cur.mogrify(updateTeacher,(teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1],teacherData[0])))
                    cur.execute(updateTeacher,(teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1],teacherData[0]))
                else:
                    print("teacherNotPresent")
                    cur.execute(teacherInsert,(teacherData[0],teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1]))
                db.commit()
                teacherId = cur.fetchone()[0]
                print(teacherId)
            except Exception as e:
                error = True
                print(e)
        except Exception as e:
            error = True
            print(e)

        #if it has a grade, it will be an elementary school teacher
        #print(data['grade'])
        if 'Elementary' in data['school']:
            #elementary schedule has meetingDays, not X/Y
            #courseName, start, end, teacherid, schoolid
            
            meetingId = []
            print("elementary")
            #get meetingDaysID for all non-electives
            try:
                db = connect_to_db()
                cur = db.cursor()
                cur.execute(meetingInsert,('True','True','True','True','True'))
                db.commit()
                meetingId = cur.fetchone()[0]
            except Exception as e:
                error = True
                print(e)
            
            for classType,courseInfo in data['elementarySchedule'].iteritems():
                if classType == 'lunchBreak' or classType == 'recess':
                    #print(courseInfo['course'])
                    #print(courseInfo['startTime'])
                    #print(courseInfo['endTime'])
                    try:
                        db = connect_to_db()
                        cur = db.cursor()
                        cur.execute(insertClass,(courseInfo['course'],courseInfo['startTime'],courseInfo['endTime'],teacherId,schoolIdDivId[0],meetingId))
                        db.commit()
                    except Exception as e:
                        error = True
                        print(e)
                elif classType == 'elemElectives':
                    #for each course
                    for electiveCourse in courseInfo:
                        print(electiveCourse)
                        days = ['monday','tuesday','wednesday','thursday','friday']
                        courseDays = []
                        for day in days:
                            if day in electiveCourse:
                                courseDays.append(electiveCourse[day])
                            else:
                                courseDays.append(False)
                        print(courseDays)    
                        #insert days returning meetingid
                        try:
                            db = connect_to_db()
                            cur = db.cursor()
                            print(cur.mogrify(meetingInsert,(courseDays)))
                            cur.execute(meetingInsert,(courseDays))
                            db.commit()
                            courseId = cur.fetchone()[0] ##meetingid,
                        except Exception as e:
                            error = True
                            print(e)
                        #insert elementarySchedule    
                        try:
                            db = connect_to_db()
                            cur = db.cursor()
                            print(cur.mogrify(insertClass,(electiveCourse['course'],electiveCourse['startTime'],electiveCourse['endTime'],teacherId,schoolIdDivId[0],courseId)))
                            cur.execute(insertClass,(electiveCourse['course'],electiveCourse['startTime'],electiveCourse['endTime'],teacherId,schoolIdDivId[0],courseId))
                            db.commit()
                        except Exception as e:
                            error = True
                            print(e)
                else:
                    #insert items from 'elemClasses'
                    for course in courseInfo:
                        try:
                            db = connect_to_db()
                            cur = db.cursor()
                            print(cur.mogrify(insertClass,(course['course'],course['startTime'],course['endTime'],teacherId,schoolIdDivId[0],meetingId)))
                            cur.execute(insertClass,(course['course'],course['startTime'],course['endTime'],teacherId,schoolIdDivId[0],meetingId))
                            db.commit()
                        except Exception as e:
                            error = True
                            print(e)
        
        else:
            #secondary schedule select, else insert to reduce database load
             #dayType,block,course,start,end,teacherid,schoolid
            for timeSlot,blockInfo in data['secondarySchedule'].iteritems():
                if timeSlot == 'planning' or timeSlot == 'secondaryLunch':
                    blockNumber = 0 #magic number :( 1-8 are courses, 9 is lunch)
                    if timeSlot == 'secondaryLunch':
                        blockNumber = 9
                    #print("planning/secondary")
                    #print(blockInfo)
                    for period in blockInfo:
                        try:
                            db = connect_to_db()
                            cur = db.cursor()
                            insertSecondaryCourse = """INSERT INTO middleSchoolSchedule(block,course,startTime,endTime,teacherID,schoolID,dayType) VALUES (%s,%s,%s,%s,%s,%s,%s)"""
                            cur.execute(insertSecondaryCourse,(blockNumber,timeSlot,period['startTime'],period['endTime'],teacherId,schoolIdDivId[0],period['dayType']))
                            db.commit()
                        except Exception as e:
                            error = True
                            print(e)
                else: #timeSlot == 'secondaryClasses':
                    print("blockClasses")
                    print(timeSlot)
                    print(blockInfo)
                    for secondaryClass in blockInfo:
                        print(secondaryClass)
                        if 'dayType' not in secondaryClass:
                            secondaryClass['dayType'] = "Standard"
                        try:
                            db = connect_to_db()
                            cur = db.cursor()
                            cur.execute(insertSecondaryCourse,(secondaryClass['block'],secondaryClass['course'],secondaryClass['startTime'],secondaryClass['endTime'],teacherId,schoolIdDivId[0],secondaryClass['dayType']))
                            db.commit()
                        except Exception as e:
                            error = True
                            print(e)
    
    if not error:
        msg = "Your information has been submitted!"
    else:
        msg = "There was an error submitting your information. Try again."
    
    emit("submissionResult", {"error": error, "msg": msg})
 

selectStudents = "SELECT * FROM students"
selectStudentPractica = "SELECT * FROM previousPractica WHERE studentEmail IN (SELECT email FROM students)"
availableColSelect = "availableTimes.studentEmail, availableTimes.starttime, availableTimes.endtime, availableTimes.meetingid, meetingDays.monday, meetingDays.tuesday, meetingDays.wednesday, meetingDays.thursday, meetingDays.friday"
selectStudentAvailability = "SELECT " + availableColSelect + " FROM availableTimes JOIN meetingDays ON availableTimes.meetingID = meetingDays.meetingID WHERE studentEmail IN (SELECT email FROM students)"
selectStudentEndorsements = "SELECT * FROM endorsements WHERE studentemail IN (SELECT email FROM students)"
selectStudentCourses = "SELECT * FROM enrolledcourses WHERE studentemail IN (SELECT email FROM students)"

@socketio.on('loadStudents', namespace='/practica') 
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
    
    print(listOfStudents)
    
    emit('loadStudents', listOfStudents)

    
@app.route('/')
def mainIndex():
    return render_template('index.html', currentPage='home')
    
@app.route('/student', methods=['GET'])
def getStudentData():
    return render_template('student_form.html')

@app.route('/teacher', methods=['GET'])
def getTeacherData():
    return render_template('teacher_form.html')

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
    subject = '[Practicum Organizer] Reset password'
    From = 'practicumorganizer@gmail.com'
    To = 'lcarter3@mail.umw.edu' #Just to test
    
    try:
        #smtpObj = smtplib.SMTP("smtp.gmail.com", 587)
        smtpObj = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        print("HERE 1")
        #server.set_debuglevel(1)
        smtpObj.ehlo()
        print("Here 2")
        print("Here 3")
        smtpObj.login('practicumorganizer@gmail.com', 'Grown Jacob Broom Spar')
        print("Here 4")
        smtpObj.sendmail(From, To, msg.as_string())
        print("Here 5")
        smtpObj.close()
        print("Here 6")
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
        message = {'success' : 'Access code accepted!\n'}
        emit('resetPassword', message)
        
    else:    
        message = {'error' : 'Access code denied!\n'}
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
def getDivisionsForStudent():
    divisions = getSchoolDivisions()
    emit("retrievedDivisions", divisions)
    
@socketio.on('getDivisions', namespace='/teacher')
def getDivisionsForTeacher():
    divisions = getSchoolDivisions()
    emit("retrievedDivisions", divisions)
    
@socketio.on('getDivisions', namespace='/practica')
def getDivisionsForPractica():
    divisions = getSchoolDivisions()
    emit("retrievedDivisions", divisions)

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
    return schoolDivisions


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
    
@socketio.on('submitPractica', namespace='/practica')
def submitPractica(assignment):
    print(assignment)
    #TODO: insert/update in database
    result = defaultdict(list)
    #meetingDays table
    meetingPresent = False
    try:
        db = connect_to_db()
        cur = db.cursor()
        #select meetingId
        query = cur.mogrify(meetingSelect,(assignment['availability']['monday'],assignment['availability']['tuesday'],assignment['availability']['wednesday'],assignment['availability']['thursday'],assignment['availability']['friday']))
        cur.execute(query)
        result = cur.fetchone()[0]
    except Exception as e:
        print("meetingSelect error")
        print(e)
    
    if not result:
        try:
            query = cur.mogrify(meetingInsert,(assignment['availability']['monday'],assignment['availability']['tuesday'],assignment['availability']['wednesday'],assignment['availability']['thursday'],assignment['availability']['friday']))
            cur.execute(query)
            db.commit()
            result = cur.fetchone()[0]
        except Exception as e:
            print(e)
    meetingId = result 
    print(meetingId)
        
    practicaInsert = """INSERT INTO practicumArrangement( startTime, endTime, course, studentEmail, teacherId, meetingId ) VALUES ( %s, %s, %s, %s, %s, %s) RETURNING practicum"""
    start = assignment['availability']['startTime']
    end = assignment['availability']['endTime']
    #insert into practicumArrangement
    try:
        print("trying...")
        db = connect_to_db()
        cur = db.cursor()
        print(practicaInsert)
        cur.execute(practicaInsert,(start,end,assignment['course'],assignment['studentId'],assignment['teacherId'],meetingId))
        db.commit()
        result = cur.fetchone()[0]
        print(result)
    except Exception as e:
        print(e)
    print("inserted..")    
    
@socketio.on('deletePractica', namespace='/practica')
def deletePractica(assignment):
    print(assignment)
    #TODO: delete from database, resend assignments
    
    

    
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