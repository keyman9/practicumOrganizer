---Student Table---

DROP TABLE IF EXISTS students CASCADE;
CREATE TABLE students (email varchar(60) NOT NULL,  firstName varchar(60) NOT NULL default '',lastName varchar(60) NOT NULL default '', hasCar boolean NOT NULL default FALSE, passengers integer NOT NULL default 0,assignedPracticum boolean default FALSE,PRIMARY KEY  (email),UNIQUE(email));

---Enrolled Courses---
DROP TABLE IF EXISTS enrolledCourses CASCADE;
CREATE TABLE enrolledCourses(courseName varchar(60) NOT NULL default '',studentEmail varchar(60) NOT NULL references students(email));

GRANT SELECT, INSERT ON enrolledCourses TO practicum_normal;
GRANT SELECT, INSERT, DELETE ON enrolledCourses TO practicum_admin;

---Endorsements---
DROP TABLE IF EXISTS endorsement CASCADE;
CREATE TABLE endorsements(endorsementName varchar(60) NOT NULL default '',studentEmail varchar(60),PRIMARY KEY (endorsementName,studentEmail),FOREIGN KEY (studentEmail) references students(email));

GRANT SELECT, INSERT ON endorsements TO practicum_normal;
GRANT SELECT, INSERT, DELETE ON endorsements TO practicum_admin;

---Available Times---
DROP TABLE IF EXISTS availableTimes CASCADE;
CREATE TABLE availableTimes(startTime varchar(40),endTime varchar(40),meetingID serial NOT NULL,studentEmail varchar(60) NOT NULL,FOREIGN KEY(meetingID) references meetingDays(meetingID),FOREIGN KEY(studentEmail) references students(email));

GRANT SELECT, INSERT ON availableTimes TO practicum_normal;
GRANT SELECT, INSERT, DELETE ON availableTimes TO practicum_admin;

GRANT ALL ON availableTimes_meetingid_seq TO practicum_normal;
GRANT ALL ON availableTimes_meetingid_seq TO practicum_admin;


---Previous Practica---
DROP TABLE IF EXISTS previousPractica CASCADE;
CREATE TABLE previousPractica(id serial,school varchar(60) NOT NULL default '',grade varchar(10) NOT NULL,course varchar(60) NOT NULL default '',studentEmail varchar(60) NOT NULL default '', PRIMARY KEY (id),FOREIGN KEY (studentEmail) references students(email));

---Transportation Arrangements---
DROP TABLE IF EXISTS transportation CASCADE;
CREATE TABLE transportation(driverEmail varchar(60) references students(email) NOT NULL,passengerEmail varchar(60) references students(email) NOT NULL);

GRANT SELECT, INSERT ON transportation TO practicum_normal;
GRANT SELECT, INSERT, DELETE ON transportation TO practicum_admin;

---Practicum Arrangement---
DROP TABLE IF EXISTS practicumArrangement CASCADE;
CREATE TABLE practicumArrangement(practicum serial,  startTime varchar(40),  endTime varchar(40),  course varchar(60),  studentEmail varchar(60),  teacherID serial,  meetingID serial,  PRIMARY KEY(practicum),  FOREIGN KEY(studentEmail) references students(email),  FOREIGN KEY(teacherID) references teachers(teacherID) ON DELETE CASCADE,  FOREIGN KEY(meetingID) references meetingDays(meetingID));

GRANT SELECT, INSERT, UPDATE ON practicumArrangement TO practicum_normal;
GRANT SELECT, INSERT, UPDATE, DELETE ON practicumArrangement TO practicum_admin;

GRANT ALL ON practicumarrangement_practicum_seq TO practicum_normal;
GRANT ALL ON practicumarrangement_practicum_seq TO practicum_admin;

GRANT ALL ON practicumarrangement_teacherid_seq TO practicum_normal;
GRANT ALL ON practicumarrangement_teacherid_seq TO practicum_admin;

GRANT ALL ON practicumarrangement_meetingid_seq TO practicum_normal;
GRANT ALL ON practicumarrangement_meetingid_seq TO practicum_admin;

GRANT SELECT, INSERT, UPDATE ON students TO practicum_normal;
GRANT SELECT, INSERT, UPDATE, DELETE ON students TO practicum_admin;
