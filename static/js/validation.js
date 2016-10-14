function checkEmail(){
	var emailpat = /(^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$)/;
  	var email = document.getElementById("email");
	var emailtest = emailpat.test(email.value);
	if (!emailtest){
		document.getElementById("errorinfo").innerHTML = "The email address you have entered is not valid. &nbsp; Please enter a valid email address.";
		// $('#validationfailed').modal();
		return false;
	} else {
		return true;
	}
}  


function checkPswd(){
	var pswdpat = /([A-Z]+)([a-z]+)([0-9]+)/;
	var pswdpat2 = /\S{5}/;
	var pswd = document.getElementById("password");
	var pswdtest = pswdpat.test(pswd.value);
	var pswdtest2 = pswdpat2.test(pswd.value);
	if (!pswdtest || !pswdtest2){
		document.getElementById("errorinfo").innerHTML = "Your password must be at least 5 characters long and contain 1 uppercase letter, 1 lowercase letter, and 1 number. &nbsp; Please re-enter your password.";
		// $('#validationfailed').modal();
		return false;
	} else {
		return true;
	}
}

function checkPswd1(){
	var pswdpat = /([A-Z]+)([a-z]+)([0-9]+)/;
	var pswdpat2 = /\S{5}/;
	var pswd = document.getElementById("password1");
	var pswdtest = pswdpat.test(pswd.value);
	var pswdtest2 = pswdpat2.test(pswd.value);
	if (!pswdtest || !pswdtest2){
		document.getElementById("errorinfo").innerHTML = "Your password must be at least 5 characters long and contain 1 uppercase letter, 1 lowercase letter, and 1 number. &nbsp; Please re-enter your password.";
		// $('#validationfailed').modal();
		return false;
	} else {
		return true;
	}
}


function checkPswdMatch(){
	var initial = document.getElementById("password1");
	var second = document.getElementById("password2");
	if (initial.value != second.value){
        document.getElementById("errorinfo").innerHTML = "The passwords you have entered do not match. &nbsp; Please re-enter your password.";
        // $('#validationfailed').modal();
        return false;
    } else {
        return true;
    }
}


function checkFirstName(){
	var namepat = /(^[A-Z]{1}[A-Za-z\'\-\.\s]+$)/;
	var name = document.getElementById("firstname");
	var testname = namepat.test(name.value);
	if (!testname){
		document.getElementById("errorinfo").innerHTML = "The name you have entered is not valid. &nbsp; Please enter a valid (capitalized) first name.";
		// $('#validationfailed').modal();
		return false;
	} else {
        return true;
    }
}


function checkLastName(){
	var namepat = /(^[A-Z]{1})([A-Za-z\'\-\.\s]+$)/;
	var name2 = document.getElementById("lastname");
	var testname = namepat.test(name2.value);
	if (!testname){
		document.getElementById("errorinfo").innerHTML = "The name you have entered is not valid. &nbsp; Please enter a valid (capitalized) last name.";
		// $('#validationfailed').modal();
		return false;
	} else {
        return true;
    }
}

function checkTransportation(){
	var transport = document.getElementById("transportation");
	if (transport.value != "none" && transport.value != "self" && transport.value != "others"){
		document.getElementById("errorinfo").innerHTML = "You must make a selection that reflects your transportation situation.";
		// $('#validationfailed').modal();
		return false;
	} else {
        return true;
    }
}

function checkAvailability(){
	var av = document.getElementById("availability");
	console.log(av);
	document.getElementById("errorinfo").innerHTML = av;
	return false;
	// if (transport.value != "none" && transport.value != "self" && transport.value != "others"){
	// 	document.getElementById("errorinfo").innerHTML = "You must make a selection that reflects your transportation situation.";
	// 	// $('#validationfailed').modal();
	// 	return false;
	// } else {
 //       return true;
 //   }
}

















