
var POBoxApp= angular.module('POBoxApp',['ui.bootstrap','mgcrea.ngStrap', 'ngSlimScroll','ngSanitize'])

POBoxApp.controller('AssignPracticumController', function($scope, $window, $popover){
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/practica')
    
    var student = {'passengers': 0, 
        'firstName': 'Harry', 
        'lastName': 'Potter', 
        'enrolledClasses': ['EDUC 204', 'EDUC 205'], 
        'endorsements': ['English', 'Chemistry'], 
        'availability': [
            {'monday': false, 'tuesday': false, 'friday': true, 'wednesday': false, 'thursday': false, 'startTime': '7:30AM', 'endTime': '3:30PM'}, 
            {'monday': false, 'tuesday': true, 'friday': false, 'wednesday': false, 'thursday': true, 'startTime': '12:30PM', 'endTime': '2:30PM'}, 
            {'monday': false, 'tuesday': false, 'friday': false, 'wednesday': true, 'thursday': false, 'startTime': '1:00PM', 'endTime': '3:00PM'}
        ],
        'hasCar': true, 
        'previousPractica': [
            {'course': 'English 6', 'school': 'Walker-Grant Middle School'}, 
            {'course': 'English 8', 'school': 'Thornburg Middle School'}, 
            {'course': 'AP/DE/IB English 12', 'school': 'North Stafford High School'}
        ], 
        'email': 'hpotter@hogwarts.uk'};
        
    $scope.practicumBearingClasses = ["EDSE 303", "EDUC 203", "EDUC 204", "EDUC 303", "EDUC 305", "EDUC 351A", "EDUC 371", 
    "EDUC 373", "EDUC 385", "EDUC 388", "EDUC 453", "EDUC 454", "EDUC 455", "EDUC 456",
    "EDUC 457", "EDUC 458", "EDUC 459", "EDUC 510", "MATH 204", "EDCI 501", "EDCI 502", 
    "EDCI 507", "EDCI 509", "EDCI 515", "EDCI 519", "EDCI 521", "EDCI 523", "EDCI 538", 
    "EDCI 552", "EDCI 553", "EDCI 554", "EDCI 555", "EDCI 556", "EDCI 557", "EDCI 558",
    "EDCI 559", "EDSE 512", "EDSE 519", "EDSE 521", "EDSE 539", "EDSE 541", "TESL 515"];
    
    $scope.endorsements = ["Elementary Education pK-6", "English", "Foreign Language- French", "Foreign Language- German", 
    "Foreign Language- Latin", "Foreign Language- Spanish", "History & Social Sciences", "Mathematics", 
    "Music preK-12: Instrumental", "Music preK-12: Vocal/ Choral", "Science: Biology", "Science: Chemistry",
    "Science: Earth Science", "Science: Physics", "Special Education K-12: Adapted Curriculum", 
    "Special Education K-12: General Curriculum", "Theater Arts preK-12", "Visual Art preK-12"];
    
    $scope.students = [];
    $scope.studentsFromDB = [];
    $scope.currentStudent = {};
        
    $scope.initializeStudents = function(){
        
        socket.emit('loadStudents');
        
        
        for (var i = 0; i < 10; i++){
            var stu = new Student();
            stu.initialize(student);
            $scope.students.push(stu);
        }
        console.log($scope.students);
    }
    
    $scope.setCurrentStudent = function(student){
        $scope.currentStudent = student;
        console.log($scope.currentStudent);
    }
    
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
    }
    
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
    }
    
    $scope.initializeStudents();
    


});