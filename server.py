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
    
@socketio.on('submit', namespace='/student')
def submitStudent(data):
    print "here"
    print data
    
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
    
@app.route('/practica', methods=['GET', 'POST'])
def assignPractica():
    redirectPage='login.html'
    selectedMenu= 'Login'
    error = ''
    if request.method == "POST":
    
        pd = request.form['password']
        
        db = connect_to_db()
        cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

        cur.execute("""SELECT passwordid FROM login WHERE password = crypt(%s, password)""",(pd,))
        results = cur.fetchone()
        if not results:
            error+= 'Incorrect Password.\n'
        else:
            session['userid']= results['passwordid']
            redirectPage= 'practicum_assignment.html'
        
        cur.close()
        db.close()
        
    if len(error) == 0:
        emit('login', {'success' : True, 'message' : "Successfully logged in.",'userid' : session['userid']})
    else:
        emit('login', {'success' : False, 'message' : error})
  
    emit('error', {'exists' : len(error) != 0, 'message' : error, 'type' : 'login'})
    
    return render_template(redirectPage, selectedMenu=selectedMenu)

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
    msg['To'] = 'bmnosar@gmail.com' #Just to test
    
    
    try:
        smtpObj = smtplib.SMTP("smtp.gmail.com", 587)
        #server.set_debuglevel(1)
        smtpObj.ehlo()
        smtpObj.starttls()
        smtpObj.login('buymybooks350@gmail.com', 'zacharski350')
        smtpObj.sendmail(sender, receiver, msg.as_string())         
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
#         receiver=[request.form['email']]
#         sender = ['buymybooks350@gmail.com']
        
#         chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
#         accessCode = ''.join(random.choice(chars) for _ in range(8))
#         print accessCode
        
#         emailMSG = "Your new password is:  " + accessCode + "\n\nThank you, \nBuyMyBooks"
#         msg = MIMEText(emailMSG)
#         msg['Subject'] = 'Reset password'
#         msg['From'] = 'buymybooks350@gmail.com'
#         msg['To'] = request.form['email']
        
#         conn = connectToDB()
#         cur = conn.cursor()
        
#         query = cur.mogrify("""SELECT * FROM users WHERE email = %s;""", (request.form['email'],))
#         print query
#         cur.execute(query)
#         results = cur.fetchall()
#         print results
#         if results != []:
#             try:
#                 query = cur.mogrify("""UPDATE users SET password=crypt(%s, gen_salt('bf')) WHERE email = %s;""", (accessCode, request.form['email'])) 
#                 print query
#                 cur.execute(query)
#                 conn.commit()
#                 passChanged = True
#                 print "Password changed"
#                 try:
#                     smtpObj = smtplib.SMTP("smtp.gmail.com", 587)
#                     #server.set_debuglevel(1)
#                     smtpObj.ehlo()
#                     smtpObj.starttls()
#                     smtpObj.login('buymybooks350@gmail.com', 'zacharski350')
#                     smtpObj.sendmail(sender, receiver, msg.as_string())         
#                     print "Successfully sent email"
#                 except Exception as e:
#                     print(e)
#             except:
#                 print("Error changing password")
#                 conn.rollback()
#                 passFailed = True
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
    
    
selectStudents = "SELECT * FROM students"
selectStudentPractica = "SELECT * FROM previousPractica WHERE studentEmail IN (SELECT email FROM students)"
availableColSelect = "availableTimes.studentEmail, availableTimes.starttime, availableTimes.endtime, availableTimes.meetingid, meetingDays.monday, meetingDays.tuesday, meetingDays.wednesday, meetingDays.thursday, meetingDays.friday"
selectStudentAvailability = "SELECT " + availableColSelect + " FROM availableTimes JOIN meetingDays ON availableTimes.meetingID = meetingDays.meetingID WHERE studentEmail IN (SELECT email FROM students)"
@socketio.on('loadStudents', namespace='/practica') 
def loadStudents():
    
    students = []
    studentsFromDB = []
    studentsPractica = []
    studentsAvailability = []
    
    db = connect_to_db()
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # Grab all students
    try:
        query = cur.mogrify(selectStudents) 
        print query
        cur.execute(query)
        studentsFromDB = cur.fetchall()
        
    except Exception as e:
        print("Error: Invalid SELECT on 'students' table: %s" % e)
        db.rollback()
    
    # Grab all students practicas
    try:
        query = cur.mogrify(selectStudentPractica) 
        print query
        cur.execute(query)
        studentsPractica = cur.fetchall()
        
    except Exception as e:
        print("Error: Invalid SELECT on 'students' or 'availableTimes' tables: %s" % e)
        db.rollback()
        
    # Grab all students availablities
    try:
        query = cur.mogrify(selectStudentAvailability) 
        print query
        cur.execute(query)
        studentsAvailability = cur.fetchall()
        
    except Exception as e:
        print("Error: Invalid SELECT on 'students' or 'availableTimes' or 'meetingDays' table: %s" % e)
        db.rollback()
    
    
    
    emit('initializeStudents')
    
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