'use strict';
angular.module('POBoxApp').controller('TeacherFormController', function($scope, $window, $location, $anchorScroll){
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/teacher')
    

    $scope.grades = [{"displayName": "K", "value": 0}, {"displayName": "1", "value": 1}, {"displayName": "2", "value": 2},
    {"displayName": "3", "value": 3}, {"displayName": "4", "value": 4}, {"displayName": "5", "value": 5}, 
    {"displayName": "6", "value": 6}, {"displayName": "7", "value": 7}, {"displayName": "8", "value": 8},
    {"displayName": "9", "value": 9}, {"displayName": "10", "value": 10}, {"displayName": "11", "value": 11},
    {"displayName": "12", "value": 12}, {"displayName": "Art", "value": -1}, {"displayName": "Music", "value": -1},
    {"displayName": "Special Education: Adapted", "value": -1}, {"displayName": "Special Education: General", "value": -1}];
    
    $scope.courses = ["English 6", "English 7", "English 8", "Advanced English 8", "English 9", "Advanced English 9", "English 10", 
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

   
    
    
    
    $scope.recess = {'startTime' : '', 'endTime': ''};
    $scope.lunchBreak = {'startTime' : '', 'endTime': ''}
    
    $scope.gradeLevels = ['K', '1', '2', '3', '4', '5', '6'];
    $scope.elemSubjects = ['Art', 'Music']
    $scope.elemGradesAndSubjects = $scope.gradeLevels.concat($scope.elemSubjects);

    $scope.schoolDivisions = [];
    $scope.practicumBearingClasses = [];
    
    $scope.endorsementSought = undefined;
    $scope.enrolledClasses = undefined;
    $scope.transportation = undefined;
    $scope.passengerNum = 0;
    $scope.firstName = undefined;
    $scope.lastName = undefined;
    $scope.email = undefined;
    $scope.grade= undefined;
    $scope.availability = [];
    $scope.previousPractica = [];
    $scope.noPreviousPractica = false;

    $scope.invalidFirstName = false;
    $scope.invalidLastName = false;
    $scope.invalidEmail = false;
    $scope.invalidEndorsement = false;
    $scope.invalidEnrolledClass= false;
    $scope.invalidTransportation= false;
    $scope.isTravelTeacher = undefined;
    $scope.invalidDivision= false;
    $scope.invalidGrade= false;
    $scope.invalidTravel= false;
    $scope.invalidHosting= false;
    $scope.availabilityErrorMsg = ["", "", ""];
    $scope.practicaErrorMsg = [];
    $scope.submissionSuccess = false;
    $scope.submissionFailure = false;
    $scope.submissionMsg = "";
    
    
    
    
    $scope.school = '';
    $scope.schoolDivision = '';
    $scope.otherSchool = '';
    $scope.otherDivision='';
    $scope.otherGrade='';
    $scope.otherTravel='';
    $scope.teacherType = '';
    $scope.gradeLevel = '';
    $scope.elemClasses = []
    $scope.elemElectives = [];
    $scope.travelTeacher = '';
    $scope.otherHosting = '';
    var elemCourses = ['Writing', 'Reading', 'Math', 'Social Studies', 'Science']
    var elemElectives = ['Art','Computer', 'Library', 'Music', 'P.E.']
    $scope.semesterHosting = '';
    $scope.secondaryClasses = [];
    $scope.isElectiveTeacher = false
    $scope.blockSchedule = ''
    $scope.secondaryPlanning = [];
    $scope.secondaryLunch = [];

    
        
    //returns schools in selected division (of previous practica)
    $scope.getSchools = function(){
       for (var i = 0; i < $scope.schoolDivisions.length; i++){
        //   console.log($scope.schoolDivisions)
           if ($scope.schoolDivisions[i].division === $scope.schoolDivision){
               return $scope.schoolDivisions[i].schools;
           }
       }
    };
    
    $scope.getSchoolDivisions = function(){
        socket.emit('getDivisions');
    };
    
    $scope.getElemClasses = function(){
        return $scope.elemClasses;
    };
    
    $scope.getGradeLevels = function(){
        return $scope.gradeLevels;
    };
    
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
        $scope.$apply();
         console.log($scope.schoolDivisions);
    });
    
    $scope.getPracticumBearing = function(){
        socket.emit('getPracticumBearing');
    };
    
    socket.on("retrievedPracticumBearing", function(courses){
        if (courses.length > 0){
            for (var i=0; i < courses.length; i++){
                $scope.practicumBearingClasses.push(courses[i][0]);
            }
        }
        $scope.$apply();
        // console.log($scope.practicumBearingClasses);
    });
    
    socket.on("submissionResult", function(result){
        console.log(result);
        if (result.error){
            $scope.submissionFailure = true;
            $scope.submissionSuccess = false;
            $scope.goToTop();
        } else{
            $scope.submissionSuccess = true;
            $scope.submissionFailure = false;
            $scope.resetForm();
        }
        $scope.submissionMsg = result.msg;
        $scope.$apply();
    });
    
    $scope.addAvailability = function(){
        var av = new Availability();
        av.start = new Date();
        av.start.setHours(7);
        av.start.setMinutes(30);
        av.end = new Date();
        av.end.setHours(15);
        av.end.setMinutes(30);
        $scope.availability.push(av);
    };
    
    $scope.deleteAvailability = function(av){
        for (var i = 0; i < $scope.availability.length; i++){
            if ($scope.availability[i] === av){
                $scope.availabilityErrorMsg[i] = ""
                $scope.availability.splice(i,1);
            }
        }
    };
    
    $scope.isBlockSchedule = function(schedule){
        if(schedule === 'Yes'){
            return true;
        }
        return false;
    };
    
    $scope.resetSchoolType = function(schoolLevel){
        $scope.otherSchool = '';
        $scope.otherDivision='';
        $scope.travelTeacher = '';
        if (schoolLevel === "Elementary")
            $scope.teacherType = schoolLevel;
        if (schoolLevel === "Secondary")
            $scope.gradeLevel = '';
        
    };
    
    $scope.isTravelTeacherCheck = function(travelTeacher){
        console.log(travelTeacher)
        console.log($scope.travelTeacher)
        $scope.travelTeacher = travelTeacher;
        if(travelTeacher == "No"){
            $scope.isTravelTeacher = false;
        } else {
            $scope.isTravelTeacher = true;
        }
        
    };
    
    $scope.isElementary = function(school){
        //console.log("In IsElementary")
        //console.log(school)
        //console.log($scope.elemElectives)
        var sch = String(school);
        if (sch.indexOf("Elementary School") > 0){
            $scope.resetSchoolType("Elementary");
            return true;
        } else {
            return false;
        }
        
    };
    
    $scope.isOther = function(school){
        
        var sch = String(school);
        if (sch === "Other"){
            $scope.resetSchoolType("Other");
            return true;
        } else {
            return false;
        }
        
    };
    
    $scope.allOther = function(school, division, isTravelTeacher){
        var div= String(division);
        var sch =String(school);
        
        if(div==='Other' && sch === "Other" && isTravelTeacher === "false"){
            return true;
        }
        return false;
    };
    
    $scope.otherCheck= function(gradeLevel, invalidGrade)
    {
        // console.log("before");
        // console.log(gradeLevel);
        // var grade= String(gradeLevel);
        // console.log("Hey im here. Why don't you look here");
        // console.log(grade);
        
        if(gradeLevel !== undefined && gradeLevel !== "" && invalidGrade === "false")
        {
            return true;
        }
        else
        {
            return false;
        }
        
        // if(gradeLevel !== undefined && gradeLevel !== "" && invalidGrade === "false")
        // {
        //     return true;
        // }
        // else
        // {
        //     return false;
        // }
    };
    
    $scope.isTravelTeacherUndefined = function()
    {
        
        if($scope.isTravelTeacher === undefined){
            return true;
        }
        return false;
    };
    
    $scope.isSecondary = function(school){
        
        var sch = String(school);
        if (sch.indexOf("Middle School") > 0 || sch.indexOf("High School") > 0){
            $scope.resetSchoolType("Secondary");
            return true;
        } else {
            return false;
        }
    };
    
    $scope.changeSchool = function(item){
        console.log(item)
        
        
        if($scope.isElementary(item)){
            $scope.initializeElementary(); 
        } else if($scope.isSecondary(item)){
            $scope.initializeSecondary();
        }
        //$scope.changeCourse(item);
        //$scope.changeGrade(item);
        
    };
    
    $scope.changeSchoolDivision = function(item){
        console.log(item)
        $scope.changeSchool(item);
    };

    $scope.print = function(item){
        console.log(item);
        console.log("TEST")
        console.log(typeof $scope.isTravelTeacher)
    };
    
    $scope.submit = function(){
        // var teacher = {}
        
    
        // this.id = undefined;
    
    
    
        // this.elementarySchedule = [];
        // this.secondarySchedule = [];
    
        var teacher = new Teacher();
        
        teacher.firstName = $scope.firstName
        teacher.school = $scope.school
        teacher.lastName = $scope.lastName
        teacher.email = $scope.email
        teacher.schoolDivision = $scope.schoolDivision
        
        
        if($scope.semesterHosting == 'Fall'){
            teacher.hostFall = true;
            teacher.hostSpring = false;
        } else if($scope.semesterHosting == "Spring"){
            teacher.hostFall = false;
            teacher.hostSpring = true;
        } else {
            teacher.hostFall = true;
            teacher.hostSpring = true;
        }
        console.log("Im here. Look right beneath me")
        console.log($scope.gradeLevel);
        //teacher.grade = $scope.gradeLevel;
        if($scope.gradeLevel !== undefined){
            teacher.grade = $scope.gradeLevel;
            console.log("Look here bro")
            console.log(teacher.grade);
        }
        
        var classes = {}
        if($scope.teacherType == "Elementary"){
            classes['elemClasses'] = $scope.elemClasses;
            classes['elemElectives'] = $scope.elemElectives;
            classes['recess'] = $scope.recess;
            classes['lunchBreak'] = $scope.lunchBreak;
            teacher.elementarySchedule = classes;
        } else if($scope.teacherType == "Secondary"){
            classes['secondaryClasses'] = $scope.secondaryClasses;
            classes['planning'] = $scope.secondaryPlanning;
            classes['secondaryLunch'] = $scope.secondaryLunch;
            teacher.secondarySchedule = classes;
        }
        
        
        if($scope.otherSchool.length > 0){
            $scope.teacherType = "Other";
        }
       
        
        console.log(teacher);
        
         socket.emit('submit', teacher);
    };
    
    var inGrades = function(name){
        for (var i = 0; i < $scope.grades.length; i++){
            var grade = $scope.grades[i].displayName;
            if (name === grade && $scope.grades[i].value >= 0){
                return true;
            }
        }
        
        return false;
    }
    
    var getGradeValue = function(name){
        var temp = -1
        for (var i = 0; i < $scope.grades.length; i++){
            var grade = $scope.grades[i].displayName;
            if (name === grade){
                temp = $scope.grades[i].value;
            }
        }
        return temp;
    }
    
    //Validation
    
    $scope.validateFirstName = function(){
        var namepat = /(^[A-Z]{1}[A-Za-z\'\-\.\s]+$)/;
    	var name = $scope.firstName;
    	var testname = namepat.test(name);
    	if (!testname){
    		$scope.invalidFirstName = true;
    	} else {
            $scope.invalidFirstName = false;
        }
    }
    
    $scope.validateLastName = function(){
        var namepat = /(^[A-Z]{1})([A-Za-z\'\-\.\s]+$)/;
    	var name = $scope.lastName;
    	var testname = namepat.test(name);
    	if (!testname){
    		$scope.invalidLastName = true;
    	} else {
            $scope.invalidLastName = false;
        }
    }
    
    $scope.validateEmail = function(){
        var emailpat = /(^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$)/;
      	var email = $scope.email;
    	var emailtest = emailpat.test(email);
    	if (!emailtest){
    		$scope.invalidEmail = true;
    	} else {
    		$scope.invalidEmail = false;
    	}
    }
    
    $scope.validateOtherSchool = function(){
        //var schoolpat = /(^[A-Z]{1})([A-Za-z\'\-\.\s]+$)/;
    // 	var school = $scope.otherSchool;
    // 	var testschool = schoolpat.test(school);
    // 	if (!testschool){
    // 		$scope.invalidSchool = true;
    // 	} else {
    //         $scope.invalidSchool = false;
    //     }
        var letter= $scope.otherSchool[0];
        console.log(letter);
        console.log($scope.otherSchool);
        console.log($scope.otherSchool[0]);
        if(letter!== undefined && letter === letter.toUpperCase())
        {
            $scope.invalidSchool = false;
        }
        else
        {
            $scope.invalidSchool = true;
        }
    }
    
    $scope.validateOtherDivision = function(){
        var schoolpat = /(^[A-Z]{1})([A-Za-z\'\-\.\s]+$)/;
    	var division = $scope.otherDivision;
    	var testDivision = schoolpat.test(division);
    	if (!testDivision){
    		$scope.invalidDivision = true;
    	} else {
            $scope.invalidDivision = false;
        }
    }
    
    $scope.validateGrade = function(){
        var schoolpat = /(^[A-Z]{1})([A-Za-z\'\-\.\s]+$)/;
    	var grade = $scope.otherGrade;
    	var testGrade = schoolpat.test(grade);
    	if (!testGrade){
    		$scope.invalidGrade = true;
    	} else {
            $scope.invalidGrade = false;
        }
    }
    
    
    $scope.validateMultiple = function(){
        var schoolpat = /(^[A-Z]{1})([A-Za-z\'\-\.\s]+$)/;
    	var travel = $scope.otherTravel;
    	var testTravel = schoolpat.test(travel);
    	if (!testTravel){
    		$scope.invalidTravel = true;
    	} else {
            $scope.invalidTravel = false;
        }
    }
    
        $scope.validateHosting = function(){
        var schoolpat = /(^[A-Z]{1})([A-Za-z\'\-\.\s]+$)/;
    	var hosting = $scope.otherHosting;
    	var testHosting = schoolpat.test(hosting);
    	if (!testHosting){
    		$scope.invalidHosting = true;
    	} else {
            $scope.invalidHosting = false;
        }
    }
    
    $scope.formIsInvalid = function(){
        // $scope.validateTransportation();
        // $scope.validateEndorsement();
        // $scope.validateEnrolledClass();
        // $scope.validateAvailability(); 
        // $scope.validateAllPractica();
        //return (false);
        console.log("#################################");
        console.log("$scope.invalidFirstName: ", $scope.invalidFirstName);
        console.log("$scope.invalidLastName: ", $scope.invalidLastName);
        console.log("$scope.invalidEmail: ", $scope.invalidEmail);
        console.log("$scope.invalidEndorsement: ", $scope.invalidEndorsement);
        console.log("$scope.invalidEnrolledClass: ", $scope.invalidEnrolledClass);
        console.log("$scope.invalidTransportation: ", $scope.invalidTransportation);;
        console.log("$scope.invalidSchool: ", $scope.invalidSchool);
        console.log("$scope.invalidDivision: ", $scope.invalidDivision);
        console.log("$scope.invalidGrade: ", $scope.invalidGrade);
        console.log("$scope.invalidTravel: ", $scope.invalidTravel);
        console.log("$scope.invalidHosting: ", $scope.invalidHosting);
        console.log("#################################");
        return( $scope.invalidFirstName || $scope.invalidLastName || $scope.invalidEmail || $scope.invalidEndorsement ||
                $scope.invalidEnrolledClass || $scope.invalidTransportation ||  $scope.invalidSchool || $scope.invalidDivision || 
                $scope.invalidGrade || $scope.invalidTravel || $scope.invalidHosting ||
                $scope.firstName === undefined || $scope.lastName === undefined || $scope.email === undefined);
    }

    $scope.goToTop = function() {
        // $location.hash('top');
        // $anchorScroll();
        $(window).scrollTop(0);
    };
    
    $scope.resetForm = function(){
        $scope.endorsementSought = undefined;
        $scope.enrolledClasses = undefined;
        $scope.transportation = undefined;
        $scope.passengerNum = 0;
        $scope.firstName = undefined;
        $scope.lastName = undefined;
        $scope.email = undefined;
        $scope.availability = [];
        $scope.previousPractica = [];
        $scope.noPreviousPractica = false;
    
        $scope.invalidFirstName = false;
        $scope.invalidLastName = false;
        $scope.invalidEmail = false;
        $scope.invalidEndorsement = false;
        $scope.invalidEnrolledClass= false;
        $scope.invalidTransportation= false;
        $scope.invalidAvailability = true;
        $scope.invalidPractica = true;
        $scope.invalidSchool= false;
        $scope.invalidDivision= false;
        $scope.invalidGrade= false;
        $scope.invalidTravel= false;
        $scope.invalidHosting= false;
        $scope.availabilityErrorMsg = ["", "", ""];
        $scope.practicaErrorMsg = [];
        
        for (var i = 0; i < 3; i++){
            $scope.addAvailability();
        }
        
        //$scope.addPractica();
        $scope.goToTop();
    }
    
    $scope.initializeElementaryCourses = function(courses, isElective){
        $scope.elemClasses = [];
        for(var i = 0; i < courses.length; i++){
            var av = new ElementaryCourse();
            av.startTime = new Date();
            av.startTime.setHours(7);
            av.startTime.setMinutes(30);
            av.endTime = new Date();
            av.endTime.setHours(15);
            av.endTime.setMinutes(30);
            av.course = courses[i];
            if(isElective == false){
                $scope.elemClasses.push(av);
            } else {
                $scope.elemElectives.push(av);
            }
        }
        console.log("Checking electives")
        console.log($scope.elemElectives)
    }
    
    $scope.initializeSecondaryCourses = function(){
        console.log("TEST")
        $scope.secondaryClasses = [];
        $scope.numCourses = 4;
        if($scope.isBlockSchedule($scope.blockSchedule)){
            console.log("GOT HERE")
            $scope.numCourses = 8
        }
        
        var blockNum = 1;
        var isBDay = false;
        for(var i = 0; i < $scope.numCourses; i++){
            var av = new SecondaryCourse();
            av.startTime = new Date();
            av.startTime.setHours(7);
            av.startTime.setMinutes(30);
            av.endTime = new Date();
            av.endTime.setHours(15);
            av.endTime.setMinutes(30);
            av.course = ''
            av.dayType = undefined
            if($scope.numCourses == 8){
                av.dayType = 'A/X'
                if(isBDay == true){
                    av.dayType = 'B/Y'
                }
                
            }
            
            av.block = blockNum;
            blockNum++;
            if(blockNum == 5){
                isBDay = true;
                blockNum = 1;
            }
            $scope.secondaryClasses.push(av)
            
        }
        console.log($scope.secondaryClasses)
        $scope.secondaryPlanning = $scope.initializeSecondaryOther("Planning");
        $scope.secondaryLunch = $scope.initializeSecondaryOther("Lunch");
    }
    
    $scope.initializeSecondaryOther = function(className){
        
        var extraClasses = [];
        var numExtraCourses = 1
        //$scope.numCourses = 4;
        if($scope.isBlockSchedule($scope.blockSchedule)){
            
            numExtraCourses = 2
        }
        var bDayCounter = 1;
        for(var i = 0; i < numExtraCourses; i++){
            var av = new SecondaryCourse();
            av.startTime = new Date();
            av.startTime.setHours(7);
            av.startTime.setMinutes(30);
            av.endTime = new Date();
            av.endTime.setHours(15);
            av.endTime.setMinutes(30);
            av.course = ''
            av.dayType = undefined
            
            av.dayType = 'A/X'
            if(bDayCounter % 2 == 0){
                av.dayType = 'B/Y'
            }
            bDayCounter++;
            
            extraClasses.push(av)
            
        }
        return extraClasses
    }
    
   
    
    $scope.initializeElementaryOther = function(className){
        var av = new ElementaryCourse();
        av.startTime = new Date();
        av.startTime.setHours(7);
        av.startTime.setMinutes(30);
        av.endTime = new Date();
        av.endTime.setHours(15);
        av.endTime.setMinutes(30);
        av.course = className;
        return av;
    }
    
    $scope.addElementaryElectiveCourse = function(className){
        $scope.elemClasses.push($scope.initializeElementaryOther(className));
        
    }
    
    $scope.initializeElementaryElectiveTeacherCourses = function(className){
        $scope.elemClasses = []
        for(var i = 0; i < 8; i++){
            $scope.addElementaryElectiveCourse(className);
        }
    }
    
    $scope.initializeElemClasses = function(subject){
        $scope.gradeLevel = subject;
        console.log($scope.gradeLevel);
        $scope.isElectiveTeacher = false
        for(var i=0; i < $scope.elemSubjects.length; i++){
            if( $scope.elemSubjects[i] === subject || ( $scope.elemSubjects[i] !== $scope.elemSubjects[i] && subject !== subject ) ){
                $scope.initializeElementaryElectiveTeacherCourses(subject)
                $scope.isElectiveTeacher = true;
            }
        }
        if($scope.isElectiveTeacher == false){
            $scope.initializeElementaryCourses(elemCourses, false);
        }
        console.log($scope.isElectiveTeacher)
        console.log($scope.gradeLevel)
    }
    
    $scope.initializeElementary = function(){
        $scope.initializeElementaryCourses(elemCourses, false);
        $scope.initializeElementaryCourses(elemElectives, true);
        $scope.recess = $scope.initializeElementaryOther("Recess");
        $scope.lunchBreak = $scope.initializeElementaryOther("Lunch");
        $scope.secondaryPlanning = [];
        $scope.secondaryLunch = [];
        $scope.secondaryClasses = [];
    }
    
    $scope.initializeSecondary = function(className){
        $scope.initializeSecondaryCourses();
        $scope.secondaryPlanning = $scope.initializeSecondaryOther("Planning");
        $scope.secondaryLunch = $scope.initializeSecondaryOther("Lunch");
        $scope.elemClasses = [];
        $scope.elemElectives = [];
    }
    
    $scope.deleteElemClass = function(av){
        for (var i = 0; i < $scope.availability.length; i++){
            if ($scope.elemClasses[i] === av){
                $scope.elemClasses.splice(i,1);
            }
        }
    };
    
    $scope.resetForm();
    $scope.getPracticumBearing()
    $scope.getSchoolDivisions();
    
    
    
});

