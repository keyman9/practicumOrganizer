DROP DATABASE IF EXISTS practicum;
CREATE DATABASE practicum ENCODING 'UTF8' TEMPLATE template0;;
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
  assignedPracticum boolean default FALSE,
  PRIMARY KEY  (email),
  UNIQUE(email)
);

GRANT SELECT, INSERT, UPDATE ON students TO practicum_normal;
GRANT SELECT, INSERT, UPDATE ON students TO practicum_admin;

---Transportation Arrangements---
DROP TABLE IF EXISTS transportation;
CREATE TABLE transportation(
  driverEmail varchar(60) references students(email) NOT NULL,
  passengerEmail varchar(60) references students(email) NOT NULL
);

GRANT SELECT, INSERT ON transportation TO practicum_normal;
GRANT SELECT, INSERT, DELETE ON transportation TO practicum_admin;

---Previous Practica---
DROP TABLE IF EXISTS previousPractica;
CREATE TABLE previousPractica(
  id serial,
  school varchar(60) NOT NULL default '',
  grade varchar(10) NOT NULL,
  course varchar(60) NOT NULL default '',
  studentEmail varchar(60) NOT NULL default '',
  PRIMARY KEY (id),
  FOREIGN KEY (studentEmail) references students(email)
);

GRANT SELECT, INSERT ON previousPractica TO practicum_normal;
GRANT SELECT, INSERT, DELETE ON previousPractica TO practicum_admin;

GRANT ALL ON previousPractica_id_seq TO practicum_normal;
GRANT ALL ON previousPractica_id_seq TO practicum_admin;

---Enrolled Courses---
DROP TABLE IF EXISTS enrolledCourses;
CREATE TABLE enrolledCourses(
  courseName varchar(60) NOT NULL default '',
  studentEmail varchar(60) NOT NULL references students(email),
  PRIMARY KEY (courseName,studentEmail)
);

GRANT SELECT, INSERT ON enrolledCourses TO practicum_normal;
GRANT SELECT, INSERT, DELETE ON enrolledCourses TO practicum_admin;

---Endorsements---
DROP TABLE IF EXISTS endorsement;
CREATE TABLE endorsements(
  endorsementName varchar(60) NOT NULL default '',
  studentEmail varchar(60),
  PRIMARY KEY (endorsementName,studentEmail),
  FOREIGN KEY (studentEmail) references students(email)
);

GRANT SELECT, INSERT ON endorsements TO practicum_normal;
GRANT SELECT, INSERT, DELETE ON endorsements TO practicum_admin;

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
  startTime varchar(40),
  endTime varchar(40),
  meetingID serial NOT NULL,
  studentEmail varchar(60) NOT NULL,
  FOREIGN KEY(meetingID) references meetingDays(meetingID),
  FOREIGN KEY(studentEmail) references students(email)
);

GRANT SELECT, INSERT ON availableTimes TO practicum_normal;
GRANT SELECT, INSERT, DELETE ON availableTimes TO practicum_admin;

GRANT ALL ON availableTimes_meetingid_seq TO practicum_normal;
GRANT ALL ON availableTimes_meetingid_seq TO practicum_admin;

--Practicum Bearing Courses--
DROP TABLE IF EXISTS practicumCourses;
CREATE TABLE practicumCourses(
  courseId serial NOT NULL,
  courseName varchar(10) NOT NULL default '',
  PRIMARY KEY(courseId)
);

GRANT SELECT ON practicumCourses to practicum_normal;
GRANT SELECT, INSERT ON practicumCourses to practicum_admin;

GRANT ALL ON practicumCourses_courseid_seq TO practicum_normal;
GRANT ALL ON practicumCourses_courseid_seq TO practicum_admin;


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
  email varchar(60) NOT NULL UNIQUE,
  firstName varchar(60) NOT NULL default '',
  lastName varchar(60) NOT NULL default '',
  grade varchar(10),
  hostFall boolean,
  hostSpring boolean,
  schoolID serial,
  divisionID serial,
  PRIMARY KEY(teacherID),
  FOREIGN KEY(schoolID) references schools(schoolID),
  FOREIGN KEY(divisionID) references schoolDivisions(divisionID)
);
  
GRANT SELECT, INSERT, UPDATE ON teachers TO practicum_normal;
GRANT SELECT, INSERT, UPDATE, DELETE ON teachers TO practicum_admin;

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
  startTime varchar(40),
  endTime varchar(40),
  teacherID serial,
  schoolID serial,
  meetingID serial,
  FOREIGN KEY(teacherID) references teachers(teacherID) ON DELETE CASCADE,
  FOREIGN KEY(schoolID) references schools(schoolID),
  FOREIGN KEY(meetingID) references meetingDays(meetingID)
);

GRANT SELECT, INSERT ON elementarySchedule TO practicum_normal;
GRANT SELECT, INSERT, DELETE ON elementarySchedule TO practicum_admin;

GRANT ALL ON elementaryschedule_meetingid_seq TO practicum_normal;
GRANT ALL ON elementaryschedule_meetingid_seq TO practicum_admin;

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
  startTime varchar(40),
  endTime varchar(40),
  teacherID serial,
  schoolID serial,
  FOREIGN KEY(teacherID) references teachers(teacherID) ON DELETE CASCADE,
  FOREIGN KEY(schoolID) references schools(schoolID)
);

GRANT SELECT, INSERT ON middleSchoolSchedule TO practicum_normal;
GRANT SELECT, INSERT, DELETE ON middleSchoolSchedule TO practicum_admin;

GRANT ALL ON middleschoolschedule_schoolid_seq TO practicum_normal;
GRANT ALL ON middleschoolschedule_schoolid_seq TO practicum_admin;

GRANT ALL ON middleschoolschedule_teacherid_seq TO practicum_normal;
GRANT ALL ON middleschoolschedule_teacherid_seq TO practicum_admin;

---Practicum Arrangement---
DROP TABLE IF EXISTS practicumArrangement;
CREATE TABLE practicumArrangement(
  practicum serial,
  startTime varchar(40),
  endTime varchar(40),
  course varchar(60),
  studentEmail varchar(60),
  teacherID serial,
  meetingID serial,
  PRIMARY KEY(practicum),
  FOREIGN KEY(studentEmail) references students(email),
  FOREIGN KEY(teacherID) references teachers(teacherID) ON DELETE CASCADE,
  FOREIGN KEY(meetingID) references meetingDays(meetingID)
);

GRANT SELECT, INSERT, UPDATE ON practicumArrangement TO practicum_normal;
GRANT SELECT, INSERT, UPDATE, DELETE ON practicumArrangement TO practicum_admin;

GRANT ALL ON practicumarrangement_practicum_seq TO practicum_normal;
GRANT ALL ON practicumarrangement_practicum_seq TO practicum_admin;

GRANT ALL ON practicumarrangement_teacherid_seq TO practicum_normal;
GRANT ALL ON practicumarrangement_teacherid_seq TO practicum_admin;

GRANT ALL ON practicumarrangement_meetingid_seq TO practicum_normal;
GRANT ALL ON practicumarrangement_meetingid_seq TO practicum_admin;
 
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

--School Divisions--
INSERT INTO schoolDivisions(divisionName) VALUES ('Fredericksburg');
INSERT INTO schoolDivisions(divisionName) VALUES ('Spotsylvania');
INSERT INTO schoolDivisions(divisionName) VALUES ('Stafford');
INSERT INTO schoolDivisions(divisionName) VALUES ('Fauquier');
INSERT INTO schoolDivisions(divisionName) VALUES ('Prince William');
INSERT INTO schoolDivisions(divisionName) VALUES ('Non-Public');
INSERT INTO schoolDivisions(divisionName) VALUES ('Montessori');
INSERT INTO schoolDivisions(divisionName) VALUES ('Other');

--Schools--
--Fredericksburg--
INSERT INTO schools(schoolName,divisionId) VALUES ('Hugh Mercer Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fredericksburg'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Lafayette Upper Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fredericksburg'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Walker-Grant Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fredericksburg'));
INSERT INTO schools(schoolName,divisionId) VALUES ('James Monroe High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fredericksburg'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Travels', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fredericksburg'));

--Spotsylvania--
INSERT INTO schools(schoolName,divisionId) VALUES ('Battlefield Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania'));                                                   
INSERT INTO schools(schoolName,divisionId) VALUES ('Berkeley Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Brock Road Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Cedar Forest Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Chancellor Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Courthouse Road Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Courtland Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Harrison Road Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Lee Hill Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Livingston Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Parkside Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Riverview Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Robert E. Lee Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Salem Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Smith Station Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Spotswood Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Wilderness Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Battlefield Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Chancellor Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Freedom Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Ni River Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Post Oak Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Spotsylvania Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Thornburg Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Chancellor High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Courtland High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Massaponax High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Riverbend High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Spotsylvania High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
INSERT INTO schools(schoolName,divisionId) VALUES ('Travels', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Spotsylvania')); 
    
--Stafford--
INSERT INTO schools(schoolName,divisionId) VALUES ('Anne E. Moncure Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Anthony Burns Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Conway Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Falmouth Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Ferry Farm Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Garrisonville Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Grafton Village Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Hampton Oaks Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Hartwood Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Kate Waller Barrett Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Margaret Brent Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Park Ridge Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Rockhill Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Rocky Run Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Stafford Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Widewater Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('A. G. Wright Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Brooke Point High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Dixon-Smith Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Colonial Forge High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Edward E. Drew Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('H. H. Poole Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Mountain View High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('North Stafford High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Rodney Thompson Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Shirley C. Heim Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Stafford High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Stafford Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('T. Benton Gayle Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Travels', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Stafford'));
    
--Fauquier--
INSERT INTO schools(schoolName,divisionId) VALUES ('Bradley Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
 INSERT INTO schools(schoolName,divisionId) VALUES ('Brumfield Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Coleman Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Greenville Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Miller Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Pearson Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Pierce Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Ritchie Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Smith Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Thompson Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Walter Elementary School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Auburn Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Cedar Lee Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Fauquier High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Kettle Run High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Liberty High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Marshall Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Southeastern Alternative Middle & High School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Taylor Middle School', 
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Warrenton Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Travels',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Fauquier'));

--Prince William--
INSERT INTO schools(schoolName,divisionId) VALUES ('Alvey Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Antietam Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Ashland Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Bel Air Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Belmont Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Bennett Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Bristow Run Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Buckland Mills Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Cedar Point Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Chris Yung Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Coles Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Dale City Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Dumfries Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Ellis Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Enterprise Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Featherstone Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Fitzgerald Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Glenkirk Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Gravely Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Haymarket Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Henderson Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Kerrydale Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Kilby Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('King Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Kyle R. Wilson Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Lake Ridge Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Leesylvania Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Loch Lomond Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Marshall Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Marumsco Hills Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('McAuliffe Elementary School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Minnieville Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Montclair Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Mountain View Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Neabsco Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('The Nokesville School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Occoquan Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Old Bridge Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Pattie Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Penn Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Piney Branch Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Potomac View Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('River Oaks Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Rockledge Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Rosa Parks Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Signal Hill Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Sinclair Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Springwoods Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Sudley Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Swans Creek Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('T. Clay Wood Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Triangle Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Tyler Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Vaughan Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Victory Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('West Gate Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Westridge Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Williams Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Yorkshire Elementary  School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Battlefield High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Benton Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Beville Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Brentsville District High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Bull Run Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Colgan High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Forest Park High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Fred M. Lynn Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Freedom High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Gainesville Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Gar-Field High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Graham Park Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Hampton Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Hylton High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Lake Ridge Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Marsteller Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Osbourn Park High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('PACE West',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Parkside Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Patriot High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Pennington Traditional School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Porter Traditional School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Potomac High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Potomac Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Reagan Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Rippon Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Saunders Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Stonewall Jackson High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Stonewall Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Woodbridge High School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Woodbridge Middle School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Travels',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Prince William'));
 
    
--Non-Public--    
INSERT INTO schools(schoolName,divisionId) VALUES ('Holy Cross Academy',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Non-Public'));
INSERT INTO schools(schoolName,divisionId) VALUES ('St. Patrick''s School',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Non-Public'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Grace Preparatory',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Non-Public'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Temple Baptist',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Non-Public'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Faith Baptist',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Non-Public'));
 INSERT INTO schools(schoolName,divisionId) VALUES ('Travels',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Non-Public'));
    
--Montessori--    
INSERT INTO schools(schoolName,divisionId) VALUES ('Children''s House of Old Town',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Montessori'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Lighthouse Academy of Fredericksburg',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Montessori'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Odyssey Montessori',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Montessori'));
 INSERT INTO schools(schoolName,divisionId) VALUES ('Travels',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Montessori'));
    
--Other--
INSERT INTO schools(schoolName,divisionId) VALUES ('Head Start',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Other'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Friends of the Rappahannock',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Other'));
INSERT INTO schools(schoolName,divisionId) VALUES ('Travels',
 (SELECT divisionId FROM schoolDivisions WHERE divisionName = 'Other'));

--Practicum Bearing Courses--
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 303');
INSERT INTO practicumCourses(courseName) VALUES ('EDUC 203');
INSERT INTO practicumCourses(courseName) VALUES ('EDUC 204');
INSERT INTO practicumCourses(courseName) VALUES ('EDUC 305');
INSERT INTO practicumCourses(courseName) VALUES ('EDUC 351A');
INSERT INTO practicumCourses(courseName) VALUES ('EDUC 371');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 373');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 385');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 388');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 453');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 454');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 455');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 456');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 457');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 458');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 459');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 510');
INSERT INTO practicumCourses(courseName) VALUES ('MATH 204');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 501');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 502');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 507');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 509');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 515');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 519');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 521');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 523');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 538');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 552');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 553');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 554');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 555');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 556');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 557');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 558');
INSERT INTO practicumCourses(courseName) VALUES ('EDCI 559');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 512');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 519');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 521');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 539');
INSERT INTO practicumCourses(courseName) VALUES ('EDSE 541');
INSERT INTO practicumCourses(courseName) VALUES ('TESL 515');