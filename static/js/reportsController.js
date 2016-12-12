'use strict';
angular.module('POBoxApp').controller('ReportsController', function($scope, $window){
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/reports')
    
    $scope.schoolDivisions = [];
    $scope.schools = [];
    $scope.practicumBearingClasses = [];
    $scope.selected = {};
    $scope.reportType = undefined;
    
    $scope.semester = undefined;
    
    var iframe = undefined;
    
    /**************************************************/
    
    //Pull in options from database
    
    $scope.getSchoolDivisions = function(){
        socket.emit('getDivisions');
    }
    
    socket.on("retrievedDivisions", function(divisions){
        if (divisions.length > 0){
            for (var i=0; i < divisions.length; i++){
                if (divisions[i].length > 0){
                    $scope.schoolDivisions.push(divisions[i][0]);                  
                    var sch = divisions[i][1];
                    for (var j = 0; j < sch.length; j++){
                        $scope.schools.push(sch[j]);
                    }
                }
            }
        }
        console.log($scope.schoolDivisions);
        console.log($scope.schools);
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
        console.log($scope.practicumBearingClasses);
        $scope.$apply();
    });
    
    /**************************************************/
    
    //Methods for creating report
    
    $scope.prepForReports = function(){
        if ($scope.practicumBearingClasses.length < 1){
            $scope.getPracticumBearing();
        }
        
        if ($scope.schoolDivisions.length < 1 || $scope.schools.length < 1){
            $scope.getSchoolDivisions();
        }
    }
    
    $scope.setReportType = function(type){
        $scope.reportType = type;
    }
    
    $scope.createReport = function(reportType, limit){
        console.log(reportType, limit);
        socket.emit("createReport", reportType, limit)
        $scope.selected = limit;
    }
    
    // Damnit Sheldon, look here for downloading.
    socket.on("reportCreated", function(reportType){
        if (iframe)
            document.body.removeChild(iframe);
        var iframe = document.createElement('iframe');
        iframe.id = "hiddenIframe";
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
        iframe.src = "/reports/" + reportType;
    });
    
    $scope.deleteReports = function(){
        socket.emit("deleteReport");
    }
    
    $scope.setConfirmType = function(semester){
        console.log(semester);
        if(semester === 'fall'){
            $('#confirmFallArchiveModal').modal('show');
        } else if (semester === 'spring'){
            $('#confirmSpringArchiveModal').modal('show');
        }
        $scope.semester = semester;
    }
    
    $scope.archSem = function(sem){
        console.log(sem);
        if(sem === 'fall'){
            socket.emit("archSem", sem);
        } else if(sem === 'spring'){
            socket.emit("archSem", sem);
        }
    }
    
    socket.on("semesterArchived", function(semSuccess){
        console.log(semSuccess);
        var confirmSemester = $('#archiveSucess');
        var semester = ''
        var confirmMessage = ''
        if(semSuccess.sem === 'fall'){
            semester = "Fall ";
        } else if(semSuccess.sem === 'spring'){
            semester = "Spring ";
        }
        if(semester.success === 'true'){
            confirmMessage = '<button type="button" class="close" data-dismiss="alert">&times;</button> <span class="glyphicon-exclamation-sign" aria-hidden="true"></span>' + semester + "was successfully archived!";
            confirmSemester.empty();
            confirmSemester.append(confirmMessage);
            confirmSemester.fadeIn().delay(3000).fadeOut(600);
        } else if(semester.success === 'false'){
            confirmSemester.removeClass('alert-success');
            confirmSemester.addClass('alert-danger');
            confirmMessage = '<button type="button" class="close" data-dismiss="alert">&times;</button> <span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> &nbsp;&nbsp;' + semester + "was unable to archive. Something went wrong.";
            confirmSemester.empty();
            confirmSemester.append(confirmMessage);
            confirmSemester.fadeIn().delay(3000).fadeOut(600);
        }
    });
});