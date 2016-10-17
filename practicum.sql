DROP DATABASE IF EXISTS practicum;
CREATE DATABASE practicum;
\c practicum;

DROP ROLE IF EXISTS practicum_normal;
DROP ROLE IF EXISTS practicum_admin;

CREATE ROLE practicum_normal WITH PASSWORD 'password' LOGIN;
CREATE ROLE practicum_admin WITH PASSWORD 'password' LOGIN;

CREATE EXTENSION pgcrypto;

---Student Table---

DROP TABLE IF EXISTS students;
CREATE TABLE students (
  email varchar(60) NOT NULL,
  firstName varchar(60) NOT NULL default '',
  lastName varchar(60) NOT NULL default '',
  hasCar boolean NOT NULL default FALSE,
  passengers integer NOT NULL default 0,
  assignedPracticum boolean,
  PRIMARY KEY  (email),
  UNIQUE(email)
);

GRANT SELECT, INSERT ON students TO practicum_normal;
GRANT SELECT, INSERT ON students TO practicum_admin;

---Transportation Arrangements---
DROP TABLE IF EXISTS transportation;
CREATE TABLE transportation(
  driverEmail varchar(60) references students(email) NOT NULL,
  passengerEmail varchar(60) references students(email) NOT NULL
);

GRANT SELECT, INSERT ON transportation TO practicum_normal;
GRANT SELECT, INSERT ON transportation TO practicum_admin;

---Previous Practica---
DROP TABLE IF EXISTS previousPractica;
CREATE TABLE previousPractica(
  school varchar(60) NOT NULL default '',
  grade integer NOT NULL,
  course varchar(60) NOT NULL default '',
  studentEmail varchar(60) NOT NULL default '',
  FOREIGN KEY (studentEmail) references students(email)
);

GRANT SELECT, INSERT ON previousPractica TO practicum_normal;
GRANT SELECT, INSERT ON previousPractica TO practicum_admin;

---Enrolled Courses---
DROP TABLE IF EXISTS enrolledCourses;
CREATE TABLE enrolledCourses(
  courseName varchar(60) NOT NULL default '',
  studentEmail varchar(60) NOT NULL references students(email),
  PRIMARY KEY (courseName)
);

GRANT SELECT, INSERT ON enrolledCourses TO practicum_normal;
GRANT SELECT, INSERT ON enrolledCourses TO practicum_admin;

---Endorsements---
DROP TABLE IF EXISTS endorsement;
CREATE TABLE endorsements(
  endorsementName varchar(60) NOT NULL default '',
  studentEmail varchar(60),
  PRIMARY KEY (endorsementName),
  FOREIGN KEY (studentEmail) references students(email)
);

GRANT SELECT, INSERT ON endorsement TO practicum_normal;
GRANT SELECT, INSERT ON endorsement TO practicum_admin;

---Meeting Days---
DROP TABLE IF EXISTS meetingDays;
CREATE TABLE meetingDays(
  meetingID serial NOT NULL,
  monday boolean NOT NULL default FALSE,
  tuesday boolean NOT NULL default FALSE,
  wednesday boolean NOT NULL default FALSE,
  thursday boolean NOT NULL default FALSE,
  friday boolean NOT NULL default FALSE,
  UNIQUE (meetingID)
);

GRANT SELECT, INSERT ON meetingDays TO practicum_normal;
GRANT SELECT, INSERT ON meetingDays TO practicum_admin;

GRANT ALL ON meetingdays_meetingid_seq TO practicum_normal;
GRANT ALL ON meetingdays_meetingid_seq TO practicum_admin;

---Available Times---
DROP TABLE IF EXISTS availableTimes;
CREATE TABLE availableTimes(
  startTime timestamp NOT NULL,
  endTime timestamp NOT NULL,
  meetingID serial NOT NULL,
  studentEmail varchar(60) NOT NULL,
  FOREIGN KEY(meetingID) references meetingDays(meetingID),
  FOREIGN KEY(studentEmail) references students(email)
);

GRANT SELECT, INSERT ON availableTimes TO practicum_normal;
GRANT SELECT, INSERT ON availableTimes TO practicum_admin;

GRANT ALL ON availableTimes_meetingid_seq TO practicum_normal;
GRANT ALL ON availableTimes_meetingid_seq TO practicum_admin;


---School Division---
DROP TABLE IF EXISTS schoolDivisions;
CREATE TABLE schoolDivisions(
  divisionID serial,
  divisionName varchar(60) NOT NULL default '',
  PRIMARY KEY(divisionID)
);

GRANT SELECT, INSERT ON schoolDivisions TO practicum_normal;
GRANT SELECT, INSERT ON schoolDivisions TO practicum_admin;

GRANT ALL ON schooldivisions_divisionid_seq TO practicum_normal;
GRANT ALL ON schooldivisions_divisionid_seq TO practicum_admin;

---Schools---
DROP TABLE IF EXISTS schools;
CREATE TABLE schools(
  schoolID serial,
  schoolName varchar(60) NOT NULL default '',
  divisionID serial,
  PRIMARY KEY(schoolID),
  FOREIGN KEY(divisionID) references schoolDivisions(divisionID)
);

GRANT SELECT, INSERT ON schools TO practicum_normal;
GRANT SELECT, INSERT ON schools TO practicum_admin;

GRANT ALL ON schools_divisionid_seq TO practicum_normal;
GRANT ALL ON schools_divisionid_seq TO practicum_admin;

GRANT ALL ON schools_schoolid_seq TO practicum_normal;
GRANT ALL ON schools_schoolid_seq TO practicum_admin;

---Teachers---
DROP TABLE IF EXISTS teachers;
CREATE TABLE teachers(
  teacherID serial,
  email varchar(60) NOT NULL default '',
  firstName varchar(60) NOT NULL default '',
  lastName varchar(60) NOT NULL default '',
  title varchar(30) NOT NULL default '',
  grade integer,
  gradeRange varchar(60),
  hostFall boolean,
  hostSpring boolean,
  schoolID serial,
  divisionID serial,
  PRIMARY KEY(teacherID),
  FOREIGN KEY(schoolID) references schools(schoolID),
  FOREIGN KEY(divisionID) references schoolDivisions(divisionID)
);
  
GRANT SELECT, INSERT ON teachers TO practicum_normal;
GRANT SELECT, INSERT ON teachers TO practicum_admin;

GRANT ALL ON teachers_divisionid_seq TO practicum_normal;
GRANT ALL ON teachers_divisionid_seq TO practicum_admin;

GRANT ALL ON teachers_schoolid_seq TO practicum_normal;
GRANT ALL ON teachers_schoolid_seq TO practicum_admin;

GRANT ALL ON teachers_teacherid_seq TO practicum_normal;
GRANT ALL ON teachers_teacherid_seq TO practicum_admin;

---Elementary Schedule---
DROP TABLE IF EXISTS elementarySchedule;
CREATE TABLE elementarySchedule(
  course varchar(60) NOT NULL default '',
  startTime timestamp,
  endTime timestamp,
  teacherID serial,
  schoolID serial,
  FOREIGN KEY(teacherID) references teachers(teacherID),
  FOREIGN KEY(schoolID) references schools(schoolID)
);

GRANT SELECT, INSERT ON elementarySchedule TO practicum_normal;
GRANT SELECT, INSERT ON elementarySchedule TO practicum_admin;

GRANT ALL ON elementaryschedule_schoolid_seq TO practicum_normal;
GRANT ALL ON elementaryschedule_schoolid_seq TO practicum_admin;

GRANT ALL ON elementaryschedule_teacherid_seq TO practicum_normal;
GRANT ALL ON elementaryschedule_teacherid_seq TO practicum_admin;

---Middle School Schedule---
DROP TABLE IF EXISTS middleSchoolSchedule;
CREATE TABLE middleSchoolSchedule(
  dayType varchar(30) NOT NULL default '',
  block integer,
  course varchar(60) NOT NULL default '',
  startTime timestamp,
  endTime timestamp,
  teacherID serial,
  schoolID serial,
  FOREIGN KEY(teacherID) references teachers(teacherID),
  FOREIGN KEY(schoolID) references schools(schoolID)
);

GRANT SELECT, INSERT ON middleSchoolSchedule TO practicum_normal;
GRANT SELECT, INSERT ON middleSchoolSchedule TO practicum_admin;

GRANT ALL ON middleschoolschedule_schoolid_seq TO practicum_normal;
GRANT ALL ON middleschoolschedule_schoolid_seq TO practicum_admin;

GRANT ALL ON middleschoolschedule_teacherid_seq TO practicum_normal;
GRANT ALL ON middleschoolschedule_teacherid_seq TO practicum_admin;

---Practicum Arrangement---
DROP TABLE IF EXISTS practicumArrangement;
CREATE TABLE practicumArrangement(
  practicum serial,
  startTime timestamp,
  endTime timestamp,
  course varchar(60),
  studentEmail varchar(60),
  teacherID serial,
  FOREIGN KEY(studentEmail) references students(email),
  FOREIGN KEY(teacherID) references teachers(teacherID)
);

GRANT SELECT, INSERT ON practicumArrangement TO practicum_normal;
GRANT SELECT, INSERT ON practicumArrangement TO practicum_admin;

GRANT ALL ON practicumarrangement_practicum_seq TO practicum_normal;
GRANT ALL ON practicumarrangement_practicum_seq TO practicum_admin;

GRANT ALL ON practicumarrangement_teacherid_seq TO practicum_normal;
GRANT ALL ON practicumarrangement_teacherid_seq TO practicum_admin;

---Login---
DROP TABLE IF EXISTS login;
CREATE TABLE login(
  passwordID serial,
  password varchar(255) NOT NULL,
  PRIMARY KEY(passwordID)
);

GRANT SELECT, INSERT, UPDATE ON login TO practicum_normal;
GRANT SELECT, INSERT, UPDATE ON login TO practicum_admin;

GRANT ALL ON availableTimes_meetingid_seq TO practicum_normal;
GRANT ALL ON availableTimes_meetingid_seq TO practicum_admin;

---Insert Default Password---
INSERT INTO login VALUES (default, crypt('password', gen_salt('bf')));