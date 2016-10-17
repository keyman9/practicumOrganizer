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


globalDict = {'accessCode': ''}


#Queries
loginQuery = 'SELECT password FROM login WHERE password = crypt(%s, password)'
    
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
    
@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    
    if request.method == "POST":
        
        print(request.form) #DEBUG
        
        pd = request.form['password']
        
        db = connect_to_db()
        cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        query = cur.mogrify(loginQuery, (pw,))
        try:
            cur.execute(query)
            results = cur.fetchone()
        except Exception as e:
            print("Error: SEARCH in 'login' table: %s" % e)
            db.rollback()
        
        cur.close()
        db.close()
        
        if not results: # user does not exist
            error += 'Incorrect username or password.\n'
        else:
            session['user'] = uuid.uuid1()
            
    return render_template('dashboard.html')
    
@app.route('/practica', methods=['GET', 'POST'])
def assignPractica():
    return render_template('practicum_assignment.html')

@socketio.on('forgotPassword', namespace='/login') 
def forgotPassword():
    
    chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
    accessCode = ''.join(random.choice(chars) for _ in range(10))
    globalDict['accessCode'] = accessCode
    print accessCode
    
    emailMSG = "Your new password is:  " + accessCode + "\n\nThank you, \nBuyMyBooks"
    msg = MIMEText(emailMSG)
    msg['Subject'] = 'Reset password'
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
    print("Access Code: " + globalDict['accessCode'])
    if str(payload['accessCode']) == globalDict['accessCode']:
        globalDict['accessCode'] = ''
        emit('resetPassword')
    
    message = {'error' : 'The access code inputted is denied!\n'}
    emit('resetPassword', message)
    
@socketio.on('updatePassword', namespace='/login') 
def updatePassword(payload):
    print("Payload: %s", payload)
    
    if payload['accessCode'] == globalDict['accessCode']:
        accessCode = ''
        emit('resetPassword')
    
    message = {'error' : 'The access code inputted is denied!\n'}
    emit('resetPassword', message)
    
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