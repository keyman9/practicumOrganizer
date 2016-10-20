var POBoxApp= angular.module('POBoxApp',[])

POBoxApp.controller('LoginController', function($scope, $window){
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/login')
    
    $scope.accessCode = '';
    $scope.password1 = '';
    $scope.password2 = '';
    $scope.user = '';
    $scope.message = '';

    
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
        
        
        console.log(message);
        if('error' in message){
            var resetMessageBox = $('#resetMessageBox');
            var messageText = '';
            resetMessageBox.removeClass('alert-success');
            resetMessageBox.addClass('alert-danger');
            messageText = '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span> ' + message['error'];      
            resetMessageBox.empty();
            resetMessageBox.append(messageText);
            resetMessageBox.fadeIn().delay(3000).fadeOut(600);
            
        }else{
            $('#resetPasswordModal').modal('hide');
            $('#updatePasswordModal').modal('show');
            
            var updateMessageBox = $('#updateMessageBox');
            var messageText = '';
            updateMessageBox.removeClass('alert-danger');
            updateMessageBox.addClass('alert-success');
            messageText = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="sr-only">Success:</span> ' + message['success'];    
            updateMessageBox.empty();
            updateMessageBox.append(messageText);
            updateMessageBox.fadeIn().delay(3000).fadeOut(600);
            
        }
        
    
    });
    
    $scope.updatePassword = function updatePassword(){
        var password1 = $("#resetPasswordField1").val();
        var password2 = $("#resetPasswordField2").val();
        
        var resetPasswordField1 = $('resetPassword1');
        var resetPasswordField2 = $('resetPassword2');
        
        resetPasswordField1.removeClass('has-error')
        resetPasswordField2.removeClass('has-error')
        
        
        console.log('Password 1: ' + password1);
        console.log('Password 2: ' + password2);
        
        if(password1.length < 8 || password2.length < 8){
            var updateMessageBox = $('#updateMessageBox');
            var messageText = '';
            updateMessageBox.removeClass('alert-success');
            updateMessageBox.addClass('alert-danger');
            var message = "Password length needs to exceed 8 characters!"
            messageText = '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span> ' + message;    
            updateMessageBox.empty();
            updateMessageBox.append(messageText);
            updateMessageBox.fadeIn().delay(3000).fadeOut(600);
            
        } else if(password1 == password2){
            
            var payload = {'password' : password1};
            socket.emit('updatePassword', payload);
            
        } else if(password1 != password2){
            
            var resetPasswordField1 = $('resetPassword1');
            var resetPasswordField2 = $('resetPassword2');
            
            resetPasswordField1.removeClass('has-error')
            resetPasswordField2.removeClass('has-error')
            resetPasswordField1.addClass('has-error');
            resetPasswordField2.addClass('has-error');
            
            var updateMessageBox = $('#updateMessageBox');
            var messageText = '';
            updateMessageBox.removeClass('alert-success');
            updateMessageBox.addClass('alert-danger');
            var message = "Passwords don't match!"
            messageText = '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span> ' + message;    
            updateMessageBox.empty();
            updateMessageBox.append(messageText);
            updateMessageBox.fadeIn().delay(3000).fadeOut(600);
        }
    }
    
    socket.on('updatePassword', function(message){
    
        $('#updatePasswordModal').modal('hide');
        
        var messageBox = $('#messageBox');
        var messageText = '';
        messageBox.removeClass('alert-danger');
        messageBox.addClass('alert-success');
        messageText = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span><span class="sr-only">Success:</span> ' + message['success'];    
        messageBox.empty();
        messageBox.append(messageText);
        messageBox.fadeIn().delay(3000).fadeOut(600);
    
    });
    
});