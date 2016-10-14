DROP DATABASE IF EXISTS practicum;
CREATE DATABASE practicum;
\c practicum;

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

---Transportation Arrangements---
DROP TABLE IF EXISTS transportation;
CREATE TABLE transportation(
  driverEmail varchar(60) references students(email) NOT NULL,
  passengerEmail varchar(60) references students(email) NOT NULL
);

---Previous Practica---
DROP TABLE IF EXISTS previousPractica;
CREATE TABLE previousPractica(
  school varchar(60) NOT NULL default '',
  grade integer NOT NULL,
  course varchar(60) NOT NULL default '',
  studentEmail varchar(60) NOT NULL default '',
  FOREIGN KEY (studentEmail) references students(email)
);

---Enrolled Courses---
DROP TABLE IF EXISTS enrolledCourses;
CREATE TABLE enrolledCourses(
  courseName varchar(60) NOT NULL default '',
  studentEmail varchar(60) NOT NULL references students(email),
  PRIMARY KEY (courseName)
);

---Endorsements---
DROP TABLE IF EXISTS endorsement;
CREATE TABLE endorsements(
  endorsementName varchar(60) NOT NULL default '',
  studentEmail varchar(60),
  PRIMARY KEY (endorsementName),
  FOREIGN KEY (studentEmail) references students(email)
);

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

---School Division---
DROP TABLE IF EXISTS schoolDivisions;
CREATE TABLE schoolDivisions(
  divisionID serial,
  divisionName varchar(60) NOT NULL default '',
  PRIMARY KEY(divisionID)
);

---Schools---
DROP TABLE IF EXISTS schools;
CREATE TABLE schools(
  schoolID serial,
  schoolName varchar(60) NOT NULL default '',
  divisionID serial,
  PRIMARY KEY(schoolID),
  FOREIGN KEY(divisionID) references schoolDivisions(divisionID)
);

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

---Login---
DROP TABLE IF EXISTS login;
CREATE TABLE login(
   password varchar(30) NOT NULL
);