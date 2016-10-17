var POBoxApp= angular.module('POBoxApp',[])

POBoxApp.controller('LoginController', function($scope, $window){
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/login')
    
    $scope.accessCode = '';
    $scope.password1 = '';
    $scope.password2 = '';
    
    $scope.forgotPassword = function forgotPassword(){
        console.log('Forgot Password Clicked');
        socket.emit('forgotPassword');
    }
    
    socket.on('forgotPassword', function(){
    
        $('#forgotPasswordModal').modal('hide');
        $('#resetPasswordModal').modal('show');
    
    });
    
    $scope.resetPassword = function resetPassword(){
        var accessCode = $("#accessCode").val();
        console.log('Access Code inserted: ' + accessCode);
        var payload = {'accessCode' : accessCode};
        socket.emit('resetPassword', payload);
    }
    
    socket.on('resetPassword', function(message){
    
        $('#resetPasswordModal').modal('hide');
        $('#updatePasswordModal').modal('show');
        console.log(message);
    
    });
    
    $scope.updatePassword = function updatePassword(){
        var password1 = $("#resetPassword1").val();
        var password2 = $("#resetPassword2").val();
        
        console.log('Password 1: ' + password1);
        console.log('Password 2: ' + password2);
        
        if(password1 == password2){
            var payload = {'password' : password1};
            socket.emit('updatePassword', payload);
        } else {
            //error passwords have to match
            console.log('ERROR PASSWORDS DONT MATCH');
        }
    }
    
    socket.on('updatePassword', function(message){
    
        $('#updatePasswordModal').modal('hide');
    
    });
    
    
});