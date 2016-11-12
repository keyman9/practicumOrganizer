'use strict';
angular.module('POBoxApp').controller('ReportsController', function($scope, $window){
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/reports')
    
    $scope.createReport = function(reportType, limit){
        console.log(reportType, limit);
        socket.emit("createReport", reportType, limit)
    }
    
    socket.on("reportCreated", function(reportType){
        window.location = "/reports/" + reportType;
    });
    
    window.onblur = function(){
        socket.emit("deleteReport");
        window.location.reload();
    }
        
    
});