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
import report as rp
import uuid
import string
import random
import ast
import shutil

psycopg2.extensions.register_type(psycopg2.extensions.UNICODE)
psycopg2.extensions.register_type(psycopg2.extensions.UNICODEARRAY)

app = Flask(__name__, static_folder='static')
socketio = SocketIO(app)

app.secret_key= os.urandom(24).encode('hex')

globalDict = {'accessCode': ''}

#Queries
loginQuery = "SELECT passwordid FROM login WHERE password = crypt(%s, password)"
updatePasswordQuery = "UPDATE login SET password=crypt(%s, gen_salt('bf')) WHERE passwordid = 1"

@socketio.on('submit', namespace='/student')
def submitStudent(data):
    error = False
    msg = ''
    try:
        submit_student(data)
        msg = "Your information has been submitted!"
    except Exception as e:
        print(e)
        msg = "There was an error submitting your information. Try again."
    
    emit("submissionResult", {"error": error, "msg": msg})
    
##Teacher Start

selectSchool = """SELECT schoolid FROM schools WHERE schoolName = %s"""
selectDivision = """SELECT divisionid FROM schoolDivisions WHERE divisionName = %s"""
# schoolIdByDivision = """SELECT (schoolid,divisionid) FROM schools WHERE schoolName = %s""" 
teacherInsert = """INSERT INTO teachers(email, firstname, lastname, hostSpring, hostFall, grade, schoolid, divisionid) \
                                VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING teacherid"""
insertClass = """INSERT INTO elementarySchedule(course, startTime, endTime, teacherID, schoolID, meetingID) \
                                            VALUES (%s,%s,%s,%s,%s,%s)"""
insertSecondaryCourse = """INSERT INTO middleSchoolSchedule(block,course,startTime,endTime,teacherID,schoolID,dayType) VALUES (%s,%s,%s,%s,%s,%s,%s)"""
selectTeacher = """SELECT teacherid FROM teachers WHERE email = %s"""
updateTeacher = """UPDATE teachers SET firstName = %s,lastName = %s,hostSpring = %s,hostFall = %s,grade = %s,schoolid = %s ,divisionid = %s WHERE email = %s RETURNING teacherid"""
meetingInsert = """INSERT INTO meetingdays(monday, tuesday, wednesday, thursday, friday) VALUES (%s, %s, %s, %s, %s) RETURNING meetingid"""
meetingSelect = """SELECT meetingId from meetingDays where monday = %s AND tuesday = %s AND wednesday = %s AND thursday = %s AND friday = %s"""
deleteElementary = """DELETE FROM elementarySchedule WHERE teacherID=%s""";
deleteMiddle= """DELETE FROM middleSchoolSchedule WHERE teacherID=%s""";
insertSchool = """INSERT INTO schools(schoolname, divisionid) VALUES (%s,%s) RETURNING schoolid"""
@socketio.on('submit', namespace='/teacher')
def submitTeacher(data):
    print(data)
    if 'grade' not in data and 'divisionid' in data and data['divisionid'] == '8':
        data['grade'] = 'Other'
    elif 'grade' not in data:
        data['grade'] = 'Secondary'
    
    teacherData = [data['email'], data['firstName'], data['lastName'], data['hostSpring'], data['hostFall'], data['grade']]

    error = False
    msg = ""
    
    # schoolIdDivId = []
    # teacherId = ""
    
    teacherPresent = False
    schoolPresent = False
    # try:
        # db = connect_to_db()
        # cur = db.cursor()
        # cur.execute(selectTeacher,(teacherData[0],))
        # teacherId = cur.fetchone()[0]
    teach = select_query_db(selectTeacher, (teacherData[0],))
    if teach:
        teacherId = teach[0][0]
    else:
        teacherId = False
    # db.close()
    # print(teacherId)
    if teacherId:
        teacherPresent = True
        error = delete_query_db(deleteElementary, teacherId)
        if error:
            print("error deleting elementary schedule")
        error = delete_query_db(deleteMiddle, teacherId)
        if error:
            print("error deleting middle school schedule")
                
    # except Exception as e:
    #     print(e)
            
    schoolDiv = select_query_db(selectDivision, (data['schoolDivision'],), True)[0]
    if schoolDiv:
        sch = select_query_db(selectSchool, (data['school'],), True)
        if sch:
            schoolId = select_query_db(selectSchool, (data['school'],), True)[0]
        else:
            schoolId = False
        if not schoolId:
            schoolId = write_query_db(insertSchool, (data['school'], schoolDiv), True)[0]
        
        if teacherPresent:
            #print("teacherPresent")
            teacherId = write_query_db(updateTeacher,(teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolId,schoolDiv,teacherData[0]), True)[0]
        else:   
            #print("teacherNotPresent")
            teacherId = write_query_db(teacherInsert,(teacherData[0],teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolId, schoolDiv), True)[0]
        if  len(data['elementarySchedule']) > 1:
            #elementary schedule has meetingDays, not X/Y
            #courseName, start, end, teacherid, schoolid
            
            meetingId = []
            #print("elementary")
            #get meetingDaysID for all non-electives
            meetingId = write_query_db(meetingInsert,('True','True','True','True','True'), True)[0] #ALL True here means every day of the week, since elementary
            for classType,courseInfo in data['elementarySchedule'].iteritems():
                if classType == 'lunchBreak' or classType == 'recess':
                    #print(courseInfo['course'])
                    #print(courseInfo['startTime'])
                    #print(courseInfo['endTime'])
                    write_query_db(insertClass,(courseInfo['course'],courseInfo['startTime'],courseInfo['endTime'],teacherId,schoolId,meetingId))
                    # try:
                    #     db = connect_to_db()
                    #     cur = db.cursor()
                    #     cur.execute(insertClass,(courseInfo['course'],courseInfo['startTime'],courseInfo['endTime'],teacherId,schoolIdDivId[0],meetingId))
                    #     db.commit()
                    #     db.close()
                    # except Exception as e:
                    #     error = True
                    #     print(e)
                elif classType == 'elemElectives':
                    #for each course
                    for electiveCourse in courseInfo:
                        #print(electiveCourse)
                        days = ['monday','tuesday','wednesday','thursday','friday']
                        courseDays = []
                        for day in days:
                            if day in electiveCourse:
                                courseDays.append(electiveCourse[day])
                            else:
                                courseDays.append(False)
                        #print(courseDays)    
                        #insert days returning meetingid
                        try:
                            db = connect_to_db()
                            cur = db.cursor()
                            #print(cur.mogrify(meetingInsert,(courseDays)))
                            cur.execute(meetingInsert,(courseDays))
                            db.commit()
                            courseId = cur.fetchone()[0] ##meetingid,
                            db.close()
                        except Exception as e:
                            error = True
                            print(e)
                        #insert elementarySchedule 
                        write_query_db(insertClass,(electiveCourse['course'],electiveCourse['startTime'],electiveCourse['endTime'],teacherId,schoolId,courseId))
                        # try:
                        #     db = connect_to_db()
                        #     cur = db.cursor()
                        #     #print(cur.mogrify(insertClass,(electiveCourse['course'],electiveCourse['startTime'],electiveCourse['endTime'],teacherId,schoolIdDivId[0],courseId)))
                        #     cur.execute(insertClass,(electiveCourse['course'],electiveCourse['startTime'],electiveCourse['endTime'],teacherId,schoolIdDivId[0],courseId))
                        #     db.commit()
                        #     db.close()
                        # except Exception as e:
                        #     error = True
                        #     print(e)
                else:
                    #insert items from 'elemClasses'
                    for course in courseInfo:
                        write_query_db(insertClass,(course['course'],course['startTime'],course['endTime'],teacherId,schoolId,meetingId))
                        # try:
                        #     db = connect_to_db()
                        #     cur = db.cursor()
                        #     #print(cur.mogrify(insertClass,(course['course'],course['startTime'],course['endTime'],teacherId,schoolIdDivId[0],meetingId)))
                        #     cur.execute(insertClass,(course['course'],course['startTime'],course['endTime'],teacherId,schoolIdDivId[0],meetingId))
                        #     db.commit()
                        #     db.close()
                        # except Exception as e:
                        #     error = True
 
            # try:
            #     db = connect_to_db()
            #     cur = db.cursor()
            #     cur.execute(meetingInsert,('True','True','True','True','True')) #ALL True here means every day of the week, since elementary
            #     db.commit()
            #     meetingId = cur.fetchone()[0]
            #     db.close()
            # except Exception as e:
            #     error = True
            #     print(e)
        
        else:
            print("Secondary School")
            print(data['secondarySchedule'])
            #secondary schedule select, else insert to reduce database load
             #dayType,block,course,start,end,teacherid,schoolid
            for timeSlot in data['secondarySchedule']:
                print(timeSlot)
                print("#")
                print(data['secondarySchedule'][timeSlot])
                if timeSlot == 'planning' or timeSlot == 'secondaryLunch':
                    blockNumber = 0 #magic number :( 1-8 are courses, 9 is lunch)
                    if timeSlot == 'secondaryLunch':
                        blockNumber = 9
                    #print("planning/secondary")
                    #print(blockInfo)
                    for period in data['secondarySchedule'][timeSlot]:
                        course = timeSlot
                        if timeSlot == 'secondaryLunch':
                            course = 'Lunch'
                        elif timeSlot == 'planning':
                            course = "Planning"
                        if 'dayType' not in period:
                            period['dayType'] = "Standard"
                        write_query_db(insertSecondaryCourse,(blockNumber,course,period['startTime'],period['endTime'],teacherId,schoolId,period['dayType']))
                        # try:
                        #     db = connect_to_db()
                        #     cur = db.cursor()
                        #     print("###")
                        #     print(teacherId)
                        #     insertSecondaryCourse = """INSERT INTO middleSchoolSchedule(block,course,startTime,endTime,teacherID,schoolID,dayType) VALUES (%s,%s,%s,%s,%s,%s,%s)"""
                        #     cur.execute(insertSecondaryCourse,(blockNumber,timeSlot,period['startTime'],period['endTime'],teacherId,schoolIdDivId[0],period['dayType']))
                        #     db.commit()
                        #     db.close()
                        # except Exception as e:
                        #     error = True
                        #     print(e)
                else: #timeSlot == 'secondaryClasses':
                    #print("blockClasses")
                    #print(timeSlot)
                    #print(blockInfo)
                    for secondaryClass in data['secondarySchedule'][timeSlot]:
                        print(secondaryClass)
                        if 'dayType' not in secondaryClass:
                            secondaryClass['dayType'] = "Standard"
                        write_query_db(insertSecondaryCourse,(secondaryClass['block'],secondaryClass['course'],secondaryClass['startTime'],secondaryClass['endTime'],teacherId,schoolId,secondaryClass['dayType']))
                        # try:
                        #     db = connect_to_db()
                        #     cur = db.cursor()
                        #     cur.execute(insertSecondaryCourse,(secondaryClass['block'],secondaryClass['course'],secondaryClass['startTime'],secondaryClass['endTime'],teacherId,schoolIdDivId[0],secondaryClass['dayType']))
                        #     db.commit()
                        #     db.close()
                        # except Exception as e:
                        #     error = True
                            # print(e)
        
    else: 
        error = True
        print("error: school division couldn't be found")
    
    if not error:
        msg = "Your information has been submitted!"
    else:
        msg = "There was an error submitting your information. Try again."
    
    emit("submissionResult", {"error": error, "msg": msg})

        # try:
        #     db = connect_to_db()
        #     cur = db.cursor()
        #     #print(cur.mogrify(schoolIdByDivision,(data['school'],)))
        #     #get schoolId
        #     cur.execute(schoolIdByDivision,(data['school'],))
        #     db.commit()
        #     schoolIdDivId = cur.fetchone()[0]
        #     #remove braces and comma
        #     schoolIdDivId = schoolIdDivId[1:-1].split(',')
        #     #insert teacher
        #     try:
        #         cur = db.cursor()
        #         #print(cur.mogrify(teacherInsert,(teacherData[0],teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1])))
        # if teacherPresent:
        #     #print("teacherPresent")
        #     cur.execute(updateTeacher,(teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1],teacherData[0]))
        # else:   
        #     #print("teacherNotPresent")
        #     cur.execute(teacherInsert,(teacherData[0],teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1]))
                # db.commit()
                # teacherId = cur.fetchone()[0]
                # #print(teacherId)
                # db.close()
        #     except Exception as e:
        #         error = True
        #         print(e)
        # except Exception as e:
        #     error = True
        #     print(e)
        
    # else:
    #     #print("Else")
    #     schoolDiv = data['schoolDivision']
        # elementaryGrades = ['K','1','2','3','4','5','6','Art','Music']
        #select schoolid, divisionid
            #add to teacherData object
        # try:
        #     db = connect_to_db()
        #     cur = db.cursor()
        #     #print(cur.mogrify(schoolIdByDivision,(data['school'],)))
        #     #get schoolId
        #     cur.execute(schoolIdByDivision,(data['school'],))
        #     schoolIdDivId = cur.fetchone()[0]
        #     db.close()
        #     #remove braces and comma
        #     schoolIdDivId = schoolIdDivId[1:-1].split(',')
        #     #insert teacher
        #     #print(schoolIdDivId)
        #     #try to select by email, and if so, update instead of inserting
        #     try:
        #         db = connect_to_db()
        #         cur = db.cursor()
        #         #print(cur.mogrify(teacherInsert,(teacherData[0],teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1])))
        #         if teacherPresent == True:
        #             #print("teacherPresent")
        #             #print(cur.mogrify(updateTeacher,(teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1],teacherData[0])))
        #             cur.execute(updateTeacher,(teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1],teacherData[0]))
        #         else:
        #             #print("teacherNotPresent")
        #             cur.execute(teacherInsert,(teacherData[0],teacherData[1],teacherData[2],teacherData[3],teacherData[4],teacherData[5],schoolIdDivId[0],schoolIdDivId[1]))
        #         db.commit()
        #         teacherId = cur.fetchone()[0]
        #         #print(teacherId)
        #         db.close()
        #     except Exception as e:
        #         error = True
        #         print(e)
        # except Exception as e:
        #     error = True
        #     print(e)

        #if it has a grade, it will be an elementary school teacher
        #print(data['grade'])
    

 
@socketio.on('loadStudents', namespace='/practica') 
def loadStudents():
    students = load_students()
    emit('loadStudents', students)

@socketio.on('loadTeachers', namespace='/practica') 
def loadTeachers():
    print("Load Teachers")
    teachers = load_teachers()
    emit('loadTeachers', teachers)
    
@socketio.on('loadPractica', namespace='/practica')
def loadPractica():
    practica = load_practica()
    emit('loadPractica', practica)

@socketio.on('loadTransportation', namespace='/practica') 
def loadTransportation():
    print("load transportation")
    transportation = load_transportation()
    emit('loadTransportation', transportation)

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
def practica():
    selectPasswordQuery = "SELECT passwordid FROM login WHERE password = crypt(%s, password)"
    hasRedirect = False
    error = ''
    
    if request.method == "POST":
        if 'password' in request.form:
            pd = request.form['password']
            hasRedirect = True

        results = select_query_db(selectPasswordQuery, (pd, ), True)
        
        if not results:
            error += 'Incorrect Password.\n'
            flash('Invalid Password')
            hasRedirect = False
            
        else:
            session['userid'] = results['passwordid']
            session['loggedIn'] = True

        if hasRedirect:
            return render_template('practicum_assignment.html')
        else:    
            return redirect(url_for('login'))
        
    else:
        if session and session['loggedIn']:
            return render_template('practicum_assignment.html')
        else:
            flash('Please log in to access practica')
            return redirect(url_for('login'))
        

@socketio.on('forgotPassword', namespace='/login') 
def forgotPassword():
    
    chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
    accessCode = ''.join(random.SystemRandom().choice(chars) for _ in range(10))
    globalDict['accessCode'] = accessCode
    
    TEXT = "A password reset has been requested for the Practicum Organizer application.\n\n" + \
    "If you did not make this request, you can ignore this email. This password reset can only be made by those who have access to the login site." + \
    "It does not indicate that the application is in any danger of being accessed by someone else.\n\n" + \
    "The access code to reset your password is: " + accessCode + "\n\nThank you."
    # emailMSG = "Your new password is:  " + accessCode + "\n\nThank you, \nBuyMyBooks"
    SUBJECT = '[Practicum Organizer] Reset password'
    From = 'practicumorganizer@gmail.com'
    To = 'sheldonmcclung@gmail.com' #Just to test
    
    try:
        #smtpObj = smtplib.SMTP("smtp.gmail.com", 587)
        smtpObj = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        #server.set_debuglevel(1)
        smtpObj.ehlo()
        smtpObj.login('practicumorganizer@gmail.com', 'Grown Jacob Broom Spar')
        message = 'Subject: %s\n\n%s' % (SUBJECT, TEXT)
        smtpObj.close()
        print "Successfully sent email"
    except Exception as e:
        print(e)
            
    emit('forgotPassword')
    
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
    
    write_query_db(updatePasswordQuery, (payload['password'], ))
    
    emit('updatePassword')
    
#################################    

selectSchoolDivisions = "SELECT schoolDivisions.divisionName, ARRAY_AGG(schools.schoolName) FROM \
        schoolDivisions JOIN schools ON schoolDivisions.divisionId = schools.divisionId \
        GROUP BY schoolDivisions.divisionName ORDER BY schoolDivisions.divisionName"

@socketio.on('getDivisions', namespace='/student')
def getDivisionsForStudent():
    divisions = select_query_db(selectSchoolDivisions)
    emit("retrievedDivisions", divisions)
    
@socketio.on('getDivisions', namespace='/teacher')
def getDivisionsForTeacher():
    divisions = select_query_db(selectSchoolDivisions)
    emit("retrievedDivisions", divisions)
    
@socketio.on('getDivisions', namespace='/practica')
def getDivisionsForPractica():
    divisions = select_query_db(selectSchoolDivisions)
    emit("retrievedDivisions", divisions)

@socketio.on('getDivisions', namespace='/reports')
def getDivisionsForReports():
    divisions = select_query_db(selectSchoolDivisions)
    emit("retrievedDivisions", divisions)

######################################################


selectPracticumCourses = "SELECT practicumCourses.courseName FROM practicumCourses"

@socketio.on('getPracticumBearing', namespace='/student')
def getPracticumBearingForStudent():
    courses = select_query_db(selectPracticumCourses)
    emit("retrievedPracticumBearing", courses)
    
@socketio.on('getPracticumBearing', namespace='/practica')
def getPracticumBearingForAssignment():
    courses = select_query_db(selectPracticumCourses)
    emit("retrievedPracticumBearing", courses)

@socketio.on('getPracticumBearing', namespace='/reports')
def getPracticumBearingForReports():
    courses = select_query_db(selectPracticumCourses)
    emit("retrievedPracticumBearing", courses)
    
##########################################################

@socketio.on('submitPractica', namespace='/practica')
def submitPractica(assignment):
    #print(assignment)
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
        #print("meetingSelect error")
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
    #print(meetingId)
    print(meetingId)
    
    practicumPresent = False
    if "id" in assignment:
        practicumPresent = True
    
    practicaInsert = """INSERT INTO practicumArrangement( startTime, endTime, course, studentEmail, teacherId, meetingId ) VALUES ( %s, %s, %s, %s, %s, %s) RETURNING practicum"""  
    practicaUpdate = """UPDATE practicumArrangement SET startTime=%s, endTime=%s, course=%s, studentEmail=%s, teacherId=%s, meetingId=%s WHERE practicum=%s RETURNING practicum"""
    #insert into practicumArrangement
    try:
        if practicumPresent:
            print("practicumPresent")
            try:
                cur.execute(practicaUpdate,(assignment['availability']['startTime'],assignment['availability']['endTime'],assignment['course'],assignment['studentId'],assignment['teacherId'],meetingId, assignment['id']))
                db.commit()
                result = cur.fetchone()
                print(result)
            except Exception as e:
                print(e)
        else:   
            print("practicumNotPresent")
            #insert into practicumArrangement
            try:
                db = connect_to_db()
                cur = db.cursor()
                #print(practicaInsert)
                cur.execute(practicaInsert,(assignment['availability']['startTime'],assignment['availability']['endTime'],assignment['course'],assignment['studentId'],assignment['teacherId'],meetingId))
                db.commit()
                result = cur.fetchone()[0]
                #print(result)
            except Exception as e:
                print(e)
    except Exception as e:
        print(e)
    #print("inserted..") 
  
#################################   

@socketio.on('submitTransportation', namespace='/practica')
def submitTransportation(assignment):
    print(assignment)
    insertTransportationQuery = """INSERT INTO transportation( driverEmail, passengerEmail ) VALUES ( %s, %s ) RETURNING passengeremail""";
    deleteTransporationQuery = """DELETE FROM transportation WHERE driverEmail=%s;"""
    
    driverEmail = assignment['driver']['email']
    error = delete_query_db(deleteTransporationQuery, driverEmail)
    if error:
        print("error deleting transportation")
    
    for rider in assignment['passengers']:
        riderEmail = rider['email']
        result = write_query_db(insertTransportationQuery, (driverEmail, riderEmail), True)
        if not result:
            print("error inserting transportation: " + driverEmail + ", " + riderEmail + "\n")
        else: 
            print("inserted")
    

#################################  

@socketio.on('deleteTeacher', namespace='/practica') 
def deleteTeacher(teachId):
    deleteTeacherQuery = """DELETE FROM teachers WHERE teacherID=%s;"""
    error = delete_query_db(deleteTeacherQuery, teachId)
    emit("deletedTeacher", error)

    
@socketio.on('deletePracticum', namespace='/practica')
def deletePracticum(pracId):
    print(pracId)
    deletePracticumQuery = """DELETE FROM practicumArrangement WHERE practicum=%s;"""
    error = delete_query_db(deletePracticumQuery, pracId)
    emit("deletedPracticum", error)
    
@socketio.on('deleteTransportation', namespace='/practica') 
def deleteTransportation(driverEmail):
    deleteTransporationQuery = """DELETE FROM transportation WHERE driverEmail=%s;"""
    error = delete_query_db(deleteTransporationQuery, driverEmail)
    if error:
        print("error deleting transportation")
    else:
        print("deleted")
    emit("deletedTransportation", error)
    
################################# 

@socketio.on('createReport', namespace='/reports')
def createReport(reportType, limit):
    print(limit);
    
    directory = os.path.dirname(__file__)
    archivedReports = os.path.join(directory, 'static', 'archived_reports')
    
    if reportType == "school":
        filename = os.path.join(directory, 'static', 'reports', 'schoolreport.xlsx')
        rp.create_school_report(limit, filename)
        
    elif reportType == "division":
        filename = os.path.join(directory, 'static', 'reports', 'divisionreport.xlsx')
        rp.create_schoolDivision_report(limit, filename)
        
    elif reportType == "course":
        filename = os.path.join(directory, 'static', 'reports', 'coursereport.xlsx')
        rp.create_course_report(limit, filename)
        
        # DO NOT DELETE OR I WILL HURT YOU SHELDON
        ########################################
        # zipName, zipPath = rp.batch_reports()
        # zipName = os.path.join(archivedReports, zipName)
        # print(zipName, zipPath)
        # shutil.make_archive(zipName, 'zip', zipPath)
        # shutil.rmtree(zipPath, ignore_errors=True)
        ########################################
    elif reportType == "transportation":
        print("transportation report requested")
        filename = os.path.join(directory, 'static', 'reports', 'transportationreport.xlsx')
        rp.create_transportation_report(filename)
    else:
        print("invalid report type")
    emit("reportCreated", reportType)
        
@app.route('/reports/<reportType>')
def downloadReport(reportType):
    filename = ""
    
    if reportType == "school":
        filename = "schoolreport.xlsx"
        
    elif reportType == "division":
        filename = "divisionreport.xlsx"
        
    elif reportType == "course":
        filename = "coursereport.xlsx"
    
    elif reportType == "transportation":
        filename = "transportationreport.xlsx"
        
    else:
        print("invalid report type")
    return send_from_directory(app.static_folder + "/reports", filename, as_attachment=True, 
    mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    
    #application/zip



@socketio.on("deleteReport", namespace="/reports")
def deleteReport():
    directory = os.path.dirname(__file__)
    
    if os.path.isfile(os.path.join(directory, 'static', 'reports', 'coursereport.xlsx')):
        os.remove(os.path.join(directory, 'static', 'reports', 'coursereport.xlsx'))
        
    if os.path.isfile(os.path.join(directory, 'static', 'reports', 'schoolreport.xlsx')):
        os.remove(os.path.join(directory, 'static', 'reports', 'schoolreport.xlsx'))
        
    if os.path.isfile(os.path.join(directory, 'static', 'reports', 'divisionreport.xlsx')):
        os.remove(os.path.join(directory, 'static', 'reports', 'divisionreport.xlsx'))
    
    if os.path.isfile(os.path.join(directory, 'static', 'reports', 'transportationreport.xlsx')):
        os.remove(os.path.join(directory, 'static', 'reports', 'divisionreport.xlsx'))
        
@socketio.on('archSem', namespace="/reports")
def archSem(sem):
    successfulArchive = {}
    successfulArchive = archiveSemester(sem)
    if successfulArchive['failure'] == False:
        print(successfulArchive['message'])
        print("emitting from server success")
        print({'semester': sem, 'success': "true"})
        emit('semesterArchived', {'semester': sem, 'success': "true" })
    else:
        print(successfulArchive['message'])
        print("emitting from server failure")
        emit('semesterArchived', {'semester':sem, 'success': "false"})

if __name__ == '__main__':
    socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 8080)), debug=True)
