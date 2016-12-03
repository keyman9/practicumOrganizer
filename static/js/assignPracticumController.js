'use strict';
angular.module('POBoxApp').controller('AssignPracticumController', function($scope, $window, $popover){
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/practica')
    
    // var teacher = {'firstName': 'Minerva', 
    //     'lastName': 'McGonagall', 
    //     'email': 'mcgonagall@hogwarts.uk',
    //     'id': 1,
    //     'school': 'Hogwarts',
    //     'schoolDivision': 'UK',
    //     'grade': 5, 
    //     'hostFall': true, 
    //     'hostSpring': false,
    //     'elementarySchedule': [
    //         {'course': 'Intro to Transfiguration', 'startTime': '10:00AM', 'endTime': '11:00AM'}, 
    //         {'course': 'Transfiguration 201', 'startTime': '12:00PM', 'endTime': '1:00PM'},  
    //         {'course': 'Advanced Transfiguration', 'startTime': '2:00PM', 'endTime': '3:00PM'}
    //     ]};
        
    // var teacher1 = {'firstName': 'Severus', 
    //     'lastName': 'Snape', 
    //     'email': 'snape@hogwarts.uk',
    //     'id': 2,
    //     'school': 'Hogwarts',
    //     'schoolDivision': 'UK',
    //     'grade': undefined, 
    //     'hostFall': true, 
    //     'hostSpring': true,
    //     'secondarySchedule': [
    //         {'dayType': 'A/X', 'block': '1', 'course': 'Intro to Potions', 'startTime': '09:00AM', 'endTime': '11:00AM'}, 
    //         {'dayType': 'B/Y', 'block': '5', 'course': 'Potions 201', 'startTime': '12:00PM', 'endTime': '1:00PM'},  
    //         {'dayType': 'A/X', 'block': '2', 'course': 'Advanced Potions', 'startTime': '2:00PM', 'endTime': '3:00PM'}
    //     ]};
    
    
    $scope.endorsements = ["N/A", "Elementary Education pK-6", "English", "Foreign Language- French", "Foreign Language- German", 
    "Foreign Language- Latin", "Foreign Language- Spanish", "History & Social Sciences", "Mathematics", 
    "Music preK-12: Instrumental", "Music preK-12: Vocal/ Choral", "Science: Biology", "Science: Chemistry",
    "Science: Earth Science", "Science: Physics", "Special Education K-12: Adapted Curriculum", 
    "Special Education K-12: General Curriculum", "Theater Arts preK-12", "Visual Art preK-12"];
    
    $scope.grades = [{"displayName": "K", "value": 0}, {"displayName": "1", "value": 1}, {"displayName": "2", "value": 2},
    {"displayName": "3", "value": 3}, {"displayName": "4", "value": 4}, {"displayName": "5", "value": 5}, 
    {"displayName": "6", "value": 6}, {"displayName": "7", "value": 7}, {"displayName": "8", "value": 8},
    {"displayName": "9", "value": 9}, {"displayName": "10", "value": 10}, {"displayName": "11", "value": 11},
    {"displayName": "12", "value": 12}, {"displayName": "Art", "value": -1}, {"displayName": "Music", "value": -1},
    {"displayName": "Special Education: Adapted", "value": -1}, {"displayName": "Special Education: General", "value": -1}];
    
    $scope.subjects = ["English 6", "English 7", "English 8", "Advanced English 8", "English 9", "Advanced English 9", "English 10", 
    "Advanced English 10", "English 11", "Advanced English 11", "AP/DE/IB English 11", "English 12", "Advanced English 12", 
    "AP/DE/IB English 12", "Math 6", "Math 7", "Math 8", "Pre-Algebra", "Algebra I", "Geometry", "Algebra II", 
    "Advanced Algebra II", "Statistics", "AP/DE/IB Statistics", "Calculus", "AP/DE/IB Calculus", "United States History: 1865 to the Present", 
    "Civics and Economics", "World History and Geography to 1500 AD (C.E.)", "Advanced World History and Geography to 1500 AD (C.E.)", 
    "World Geography", "AP/DE/IB Human Geography", "World History 1500 AD (C.E.) to Present", "AP/DE/IB World History", 
    "Virginia and United States History", "AP/DE/IB United States History", "Virginia and United States Government", 
    "AP/DE/IB United States Government", "AP/DE/IB European History", "Science 6", "Life Science", "Physical Science", 
    "Advanced Physical Science", "Earth Science", "Advanced Earth Science", "Earth Science II", "Biology", "Advanced Biology", 
    "Human Anatomy and Physiology", "AP/DE/IB Biology", "Chemistry", "Advanced Chemistry", "Chemistry II", "AP/DE/IB Chemistry", 
    "Physics", "Advanced Physics", "AP/DE/IB Physics", "Environmental Science", "AP/DE/IB Environmental Science", "Marine Science",
    "Art (Grade 6)", "Art (Grade 7)", "Art (Grade 8)", "Art I", "Art II", "Art III", "Art IV", "AP/DE/IB Art", "Chorus I", 
    "Chorus II", "Chorus III", "Band I", "Band II", "Band III", "String Orchestra I", "String Orchestra II", "String Orchestra III", 
    "Hands-On Music", "Band Class", "Percussion Class", "Concert Performance Band I", "Concert Performance Band II", "Symphonic Performance Band I", 
    "Symphonic Performance Band II", "Performance Jazz Band I", "Performance Jazz Band II", "Concert Performance String Orchestra I", 
    "Concert Performance String Orchestra II", "Symphonic Performance String Orchestra I", "Symphonic Performance String Orchestra II", 
    "Women’s Chorus/Men’s Chorus I", "Women’s Chorus/Men’s Chorus II", "Concert Chorus I", "Concert Chorus II", "Vocal Ensemble I", 
    "Vocal Ensemble II", "Music Theory/Appreciation", "AP/DE/IB Music Theory", "Theatre Arts (Grade 8)", "Theatre Arts I", 
    "Theatre Arts II", "Theatre Arts III", "Theatre Arts IV", "AP/DE/IB Theatre Arts", "Spanish I", "Spanish I - Part B", "Spanish II", 
    "Spanish III", "Spanish IV", "AP/DE/IB Spanish", "French I", "French I - Part B", "French II", "French III", "French IV", "AP/DE/IB French",
    "German I", "German I - Part B", "German II", "German III", "German IV", "AP/DE/IB German","Latin I", "Latin I - Part B", 
    "Latin II", "Latin III", "Latin IV", "AP/DE/IB Latin", "Special Education: General", "Special Education: Adapted"];
    
    $scope.students = [];
    $scope.teachers =[];
    $scope.currentStudent = {};
    $scope.currentTeacher = {};
    $scope.currentSchoolDivision = {};
    $scope.practicumMode = true;
    $scope.transportationMode = false;
    $scope.practicumBearingClasses = [];
    $scope.courses = [];
    $scope.schoolDivisions = [];
    $scope.editingPracticumAssignments = [];
    $scope.publishedPracticumAssignments = [];
    $scope.showAssignedTeachers = false;
    $scope.showAssignedStudents = false;
    $scope.assignedStudents = [];
    $scope.assignedTeachers = [];
    $scope.practicaErrorMsg = [];
    $scope.deleteTeach= undefined;
    $scope.deletePrac = undefined;
    $scope.deleteTransport = undefined;
    $scope.deleteFailure = false;
    $scope.deleteErrorMsg = "";
    
    $scope.selectGrade = false;
    $scope.selectSchool = false;
    $scope.selectDivision= false;
    $scope.selectSubject= false;
    $scope.gradeSought = 'N/A';
    $scope.schoolSought = 'N/A';
    $scope.divisionSought = 'N/A';
    $scope.subjectSought= 'N/A';
    $scope.showTeacherGrades = [];
    $scope.showTeacherSchools = [];
    $scope.showDivisionSchools = [];
    $scope.showSubjects= [];
    $scope.allTeachers = [];
    
    $scope.selectEndorsement = false;
    $scope.selectCourse = false;
    $scope.endorsementSought = 'N/A';
    $scope.courseSought = 'N/A';
    $scope.prevCourseSought = '';
    $scope.prevCourseSought = '';
    
    $scope.showStudentsEndorsements = [];
    $scope.showStudentsCourses = [];
    $scope.allStudents = [];
    
    $scope.editingTransportationAssignments = [];
    $scope.publishedTransportationAssignments = [];
    $scope.transportationErrorMsg = [];
    
     /**************************************************/
    
    //Pull data from db into page
    
    $scope.getSchools = function(school){
       for (var i = 0; i < $scope.schoolDivisions.length; i++){
           if ($scope.schoolDivisions[i].division === school){
               return $scope.schoolDivisions[i].schools;
           }
       }
    };
    
    $scope.getSchoolDivisions = function(){
        socket.emit('getDivisions');
    }
    
    socket.on("retrievedDivisions", function(divisions){
        if (divisions.length > 0){
            for (var i=0; i < divisions.length; i++){
                if (divisions[i].length > 0){
                    var div = {"division": divisions[i][0], "schools": []};
                    if (divisions[i].length > 1){
                        var sch = divisions[i][1];
                        for (var j = 0; j < sch.length; j++){
                            div.schools.push(sch[j]);
                        }
                    }
                    $scope.schoolDivisions.push(div);
                }
            }
        }
        // console.log($scope.schoolDivisions);
        $scope.$apply();
    });
    
     
    $scope.getPracticumBearing = function(){
        socket.emit('getPracticumBearing');
    }
    
    socket.on("retrievedPracticumBearing", function(courses){
        if (courses.length > 0){
            for (var i=0; i < courses.length; i++){
                $scope.practicumBearingClasses.push(courses[i][0]);
            }
        }
        $scope.$apply();
    });
        
    $scope.initializeStudents = function(){
        socket.emit('loadStudents');
    };
    
     socket.on('loadStudents', function(results){
        $scope.students = results;
        $scope.allStudents = results;
        $scope.$apply();

    });
    
    $scope.initializeTeachers = function(){
        socket.emit('loadTeachers')
        // console.log($scope.teachers);
    };
    
    socket.on('loadTeachers', function(results){
        $scope.teachers = results;
        $scope.allTeachers = results;
        $scope.$apply();
        $scope.changeTeacherAssigned();
    });
    
    $scope.initializePractica = function(){
        socket.emit('loadPractica');
    };
    
    socket.on('loadPractica', function(results){
        // console.log(results);
        //for each prac already saved
        for(var i =0; i < results.length; i++){
            var pracMatch = {};
            //find the teacher object
            for(var j = 0; j < $scope.allTeachers.length; j++){
                //console.log($scope.allTeachers[j]);
                if(results[i]['teacherId'] == $scope.allTeachers[j]['id']){
                    pracMatch['teacher'] = $scope.allTeachers[j];
                    // console.log(pracMatch['teacher']);
                }
            }
            //find the student object
            for(var j = 0; j < $scope.allStudents.length; j++){
                if(results[i]['studentEmail'] == $scope.allStudents[j]['email']){
                    pracMatch['student'] = $scope.allStudents[j];
                }
            }
            //get course name
            pracMatch['course'] = results[i]['class'];
            //get practicum id
            pracMatch['id'] = results[i]['practicum'];
            
            //fill cols using results scheduling info
            //console.log(results[i]['startTime']);
            pracMatch['availability'] = {};
            pracMatch['availability']['startTime'] = results[i]['startTime'];
            pracMatch['availability']['endTime'] = results[i]['endTime'];
            pracMatch['availability']['monday'] = results[i]['monday'];
            pracMatch['availability']['tuesday'] = results[i]['tuesday'];
            pracMatch['availability']['wednesday'] = results[i]['wednesday'];
            pracMatch['availability']['thursday'] = results[i]['thursday'];
            pracMatch['availability']['friday'] = results[i]['friday'];
            // console.log(pracMatch);
            $scope.publishedPracticumAssignments.push(pracMatch);
        }
        
        //$scope.publishedPracticumAssignments = results;
        $scope.$apply();
        $scope.changeStudentAssigned();
        $scope.changeTeacherAssigned();
    });
    
    $scope.initializeTransportation = function(){
        socket.emit('loadTransportation');
    };
    
     socket.on('loadTransportation', function(results){
         console.log(results);
         $scope.publishedTransportationAssignments = [];
         for (var i = 0; i < results.length; i++){
             var res = results[i]
             var driverEmail = res[0];
             var riderEmails = res[1];
             var driver = {};
             var riders = [riderEmails.length];
             for (var j = 0; j < $scope.allStudents.length; j++){
                 if ($scope.allStudents[j].email === driverEmail){
                     driver = $scope.allStudents[j];
                 } else {
                     for (var k = 0; k < riderEmails.length; k++){
                        if ($scope.allStudents[j].email === riderEmails[k]){
                             riders[k] = $scope.allStudents[j];
                         } 
                     }
                 }
                 
             }
             var newTransport = new TransportationAssignment();
             newTransport.driver = driver;
             newTransport.passengers = riders;
             $scope.publishedTransportationAssignments.push(newTransport);
         }
        $scope.$apply();
        console.log($scope.publishedTransportationAssignments);

    });
    
    /**************************************************/
    
    //Deleting things
    
    $scope.deleteTeacher = function(index){
        $scope.deleteTeach = $scope.teachers[index];
        $('#deleteModal').modal('show');
    }
    
    $scope.delete = function(){
        if ($scope.deleteTeach){
            var id = $scope.deleteTeach.id;
            socket.emit("deleteTeacher", id);
        } else if ($scope.deletePrac){
            var id = $scope.deletePrac.id;
            console.log(id);
            socket.emit("deletePracticum", id);
        } else if ($scope.deleteTransport){
            var driver = $scope.deleteTransport.driver.email
            console.log(driver);
            socket.emit("deleteTransportation", driver);
        }
    }
    
    $scope.cancelDelete = function(){
        $scope.deleteTeach = undefined;
        $scope.deletePrac = undefined;
        $scope.deleteTransport = undefined;
    }
    
    socket.on("deletedTeacher", function(error){
        if (error){
            $scope.deleteFailure = true;
            $scope.deleteErrorMsg = "Failed to delete teacher";
        } else{
            var index = $scope.teachers.indexOf($scope.deleteTeach);
            $scope.teachers.splice(index,1);
            $scope.deleteTeach = undefined;
            $scope.$apply();
        }
    });
    
    socket.on("deletedPracticum", function(error){
        if (error){
            $scope.deleteFailure = true;
            $scope.deleteErrorMsg = "Failed to delete practicum assignment";
        } else{
            var index = $scope.publishedPracticumAssignments.indexOf($scope.deletePrac);
            $scope.publishedPracticumAssignments.splice(index,1);
            $scope.deletePrac = undefined;
            $scope.$apply();
        }
    });
    
    socket.on("deletedTransportation", function(error){
        console.log("in deleted transportation");
        if (error){
            $scope.deleteFailure = true;
            $scope.deleteErrorMsg = "Failed to delete transportation assignment";
        } else{
            var index = $scope.publishedTransportationAssignments.indexOf($scope.deleteTransport);
            $scope.publishedTransportationAssignments.splice(index,1);
            $scope.deleteTransport = undefined;
            $scope.$apply();
        }
    });
    
    $scope.deleteEditingPracticumAssignment = function(index){
        $scope.editingPracticumAssignments.splice(index, 1);
        $scope.practicaErrorMsg.splice(index,1);
    }
    
    $scope.deletePublishedPracticumAssignment = function(index){
        $scope.deletePrac = $scope.publishedPracticumAssignments[index];
        console.log($scope.deletePrac);
        $('#deleteModal').modal('show');
    }
    
    $scope.deleteEditingTransportationAssignment = function(index){
        $scope.editingTransportationAssignments.splice(index, 1);
        $scope.transportationErrorMsg.splice(index, 1);
    }
    
    $scope.deletePublishedTransportationAssignment = function(index){
        $scope.deleteTransport = $scope.publishedTransportationAssignments[index];
        console.log($scope.deleteTransport);
        $('#deleteModal').modal('show');
    }
    
    /**************************************************/
    
    //Methods for creating, editing, publishing practica
    
    $scope.addPracticumAssignment = function(){
        var a = new PracticumAssignment();
        a.student = {};
        a.teacher = {};
        a.other = undefined;
        a.availability.start = new Date();
        a.availability.start.setHours(7);
        a.availability.start.setMinutes(30);
        a.availability.end = new Date();
        a.availability.end.setHours(15);
        a.availability.end.setMinutes(30);
        $scope.editingPracticumAssignments.push(a);
        $scope.practicaErrorMsg.push("");
        console.log($scope.editingPracticumAssignments);
    }
    
    $scope.savePracticumAssignment = function(index){
        var prac = angular.copy($scope.editingPracticumAssignments[index]);
        var publishPrac = $scope.convertToPublishablePracticum(prac);
        
        $scope.deleteEditingPracticumAssignment(index);
        
        if (Object.prototype.toString.call(prac.availability.start) === "[object Date]"){
            prac.availability.startTime = prac.availability.start.toLocaleTimeString();
        }
        if (Object.prototype.toString.call(prac.availability.end) === "[object Date]"){
            prac.availability.endTime = prac.availability.end.toLocaleTimeString();
        }
        
        if (prac.course === "Other" && prac.other){
                prac.course = prac.other;
        }
        delete prac.other;
        
        console.log(prac);
        socket.emit('submitPractica', publishPrac);
        
        $scope.publishedPracticumAssignments.push(prac);
        // console.log($scope.publishedPracticumAssignments);
        if ($scope.editingPracticumAssignments.length < 1)
            $scope.addPracticumAssignment();
    }
    
    $scope.editPracticum = function(index){
        var prac = $scope.publishedPracticumAssignments[index];
        var editable = $scope.convertToEditablePracticum(prac);
        $scope.publishedPracticumAssignments.splice(index,1);  
        $scope.editingPracticumAssignments.push(editable);
        $scope.practicaErrorMsg.push("");
    }
    
    $scope.convertToEditablePracticum = function(practicum){
        var editPrac = angular.copy(practicum);
        if (editPrac.teacher && editPrac.teacher.elementarySchedule && editPrac.teacher.secondarySchedule){
            var classes = editPrac.teacher.elementarySchedule.concat(editPrac.teacher.secondarySchedule);
            var inList = false;
            for (var i = 0; i < classes.length; i++){
                if (classes[i].course === editPrac.course){
                    inList = true;
                    break;
                }
            }
            if (!inList){
                editPrac.other = editPrac.course; 
                editPrac.course = "Other";
            }
        }
        if (editPrac.availability.startTime && editPrac.availability.endTime){
            var start = editPrac.availability.startTime;
            editPrac.availability.start = getDateObjectFromString(start);

            var end = editPrac.availability.endTime;
            editPrac.availability.end = getDateObjectFromString(end);
        }
        
        console.log(editPrac);
        return editPrac;
    }
    
    $scope.convertToPublishablePracticum = function(practicum){
        var publishPrac = angular.copy(practicum);
        
        publishPrac.studentId = publishPrac.student.email;
        publishPrac.teacherId = publishPrac.teacher.id;
        delete publishPrac.student;
        delete publishPrac.teacher;
        
        if (Object.prototype.toString.call(publishPrac.availability.start) === "[object Date]"){
            publishPrac.availability.startTime = publishPrac.availability.start.toLocaleTimeString();
        }
        if (Object.prototype.toString.call(publishPrac.availability.end) === "[object Date]"){
            publishPrac.availability.endTime = publishPrac.availability.end.toLocaleTimeString();
        }
       
        delete publishPrac.availability.start;
        delete publishPrac.availability.end;
        
        if (publishPrac.course === "Other" && publishPrac.other){
                publishPrac.course = publishPrac.other;
        }
        delete publishPrac.other;
        
        console.log(publishPrac);
        
        return publishPrac;
    }

    
    //sets the start and end time when a course is selected for the practicum assignment
    $scope.changeAssignedCourse = function(practicum, index){
        if (practicum.teacher && practicum.teacher.elementarySchedule && practicum.teacher.secondarySchedule){
            var classes = practicum.teacher.elementarySchedule.concat(practicum.teacher.secondarySchedule);
            for (var i = 0; i < classes.length; i++){
                if (classes[i].course === practicum.course){
                    var start = classes[i].startTime;
                    practicum.availability.start = getDateObjectFromString(start);
 
                    var end = classes[i].endTime;
                    practicum.availability.end = getDateObjectFromString(end);
                }
            }
            console.log(practicum);
            if ($scope.practicaErrorMsg[index].indexOf("You must enter a course!\n") != -1){
                var msg = $scope.practicaErrorMsg[index];
                msg = msg.replace("You must enter a course!\n", "");
                $scope.practicaErrorMsg[index] = msg;
            }
        }
    }
    
     /**************************************************/
     
     //Methods to set current objects
     
    $scope.setCurrentStudent = function(student){
        $scope.currentStudent = student;
        console.log($scope.currentStudent);
    };
    
    $scope.setCurrentTeacher = function(teacher){
        $scope.currentTeacher = teacher;
        //console.log($scope.currentTeacher);
    };
    
     /**************************************************/
    
    //Helpers for displaying student/teacher popover info
    
    $scope.getAvailabilityString = function(av){
        var days = "";
        if (av.monday)
            days += "M";
        if (av.tuesday)
            days += "T";
        if (av.wednesday)
            days += "W";
        if (av.thursday)
            days += "Th";
        if (av.friday)
            days += "F";
            
        var time = av.startTime + " - " + av.endTime;
        return days + " -> " + time;
    };
    
    $scope.getTransportationString = function(stu){
        var transportation = "";
        if (stu.hasCar && stu.passengers > 0){
            transportation = "Can transport self and " + stu.passengers + " others";
        } else if (stu.hasCar){
            transportation = "Can only transport self";
        } else {
            transportation = "Needs transportation";
        }
        
        return transportation;
    };
    
    $scope.getHostString = function(teach){
        var host = "";
        if (teach.hostSpring && teach.hostFall){
            host = "Can host in Fall & Spring"
        } else if (teach.hostFall){
            host = "Can host in Fall"
        } else if (teach.hostSpring){
            host = "Can host in Spring"
        }
        // console.log(host);
        return host;
    };
    
    $scope.getScheduleString = function(course){
        var str = "";
        if (course){
            if(course.daytype)
                str += "[" + course.daytype + " Days";
            if (course.block)
                str += ", Block " + course.block + "] ";
            if (course.startTime)
                str += course.startTime;
            if (course.endTime)
                str += " - " + course.endTime;
            if (course.course)
                str += " -> " + course.course;   
            else 
                str += course;
        }
        // console.log(str);
        return str;
    };
    
    $scope.getScheduleCourse = function(teacher, name){
        for (var i = 0; i < teacher.elementarySchedule.length; i++){
            if (teacher.elementarySchedule[i].course === name){
                return teacher.elementarySchedule[i];
            }
        }
        
        for (var i = 0; i < teacher.secondarySchedule.length; i++){
            if (teacher.secondarySchedule[i].course === name){
                return teacher.secondarySchedule[i];
            }
        }
        
        return name;
    }
    
     /**************************************************/
     
    //Methods for toggling modes
    
    $scope.togglePracticumMode = function(){
       $scope.practicumMode = !$scope.practicumMode;
       $scope.transportationMode = false;
    };

    $scope.toggleTransportationMode = function(){
       $scope.transportationMode= !$scope.transportationMode;
       $scope.practicumMode = false;
    };
    
     /**************************************************/
     
    //Filter methods
    
    $scope.filterGrade =  function(){
      
        $scope.showTeacherGrades = [];
        for(var i = 0; i < $scope.teachers.length; i++){
            if($scope.teachers[i]['grade'].indexOf($scope.gradeSought) !== -1){
                $scope.showTeacherGrades.push($scope.teachers[i]);
            }
        }
        $scope.selectGrade = true;
        $scope.teachers = $scope.showTeacherGrades;
        
    };
    
    $scope.filterSchool =  function(){
      
        $scope.showTeacherSchools = [];
        for(var i = 0; i < $scope.teachers.length; i++){
            //console.log($scope.teachers[i]['school']);
            if($scope.teachers[i]['school'].indexOf($scope.schoolSought) !== -1){
                $scope.showTeacherSchools.push($scope.teachers[i]);
            }
        }
        $scope.selectSchool = true;
        $scope.teachers = $scope.showTeacherSchools;
        
    };
    
    $scope.filterDivisions = function(divisionSought)
    {
        $scope.showDivisionSchools = [];
        for(var i= 0; i < $scope.teachers.length; i++)
        {
            //console.log($scope.teachers[i]['schoolDivision']);
            if($scope.teachers[i]['schoolDivision'].indexOf($scope.divisionSought) !== -1)
            {
                $scope.showDivisionSchools.push($scope.teachers[i]);
            }
        }
        $scope.selectDivision = true;
        $scope.teachers = $scope.showDivisionSchools;
    };
    
    $scope.filterAssigned = function()
    {
        $scope.assignedStudents= [];
        $scope.dummyArray= [];
        for(var i=0; i < $scope.allStudents.length; i++)
        {
            for(var j=0; j < $scope.publishedPracticumAssignments.length; j++)
            {
                if($scope.allStudents[i].email === $scope.publishedPracticumAssignments[j]['student'].email)
                {
                    $scope.dummyArray.push($scope.allStudents[i].email);
                }
            }
        }
        for(var k=0; k < $scope.allStudents.length; k++)
        {
            if($scope.dummyArray.includes($scope.allStudents[k].email) === false)
            {
                // console.log($scope.students[k].email);
                $scope.assignedStudents.push($scope.allStudents[k]);
            }
        }
        $scope.students= $scope.assignedStudents;
    };
    
    $scope.filterAssignedTeachers= function()
    {
        $scope.assignedTeachers=[];
        $scope.dummyArray=[];
        for(var i=0; i < $scope.allTeachers.length; i++)
        {
            for(var j=0; j < $scope.publishedPracticumAssignments.length; j++)
            {
                if($scope.allTeachers[i].email === $scope.publishedPracticumAssignments[j]['teacher'].email)
                {
                    $scope.dummyArray.push($scope.allTeachers[i].email);
                }
            }
        }
        for(var k=0; k < $scope.allTeachers.length; k++)
        {
            if($scope.dummyArray.includes($scope.allTeachers[k].email) === false)
            {
                // console.log($scope.allTeachers[k].email);
                $scope.assignedTeachers.push($scope.allTeachers[k]);
            }
        }
        $scope.teachers= $scope.assignedTeachers;
    };
    
    $scope.filterSubject= function(subjectSought)
    {
        $scope.showSubjects= [];
        for(var i=0; i < $scope.teachers.length; i++)
        {
            for(var j=0; j < $scope.teachers[i]['secondarySchedule'].length; j++)
            {
                //nsole.log($scope.teachers[i]['secondarySchedule'][j].course);
                if($scope.teachers[i]['secondarySchedule'][j].course === subjectSought)
                {
                    $scope.showSubjects.push($scope.teachers[i]);
                    break;
                }
                // if($scope.teachers[i]['secondarySchedule'][j].course === subjectSought)
                // {
                //     $scope.showSubjects.push($scope.teachers[i]);
                // }
            }
            // for(var k=0; k < $scope.teachers[i]['elementarySchedule'].length; k++)
            // {
            //   // console.log($scope.teachers[i]['elementarySchedule'][j].course);
            //     if($scope.teachers[i]['elementarySchedule'][k].course === subjectSought)
            //     {
            //         $scope.showSubjects.push($scope.teachers[i]);
            //     }
            // }
        }
        $scope.selectSubject= true;
        $scope.teachers= $scope.showSubjects;
    };
    
    $scope.filterCourses = function(){
        
        $scope.showStudentsCourses = [];
            
        for(var i = 0; i < $scope.students.length; i++){
            if($scope.students[i]['enrolledClasses'].indexOf($scope.courseSought) !== -1){
                $scope.showStudentsCourses.push($scope.students[i]);
            }
        }
    
        $scope.selectCourse = true;
        $scope.students = $scope.showStudentsCourses;
    };
    
    $scope.filterEndorsements = function(){
        
        $scope.showStudentsEndorsements = [];
            
        for(var i = 0; i < $scope.students.length; i++){
        
            if($scope.students[i]['endorsements'].indexOf($scope.endorsementSought) !== -1){
                $scope.showStudentsEndorsements.push($scope.students[i]);
            }
        }
    
        $scope.selectEndorsement = true;
        $scope.students = $scope.showStudentsEndorsements;
    };
    
     /**************************************************/
     
    //Change methods
    
    $scope.changeGrade = function(gradeSought){
        
        $scope.teachers = $scope.allTeachers;
        if(gradeSought !== "N/A"){
            if($scope.selectSchool == true){ //if a different teacherFilter is applied, apply it in scope
                $scope.filterSchool();
            } 
            $scope.filterGrade();
        } else {
            $scope.selectGrade = false;
            if($scope.selectSchool == true){ //if a different filter is applied, apply it in scope
                $scope.filterSchool();
            } 
        }
    };
    
    $scope.changeStudentAssigned= function()
    {   
        if($scope.showAssignedStudents)
        {
            $scope.students= $scope.allStudents;
        }
        else
        {
            $scope.filterAssigned();
        } 
    };
    
    $scope.changeTeacherAssigned= function()
    {
        if($scope.showAssignedTeachers)
        {
            $scope.teachers=$scope.allTeachers;
        }
        else
        {
            $scope.filterAssignedTeachers();
        }
    };
    
    $scope.changeSchool = function(schoolSought){
        
        $scope.teachers = $scope.allTeachers;
        if(schoolSought !== "N/A"){
            //if($scope.selectGrade == true){ //if a different teacherFilter is applied, apply it in scope
            //    $scope.filterGrade();
            //} 
            $scope.filterSchool();
        } else {
            $scope.selectSchool = false;
            //if($scope.selectGrade == true){ //if a different filter is applied, apply it in scope
            //    $scope.filterGrade();
            //} 
        }
    };
    
    $scope.changeDivision= function(divisionSought)
    {
        $scope.teachers= $scope.allTeachers;
        //console.log(divisionSought);
        if(divisionSought !== "N/A")
        {
            $scope.filterDivisions(divisionSought);
        }
        else
        {
            $scope.selectDivision = false;
        }
    };
    
    $scope.changeSubject= function(subjectSought)
    {
        $scope.teachers= $scope.allTeachers;
        //console.log(subjectSought);
        if(subjectSought !== "N/A")
        {
            $scope.filterSubject(subjectSought);
        }
        else
        {
            $scope.selectSubject= false;
        }
    }
    
    $scope.changeEndorsement = function(endorsementSought){
        
        $scope.students = $scope.allStudents;

        if(endorsementSought !== "N/A"){
            
            if($scope.selectCourse == true){
                
                $scope.filterCourses();
            
            } 

            $scope.filterEndorsements();
        
        } else {
            
            $scope.selectEndorsement = false;
            
            if($scope.selectCourse == true){
                
                $scope.filterCourses()
                
            } 
        }
    };
    
    $scope.changeAssigned= function(showAssignedStudents)
    {
        $scope.students= $scope.allStudents;
        // console.log("YO YO YO");
        $scope.filterAssigned();
    };
    
    $scope.changeCourse = function(courseSought){
        
        $scope.students = $scope.allStudents;
        
        if(courseSought !== "N/A"){
            
            if($scope.selectEndorsement == true){
                
                $scope.filterEndorsements();
                
            }
            
            $scope.filterCourses();
        
        } else {
            
            $scope.selectCourse = false;
            
            if($scope.selectEndorsement == true){
            
                $scope.filterEndorsements()
                
            }
        }
    };
    
     /**************************************************/
     
    //Validation methods - for practica
    
    $scope.validateDays = function(index, updateMsg){
        var av = $scope.editingPracticumAssignments[index].availability;
        var invalid = false;
        
        if (!av.monday && !av.tuesday && !av.wednesday && !av.thursday && !av.friday){
            invalid = true;
            if (updateMsg && $scope.practicaErrorMsg[index].indexOf("You must select at least 1 day of the week!\n") === -1){
                $scope.practicaErrorMsg[index] += "You must select at least 1 day of the week!\n";
            }
        } else {
            if (updateMsg && $scope.practicaErrorMsg[index].indexOf("You must select at least 1 day of the week!\n") != -1){
                var msg = $scope.practicaErrorMsg[index];
                msg = msg.replace("You must select at least 1 day of the week!\n", "");
                $scope.practicaErrorMsg[index] = msg;
            }
        }
        
        return invalid;
    }
    
    $scope.validateTimes = function(index, updateMsg){
        var av = $scope.editingPracticumAssignments[index].availability;
        var invalid = false;
        
        //start time is before 7:30AM
        if (av.start && av.end){
            if (av.start.getHours() < 7){
                invalid = true;
                if (updateMsg && $scope.practicaErrorMsg.indexOf("The start time must be after 7:00AM!\n") === -1){
                    $scope.practicaErrorMsg[index] += "The start time must be after 7:00AM!\n";
                }
            } else {
                if (updateMsg && $scope.practicaErrorMsg[index].indexOf("The start time must be after 7:00AM!\n") != -1){
                    var msg = $scope.practicaErrorMsg[index];
                    msg = msg.replace("The start time must be after 7:00AM!\n", "");
                    $scope.practicaErrorMsg[index] = msg;
                }
            }
            
            //end time is after 3:30PM
            if (av.end.getHours() >= 16){
                invalid = true;
                if (updateMsg && $scope.practicaErrorMsg[index].indexOf("The end time must be before 4:00PM!") === -1){
                    $scope.practicaErrorMsg[index] += "The end time must be before 4:00PM!\n";
                }
            } else {
                if (updateMsg && $scope.practicaErrorMsg[index].indexOf("The end time must be before 4:00PM!\n") != -1){
                    var msg = $scope.practicaErrorMsg[index];
                    msg = msg.replace("The end time must be before 4:00PM!\n", "");
                    $scope.practicaErrorMsg[index] = msg;
                }
            }
            
        } else {
            invalid = true;
        }
        return invalid;
        
    }
    
    $scope.validateCourse = function(index, updateMsg){
        var assignment = $scope.editingPracticumAssignments[index];
        var course = assignment.course;
        var invalid = false;
  
        if ((course && course==="") || (course && course === "Other" && assignment.other === undefined)){
            invalid = true;
            if (updateMsg && $scope.practicaErrorMsg[index].indexOf("You must enter a course!\n") === -1){
                $scope.practicaErrorMsg[index] += "You must enter a course!\n";
            }
        } else {
            if (updateMsg && $scope.practicaErrorMsg[index].indexOf("You must enter a course!\n") != -1){
                var msg = $scope.practicaErrorMsg[index];
                msg = msg.replace("You must enter a course!\n", "");
                $scope.practicaErrorMsg[index] = msg;
            }
        }
        return invalid;
    }
    
    $scope.validateStudent = function(index, updateMsg){
        var assignment = $scope.editingPracticumAssignments[index];
        var stu = assignment.student;
        var invalid = false;
        var index = $scope.editingTransportationAssignments.indexOf(item);
        if ($scope.transportationMode){
            var driver = item.driver;
      
            if (driver === undefined || $scope.isEmptyObject(driver)){
                invalid = true;
                if (updateMsg && $scope.transportationErrorMsg[index].indexOf("You must select a driver!\n") === -1){
                    $scope.transportationErrorMsg[index] += "You must select a driver!\n";
                }
            } else {
                if (updateMsg && $scope.transportationErrorMsg[index].indexOf("You must select a driver!\n") != -1){
                    var msg = $scope.transportationErrorMsg[index];
                    msg = msg.replace("You must select a driver!\n", "");
                    $scope.transportationErrorMsg[index] = msg;
                }
            }
        } else {
            if (updateMsg && $scope.practicaErrorMsg[index].indexOf("You must select a student!\n") != -1){
                var msg = $scope.practicaErrorMsg[index];
                msg = msg.replace("You must select a student!\n", "");
                $scope.practicaErrorMsg[index] = msg;
            }
        }
        return invalid;
        
    }
    
    $scope.validateTeacher = function(index, updateMsg){
        var invalid = false;
        if (!$scope.transportationMode){
            var assignment = $scope.editingPracticumAssignments[index];
            var teach = assignment.student;
      
            if (teach === undefined || $scope.isEmptyObject(teach)){
                invalid = true;
                if (updateMsg && $scope.practicaErrorMsg[index].indexOf("You must select a teacher!\n") === -1){
                    $scope.practicaErrorMsg[index] += "You must select a teacher!\n";
                }
            } else {
                if (updateMsg && $scope.practicaErrorMsg[index].indexOf("You must select a teacher!\n") != -1){
                    var msg = $scope.practicaErrorMsg[index];
                    msg = msg.replace("You must select a teacher!\n", "");
                    $scope.practicaErrorMsg[index] = msg;
                }
            }
        }
        return invalid;
    }
    
    $scope.practicaIsInvalid = function(index){
        return ($scope.validateDays(index, false) || $scope.validateTimes(index, false) || 
        $scope.validateCourse(index, false) || $scope.validateStudent(index, false) || $scope.validateTeacher(index, false));
    }
    
    /**************************************************/
    //Validation methods = for transportation
    
    $scope.validateDriver = function(event, ui, item, updateMsg){
        var invalid = false;
        if ($scope.transportationMode){
            var index = $scope.editingTransportationAssignments.indexOf(item);
            var driver = item.driver;
      
            if (driver === undefined || $scope.isEmptyObject(driver)){
                invalid = true;
                if (updateMsg && $scope.transportationErrorMsg[index].indexOf("You must select a driver!\n") === -1){
                    $scope.transportationErrorMsg[index] += "You must select a driver!\n";
                }
            } else {
                if (updateMsg && $scope.transportationErrorMsg[index].indexOf("You must select a driver!\n") != -1){
                    var msg = $scope.transportationErrorMsg[index];
                    msg = msg.replace("You must select a driver!\n", "");
                    $scope.transportationErrorMsg[index] = msg;
                }
            }
        
            if (!invalid && item.passengers.length === 0){
                for (var i = 0; i < driver.passengers; i++){
                    var rider = {};
                    item.passengers.push(rider);
                }
            }
        }
        return invalid;
    }
    
    $scope.validateRiders = function(event, ui, item, updateMsg){
        var invalid = true;
        if ($scope.transportationMode){
            var index = $scope.editingTransportationAssignments.indexOf(item);
            var riders = item.passengers;
            console.log(riders);
            // console.log($scope.editingTransportationAssignments);
            for (var i = 0; i < riders.length; i++){
                if (riders[i] != undefined && !$scope.isEmptyObject(riders[i])){
                    invalid = false;
                    break;
                }
            }
            
            if (invalid){
                if (updateMsg && $scope.transportationErrorMsg[index].indexOf("You must select at least 1 rider!\n") === -1){
                    $scope.transportationErrorMsg[index] += "You must select at least 1 rider!\n";
                }
            } else {
                if (updateMsg && $scope.transportationErrorMsg[index].indexOf("You must select at least 1 rider!\n") != -1){
                    var msg = $scope.transportationErrorMsg[index];
                    msg = msg.replace("You must select at least 1 rider!\n", "");
                    $scope.transportationErrorMsg[index] = msg;
                }
            }
        } 
        
        return invalid;
    }
    
    $scope.transportationIsInvalid = function(item){
        return ($scope.validateDriver({}, {}, item, false) || $scope.validateRiders({}, {}, item, false));
    }
    
    
     /**************************************************/
    
    //Miscellaneous helper methods

    $scope.isEmptyObject = function(obj){
        return angular.toJson(obj) === angular.toJson({});
    }
    
    $scope.print = function(){
        console.log($scope.editingPracticumAssignments);
    }
    
    var getDateObjectFromString = function(str){
        var split = str.split(":");
        var hrs = parseInt(split[0]);
        var mins = parseInt(split[1].substring(0, 2));
        var mer = split[1].substring(2, 4);
        if (mer === "PM" && hrs != 12){
            hrs += 12;
        }
        var date = new Date();
        date.setHours(hrs);
        date.setMinutes(mins);
        
        return date;
    }
    
    /**************************************************/
    
    //Methods for TransportationAssignments
    
    $scope.addTransportationAssignment = function(){
        var transport = new TransportationAssignment();
        $scope.editingTransportationAssignments.push(transport);
        console.log($scope.editingTransportationAssignments);
        $scope.transportationErrorMsg.push("");
    }
    
    $scope.saveTransportationAssignment = function(index){
        var transport = angular.copy($scope.editingTransportationAssignments[index]);
        var publishTransport = $scope.convertToPublishableTransportation(transport);
        
        $scope.deleteEditingTransportationAssignment(index);
        
        socket.emit('submitTransportation', publishTransport);
        
        $scope.publishedTransportationAssignments.push(publishTransport);
        console.log($scope.publishedTransportationAssignments);
        if ($scope.editingTransportationAssignments.length < 1)
            $scope.addTransportationAssignment();
    }
    
    $scope.editTransportation = function(index){
        var transport = angular.copy($scope.publishedTransportationAssignments[index]);
        $scope.publishedTransportationAssignments.splice(index,1); 
        var editable = $scope.convertToEditableTransportation(transport);
        $scope.editingTransportationAssignments.push(editable);
        $scope.transportationErrorMsg.push("");
    }
    
    $scope.convertToEditableTransportation = function(transport){
        var editTransport = angular.copy(transport);
        //make sure number of objects in array is the same as student's passengers variable
        var passNum = transport.driver.passengers;
        var pass = editTransport.passengers
        for (var i = editTransport.passengers.length; i < passNum; i++){
            var rider = {};
            pass.push(rider);
        }
        
        console.log(editTransport);
        return editTransport;
    }
    
    $scope.convertToPublishableTransportation = function(transport){
        var publishTransport = angular.copy(transport);
        
        //remove empty objects in array
        var pass = [];
        for (var i = 0; i < transport.passengers.length; i++){
            if (!$scope.isEmptyObject(transport.passengers[i])){
                pass.push(transport.passengers[i]);
            }
        }
        
        publishTransport.passengers = pass;
        console.log(publishTransport);
        return publishTransport;
    }

    
    /**************************************************/
    
    $scope.initializeStudents();
    $scope.initializeTeachers();
    $scope.initializePractica();
    $scope.initializeTransportation();
    $scope.addPracticumAssignment();
    $scope.addTransportationAssignment();
    $scope.getPracticumBearing();
    $scope.getSchoolDivisions();
});
