import os
from flask import *
from flask_socketio import SocketIO, emit
import psycopg2
import psycopg2.extras
from collections import OrderedDict
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
socketio = SocketIO(app)

    
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
#         randomPass = ''.join(random.choice(chars) for _ in range(8))
#         print randomPass
        
#         emailMSG = "Your new password is:  " + randomPass + "\n\nThank you, \nBuyMyBooks"
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
#                 query = cur.mogrify("""UPDATE users SET password=crypt(%s, gen_salt('bf')) WHERE email = %s;""", (randomPass, request.form['email'])) 
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