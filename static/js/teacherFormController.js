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
    var elemCourses = ['Writing', 'Reading', 'Math', 'Social Studies', 'Science']
    var elemElectives = ['Art','Computer', 'Library', 'Music', 'P.E.']
    
    $scope.firstName = undefined;
    $scope.lastName = undefined;
    $scope.email = undefined;
    $scope.grade= undefined;
    $scope.school = undefined;
    $scope.schoolDivision = undefined;
    $scope.otherSchool= undefined;
    $scope.otherDivision='';
    $scope.otherGrade='';
    $scope.otherTravel='';
    $scope.teacherType = '';
    $scope.gradeLevel = undefined;
    $scope.elemClasses = []
    $scope.elemElectives = [];
    $scope.travelTeacher= undefined;
    $scope.otherHosting = '';
    $scope.semesterHosting = undefined;
    $scope.secondaryClasses = [];
    $scope.isElectiveTeacher = false
    $scope.blockSchedule = ''
    $scope.secondaryPlanning = [];
    $scope.secondaryLunch = [];

    $scope.invalidFirstName = false;
    $scope.invalidLastName = false;
    $scope.invalidEmail = false;
    $scope.isTravelTeacher = undefined;
    $scope.invalidDivision= false;
    $scope.invalidGrade= false;
    $scope.invalidTravel= false;
    $scope.submissionSuccess = false;
    $scope.submissionFailure = false;
    $scope.submissionMsg = "";
    

     /**************************************************/
       
     //Pull various select options into page
     
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
        //  console.log($scope.schoolDivisions);
    });
    
     /**************************************************/
    
    //Submission methods
    
    socket.on("submissionResult", function(result){
        var submitBox = $('#submitResult');
        console.log(submitBox)
        var submitText = '';
        console.log(result);
        
        if (result.error){
            
            submitBox.removeClass('alert-success');
            submitBox.addClass('alert-danger');
            submitText = '<button type="button" class="close" data-dismiss="alert">&times;</button> <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' + result.msg;
            submitBox.empty();
            submitBox.append(submitText);
            submitBox.fadeIn().delay(3000).fadeOut(600);
            $scope.goToTop();
            
        } else{
            submitBox.removeClass('alert-danger');
            submitBox.addClass('alert-success');
            submitText = '<button type="button" class="close" data-dismiss="alert">&times;</button> <span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> &nbsp;&nbsp;' + result.msg;
            submitBox.empty();
            submitBox.append(submitText);
            submitBox.fadeIn().delay(3000).fadeOut(600);
            $scope.resetForm();
            $scope.goToTop();
            
        }
        
        $scope.$apply();
    });
    
    $scope.submit = function(){
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
       
        if($scope.gradeLevel !== undefined){
            teacher.grade = $scope.gradeLevel;
        }
        
        // console.log($scope.teacherType);
        var classes = {}
        if($scope.teacherType == "Elementary"){
            // console.log("Elementary Classes");
            // console.log($scope.elemClasses);
            //change timestamp to string for regular classes
            for(var i = 0; i < $scope.elemClasses.length; i++){
                $scope.elemClasses[i]['startTime'] = getTimeString($scope.elemClasses[i]['startTime']);
                $scope.elemClasses[i]['endTime'] = getTimeString($scope.elemClasses[i]['endTime']);
            }
            classes['elemClasses'] = $scope.elemClasses;
            //change timestamp to string for electives
            for(var i = 0; i < $scope.elemElectives.length; i++){
                $scope.elemElectives[i]['startTime'] = getTimeString($scope.elemElectives[i]['startTime']);
                $scope.elemElectives[i]['endTime'] = getTimeString($scope.elemElectives[i]['endTime']);
            }
            classes['elemElectives'] = $scope.elemElectives;
            //change timestamp to string for recess 
            if($scope.recess != []){
                // console.log($scope.recess);
                $scope.recess['startTime'] = getTimeString($scope.recess['startTime']);
                $scope.recess['endTime'] = getTimeString($scope.recess['endTime']);
                classes['recess'] = $scope.recess;
            }
            //change timestamp to string for lunch
            $scope.lunchBreak['startTime'] = getTimeString($scope.lunchBreak['startTime']);
            $scope.lunchBreak['endTime'] = getTimeString($scope.lunchBreak['endTime']);
            classes['lunchBreak'] = $scope.lunchBreak;
            
            teacher.elementarySchedule = classes;
            //console.log(teacher.elementarySchedule);
            
        } else if($scope.teacherType == "Secondary"){
            // console.log("Secondary Classes");
            //convert secondary class timestamps
            for(var i = 0; i < $scope.secondaryClasses.length; i++){
                $scope.secondaryClasses[i]['startTime'] = getTimeString($scope.secondaryClasses[i]['startTime']);
                $scope.secondaryClasses[i]['endTime'] = getTimeString($scope.secondaryClasses[i]['endTime']);
                // console.log($scope.secondaryClasses[i]);
            }
            //store new string timestamps
            classes['secondaryClasses'] = $scope.secondaryClasses;
            //convert secondary planning timestamps
            for(var i = 0; i < $scope.secondaryPlanning.length; i++){
                $scope.secondaryPlanning[i]['course'] = "Planning";
                $scope.secondaryPlanning[i]['startTime'] = getTimeString($scope.secondaryPlanning[i]['startTime']);
                $scope.secondaryPlanning[i]['endTime'] = getTimeString($scope.secondaryPlanning[i]['endTime']);
            }
            //store new string timestamps
            classes['planning'] = $scope.secondaryPlanning;
            //convert secondary lunch timestamps
            for(var i = 0; i < $scope.secondaryLunch.length; i++){
                $scope.secondaryLunch[i]['course'] = "Lunch";
                $scope.secondaryLunch[i]['startTime'] = getTimeString($scope.secondaryLunch[i]['startTime']);
                $scope.secondaryLunch[i]['endTime'] = getTimeString($scope.secondaryLunch[i]['endTime']);
            }
            //store new string timestamps
            classes['secondaryLunch'] = $scope.secondaryLunch;
            
            //store all info in teacher
            teacher.secondarySchedule = classes;
            // console.log(teacher.secondarySchedule);
        }
        
        if($scope.otherSchool && $scope.otherSchool.length > 0){
            $scope.teacherType = "Other";
            teacher.school = $scope.otherSchool;
        } else if ($scope.school === "Other" && $scope.isTravelTeacher){
            teacher.school = "Travels";
        }
        
        console.log(teacher);
        
        socket.emit('submit', teacher);
    };
    
    
     /**************************************************/
     
     //Methods for adjusting questions based on previous answers
    
    $scope.isBlockSchedule = function(schedule){
        if(schedule === 'Yes'){
            return true;
        }
        return false;
    };
    

    $scope.isTravelTeacherCheck = function(travelTeacher){
        // console.log(travelTeacher)
        // console.log($scope.travelTeacher)
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
    
    //If the value that was selected and entered into the function equals "Other"
    //return true so we know what to show/hide
    $scope.isOther = function(school){
        
        var sch = String(school);
        if (sch === "Other"){
            $scope.resetSchoolType("Other");
            return true;
        } else {
            return false;
        }
        
    };
    
    //If school and division are both equal to "Other" and isTravelTeacher is not false
    //Return true so we can show a different input field for the user to enter a new school
    //Else return false
    $scope.allOther = function(school, division, isTravelTeacher){
        var div= String(division);
        var sch =String(school);
        
        // if(div==='Other' && sch === "Other" && isTravelTeacher === "false"){
        //     return true;
        // }
        if (sch === "Other" && isTravelTeacher === "false"){
            return true;
        }
        return false;
    };
    
    //This function checks to see if the gradeLevel entered is not undefined and
    //
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
        if (sch.indexOf("Middle") > 0 || sch.indexOf("High") > 0){
            $scope.resetSchoolType("Secondary");
            return true;
        } else {
            return false;
        }
    };
    
    $scope.changeSchool = function(item){
        // console.log(item)
        
        
        if($scope.isElementary(item)){
            $scope.initializeElementary(); 
        } else if($scope.isSecondary(item)){
            $scope.initializeSecondary();
        }
        //$scope.changeCourse(item);
        //$scope.changeGrade(item);
        
    };
    
    $scope.changeSchoolDivision = function(item){
        // console.log(item)
        $scope.changeSchool(item);
    };
    
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
        // console.log($scope.gradeLevel);
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
        // console.log($scope.isElectiveTeacher)
        // console.log($scope.gradeLevel)
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
        // console.log("Checking electives")
        // console.log($scope.elemElectives)
    }
    
    $scope.initializeSecondaryCourses = function(){
        $scope.secondaryClasses = [];
        $scope.numCourses = 7;
        if($scope.isBlockSchedule($scope.blockSchedule)){
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
            if(blockNum == 5 && $scope.isBlockSchedule($scope.blockSchedule)){
                isBDay = true;
                blockNum = 1;
            }
            $scope.secondaryClasses.push(av)
            
        }
        //console.log($scope.secondaryClasses)
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
            if($scope.isBlockSchedule($scope.blockSchedule)){
                av.dayType = 'A/X'
                if(bDayCounter % 2 == 0){
                    av.dayType = 'B/Y'
                }
                bDayCounter++;
            }
            
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
    
    /**************************************************/
    
    //Validation methods
    
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
        // console.log($scope.otherSchool);
        var schoolpat = /(^[A-Z]{1})([A-Za-z\'\-\.\s]+$)/;
    	var testSchool = schoolpat.test($scope.otherSchool);
        if ($scope.otherSchool === undefined || $scope.otherSchool === "" || !testSchool){
            $scope.invalidSchool = true;
        } else{
            $scope.invalidSchool = false;
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
    
    $scope.validateSecondary = function(){
        if ($scope.teacherType === "Secondary"){
            return $scope.validateSubjects($scope.secondaryClasses);
        } else {
            return false
        }
    }
    
    $scope.validateElementary = function(){
        if ($scope.teacherType === "Elementary" && !$scope.isElectiveTeacher){
            return $scope.validateDays($scope.elemElectives);
        } else {
            return false
        }
    }
    
    $scope.validateTravel = function(){
        if ($scope.teacherType === "Other"){
            return ($scope.isTravelTeacherUndefined() || ($scope.isTravelTeacher === "false" && ($scope.otherSchool === undefined || $scope.otherSchool === "")));
        } else {
            return false;
        }
    }
    
    $scope.validateDays = function(arr){
        var invalid = false;
        if (arr){
            for (var i = 0; i < arr.length; i++){
                var av = arr[i];
      
                if (!av.monday && !av.tuesday && !av.wednesday && !av.thursday && !av.friday){
                    invalid = true;
                } 
            }
        }
        return invalid;
    }
    
    $scope.validateSubjects = function(arr){
        var invalid = false;
        if (arr){
            for (var i = 0; i < arr.length; i++){
                var sch = arr[i];
                if (sch.course === undefined || sch.course === ""){
                    invalid = true;
                } 
            }
        }
        return invalid;
    }
    
    $scope.formIsInvalid = function(){
        return( $scope.invalidFirstName || $scope.invalidLastName || $scope.invalidEmail ||  
                $scope.invalidSchool || $scope.invalidDivision || $scope.invalidGrade || $scope.invalidTravel || 
                $scope.semesterHosting === undefined || $scope.school === undefined || $scope.schoolDivision === undefined || 
                $scope.validateElementary() || $scope.validateSecondary() || $scope.validateTravel() ||
                $scope.firstName === undefined || $scope.lastName === undefined || $scope.email === undefined);
    }

    /**************************************************/
    
    //Reset Methods
        
    $scope.resetForm = function(){
        $scope.firstName = undefined;
        $scope.lastName = undefined;
        $scope.email = undefined;
        $scope.grade= undefined;
        $scope.school = undefined;
        $scope.schoolDivision = undefined;
        $scope.otherSchool= undefined;
        $scope.otherDivision='';
        $scope.otherGrade='';
        $scope.otherTravel='';
        $scope.teacherType = '';
        $scope.gradeLevel = undefined;
        $scope.elemClasses = []
        $scope.elemElectives = [];
        $scope.travelTeacher= undefined;
        $scope.otherHosting = '';
        $scope.semesterHosting = undefined;
        $scope.secondaryClasses = [];
        $scope.isElectiveTeacher = false
        $scope.blockSchedule = ''
        $scope.secondaryPlanning = [];
        $scope.secondaryLunch = [];
    
        $scope.invalidFirstName = false;
        $scope.invalidLastName = false;
        $scope.invalidEmail = false;
        $scope.isTravelTeacher = undefined;
        $scope.invalidDivision= false;
        $scope.invalidGrade= false;
        $scope.invalidTravel= false;
        $scope.submissionSuccess = false;
        $scope.submissionFailure = false;
        $scope.submissionMsg = "";
        
        $scope.goToTop();
    }
    
    $scope.resetSchoolType = function(schoolLevel,gradeLevel){
        // console.log("resetSchoolType", schoolLevel);
        $scope.teacherType = schoolLevel;
        if (schoolLevel === "Secondary")
            $scope.gradeLevel = '';
            
        if (schoolLevel != "Other"){
            $scope.otherSchool = '';
            $scope.otherDivision='';
            $scope.travelTeacher = undefined;
        }
        
        
    };
    
    /**************************************************/
    
    //Miscellaneous methods
    var getTimeString = function(date){
        var h = date.getHours();
        var m = date.getMinutes();
        var mer = "";
        if (h < 12){
            mer = "AM";
        } else {
            mer = "PM";
        }
        if (h > 12){
            h = h - 12;
        } else if (h === 0){
            h = 12;
        }
        m = String(m);
        if (m.length < 2){
            m = "0" + m;
        }
        var timeString = String(h) + ":" + m + mer;
        return timeString;
    }
    
    $scope.goToTop = function() {
        // $location.hash('top');
        // $anchorScroll();
        $(window).scrollTop(0);
    };
    
    $scope.print = function(item){
        console.log(item);
    };
    
    // $scope.deleteElemClass = function(av){
    //     for (var i = 0; i < $scope.availability.length; i++){
    //         if ($scope.elemClasses[i] === av){
    //             $scope.elemClasses.splice(i,1);
    //         }
    //     }
    // };
    
    $scope.filterTravel = function(element) {
      return element === "Travels" ? false : true;
    };
    
    /**************************************************/
    
    $scope.resetForm();
    $scope.getSchoolDivisions();
    
});

