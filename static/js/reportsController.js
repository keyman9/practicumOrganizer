'use strict';
angular.module('POBoxApp').controller('ReportsController', function($scope, $window){
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/reports')
    
    $scope.downloadReport = function(){
        window.location = "/reports"
    } 
    
});