var POBoxApp= angular.module('POBoxApp',['ui.bootstrap','mgcrea.ngStrap'])

POBoxApp.controller('AssignPracticumController', function($scope, $window){
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/practica')
    
    var student = {'passengers': 0, 
        'firstName': 'Harry', 
        'lastName': 'Potter', 
        'enrolledClasses': ['EDUC 204'], 
        'endorsements': ['English'], 
        'availability': [
            {'monday': false, 'tuesday': false, 'friday': true, 'wednesday': false, 'thursday': false, 'startTime': '7:30:25 AM', 'endTime': '3:30:25 PM'}, 
            {'monday': false, 'tuesday': true, 'friday': false, 'wednesday': false, 'thursday': true, 'startTime': '12:30:25 PM', 'endTime': '2:30:25 PM'}, 
            {'monday': false, 'tuesday': false, 'friday': false, 'wednesday': true, 'thursday': false, 'startTime': '1:00:25 PM', 'endTime': '3:00:25 PM'}
        ],
        'hasCar': true, 
        'previousPractica': [
            {'course': 'English 6', 'school': 'Walker-Grant Middle School'}, 
            {'course': 'English 8', 'school': 'Thornburg Middle School'}, 
            {'course': 'AP/DE/IB English 12', 'school': 'North Stafford High School'}
        ], 
        'email': 'hpotter@hogwarts.uk'};
        
    $scope.students = [];
    $scope.currentStudent = {};
        
    $scope.initializeStudents = function(){
        for (var i = 0; i < 10; i++){
            var stu = new Student();
            stu.initialize(student);
            $scope.students.push(stu);
        }
        console.log($scope.students);
    }
    
    $scope.setCurrentStudent = function(student){
        $scope.currentStudent = student;
    }
    
    
    $scope.initializeStudents();

});