
var POBoxApp= angular.module('POBoxApp',['ui.bootstrap','mgcrea.ngStrap', 'ngSlimScroll','ngSanitize', 'dndLists'])


POBoxApp.controller('AssignPracticumController', function($scope, $window, $popover){
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/practica')
    
    var teacher = {'firstName': 'Minerva', 
        'lastName': 'McGonagall', 
        'email': 'mcgonagall@hogwarts.uk',
        'id': 1,
        'school': 'Hogwarts',
        'schoolDivision': 'UK',
        'grade': 5, 
        'hostFall': true, 
        'hostSpring': false,
        'elementarySchedule': [
            {'course': 'Intro to Transfiguration', 'startTime': '10:00AM', 'endTime': '11:00AM'}, 
            {'course': 'Transfiguration 201', 'startTime': '12:00PM', 'endTime': '1:00PM'},  
            {'course': 'Advanced Transfiguration', 'startTime': '2:00PM', 'endTime': '3:00PM'}
        ]};
        
    var teacher1 = {'firstName': 'Severus', 
        'lastName': 'Snape', 
        'email': 'snape@hogwarts.uk',
        'id': 2,
        'school': 'Hogwarts',
        'schoolDivision': 'UK',
        'grade': undefined, 
        'hostFall': true, 
        'hostSpring': true,
        'secondarySchedule': [
            {'dayType': 'A/X', 'block': '1', 'course': 'Intro to Potions', 'startTime': '10:00AM', 'endTime': '11:00AM'}, 
            {'dayType': 'B/Y', 'block': '5', 'course': 'Potions 201', 'startTime': '12:00PM', 'endTime': '1:00PM'},  
            {'dayType': 'A/X', 'block': '2', 'course': 'Advanced Potions', 'startTime': '2:00PM', 'endTime': '3:00PM'}
        ]};
    
    
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
    
    $scope.studentsFromDB = [];
    $scope.currentStudent = {};
    $scope.currentTeacher = {};
    $scope.practicumMode = true;
    $scope.transportationMode = false;
    $scope.schoolDivisions = [];
    $scope.practicumBearingClasses = [];
    
    
    $scope.selectEndorsement = false;
    $scope.selectCourse = false;
    $scope.endorsementSought = 'N/A';
    $scope.courseSought = 'N/A';
    $scope.prevCourseSought = '';
    $scope.prevCourseSought = '';
    
    $scope.showStudentsEndorsements = [];
    $scope.showStudentsCourses = [];
    $scope.allStudents = [];
    
    $scope.schoolDivisions = [];
    $scope.currentSchoolDivision = {};
    $scope.courses = []
    
    
    $scope.lists = [
        {
            label: "Students",
            allowedTypes: ['student'],
            students: [
            ]
        }, 
        {
            label: "Teachers",
            allowedTypes: ['teacher'],
            teachers: [
            ]
        }
    ];
    
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
        console.log($scope.schoolDivisions);
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
        $scope.lists[0].students = results;
        $scope.allStudents = results;
        $scope.$apply();
        
    });
    
    $scope.initializeTeachers = function(){
        for (var i = 0; i < 5; i++){
            var t = new Teacher();
            t.initialize(teacher);
            $scope.lists[1].teachers.push(t);
            var t2 = new Teacher();
            t2.initialize(teacher1);
            $scope.lists[1].teachers.push(t2);
        }
        console.log($scope.lists[1].teachers);
    };
    
    $scope.setCurrentStudent = function(student){
        $scope.currentStudent = student;
        console.log($scope.currentStudent);
    };
    
    $scope.setCurrentTeacher = function(teacher){
        $scope.currentTeacher = teacher;
        console.log($scope.currentTeacher);
    };
    
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
        if(course.dayType)
            str += "[" + course.dayType + " Days";
        if (course.block)
            str += ", Block " + course.block + "] ";
        if (course.startTime)
            str += course.startTime;
        if (course.endTime)
            str += " - " + course.endTime;
        if (course.course)
            str += " -> " + course.course;    
        
        // console.log(str);
        return str;
    };
    
    $scope.togglePracticumMode = function(){
       $scope.practicumMode = !$scope.practicumMode;
       $scope.transportationMode = false;
    };

    $scope.toggleTransportationMode = function(){
       $scope.transportationMode= !$scope.transportationMode;
       $scope.practicumMode = false;
    };
    
    $scope.filterCourses = function(){
        
        $scope.showStudentsCourses = [];
            
            for(var i = 0; i < $scope.lists[0].students.length; i++){
            
                if($scope.lists[0].students[i]['enrolledClasses'].indexOf($scope.courseSought) !== -1){
                    $scope.showStudentsCourses.push($scope.lists[0].students[i]);
                }
            }
        
            $scope.selectCourse = true;
            $scope.lists[0].students = $scope.showStudentsCourses;
    };
    
    $scope.filterEndorsements = function(){
        
        $scope.showStudentsEndorsements = []
            
            for(var i = 0; i < $scope.lists[0].students.length; i++){
            
                if($scope.lists[0].students[i]['endorsements'].indexOf($scope.endorsementSought) !== -1){
                    $scope.showStudentsEndorsements.push($scope.lists[0].students[i]);
                }
            }
        
            $scope.selectEndorsement = true;
            $scope.lists[0].students = $scope.showStudentsEndorsements;
    };
    
    $scope.changeEndorsement = function(endorsementSought){
        
        $scope.lists[0].students = $scope.allStudents;

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
    
    $scope.changeCourse = function(courseSought){
        
        $scope.lists[0].students = $scope.allStudents;
        
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



    
    $scope.initializeStudents();
    $scope.initializeTeachers();
    $scope.getPracticumBearing()
    $scope.getSchoolDivisions();
});