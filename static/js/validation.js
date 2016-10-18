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

    $scope.schools = [{"division": "Fredericksburg", "schools": ["Hugh Mercer Elementary School", 
    "Lafayette Upper Elementary School", "Walker-Grant Middle School", "James Monroe High School"]}, 
    {"division": "Spotsylvania", "schools": [ "Battlefield Elementary School", "Berkeley Elementary School", 
    "Brock Road Elementary School", "Cedar Forest Elementary School", "Chancellor Elementary School", 
    "Courthouse Road Elementary School", "Courtland Elementary School", "Harrison Road Elementary School", 
    "Lee Hill Elementary School", "Livingston Elementary School", "Parkside Elementary School", "Riverview Elementary School", 
    "Robert E. Lee Elementary School", "Salem Elementary School", "Smith Station Elementary School", 
    "Spotswood Elementary School", "Wilderness Elementary School", "Battlefield Middle School", 
    "Chancellor Middle School", "Freedom Middle School", "Ni River Middle School", "Post Oak Middle School", 
    "Spotsylvania Middle School", "Thornburg Middle School", "Chancellor High School", "Courtland High School", 
    "Massaponax High School", "Riverbend High School", "Spotsylvania High School"]}, 
    {"division": "Stafford", "schools": [ "Anne E. Moncure Elementary School", "Anthony Burns Elementary School", 
    "Conway Elementary School", "Falmouth Elementary School", "Ferry Farm Elementary School", "Garrisonville Elementary School", 
    "Grafton Village Elementary School", "Hampton Oaks Elementary School", "Hartwood Elementary School", 
    "Kate Waller Barrett Elementary School", "Margaret Brent Elementary School", "Park Ridge Elementary School", 
    "Rockhill Elementary School", "Rocky Run Elementary School", "Stafford Elementary School", 
    "Widewater Elementary School", "Winding Creek Elementary School", "A. G. Wright Middle School", 
    "Brooke Point High School", "Dixon-Smith Middle School", "Colonial Forge High School", 
    "Edward E. Drew Middle School", "H. H. Poole Middle School", "Mountain View High School", 
    "North Stafford High School", "Rodney Thompson Middle School", "Shirley C. Heim Middle School", 
    "Stafford High School", "Stafford Middle School", "T. Benton Gayle Middle School"]},  
    {"division": "Fauquier", "schools": ["Bradley Elementary School", "Brumfield Elementary School", "Coleman Elementary School", 
    "Greenville Elementary School", "Miller Elementary School", "Pearson Elementary School", 
    "Pierce Elementary School", "Ritchie Elementary School", "Smith Elementary School", 
    "Thompson Elementary School", "Walter Elementary School", "Auburn Middle School", 
    "Cedar Lee Middle School", "Fauquier High School", "Kettle Run High School", "Liberty High School", 
    "Marshall Middle School", "Southeastern Alternative Middle & High School", "Taylor Middle School", 
    "Warrenton Middle School"]}, 
    {"division": "Prince William", "schools": [  "Alvey Elementary  School", "Antietam Elementary  School", "Ashland Elementary  School", 
    "Bel Air Elementary  School", "Belmont Elementary  School", "Bennett Elementary  School", 
    "Bristow Run Elementary  School", "Buckland Mills Elementary  School", "Cedar Point Elementary  School", 
    "Chris Yung Elementary  School", "Coles Elementary  School", "Dale City Elementary  School", 
    "Dumfries Elementary  School", "Ellis Elementary  School", "Enterprise Elementary  School", "Featherstone Elementary  School", 
    "Fitzgerald Elementary  School", "Glenkirk Elementary  School", "Gravely Elementary  School", "Haymarket Elementary  School", 
    "Henderson Elementary  School", "Kerrydale Elementary  School", "Kilby Elementary  School", "King Elementary  School", 
    "Kyle R. Wilson Elementary  School", "Lake Ridge Elementary  School", "Leesylvania Elementary  School", 
    "Loch Lomond Elementary  School", "Marshall Elementary  School", "Marumsco Hills Elementary  School", 
    "McAuliffe Elementary School", "Minnieville Elementary  School", "Montclair Elementary  School", "Mountain View Elementary  School", 
    "Mullen Elementary  School", "Neabsco Elementary  School", "The Nokesville School", "Occoquan Elementary  School", 
    "Old Bridge Elementary  School", "Pattie Elementary  School", "Penn Elementary  School", "Piney Branch Elementary  School", 
    "Potomac View Elementary  School", "River Oaks Elementary  School", "Rockledge Elementary  School", 
    "Rosa Parks Elementary  School", "Signal Hill Elementary  School", "Sinclair Elementary  School", 
    "Springwoods Elementary  School", "Sudley Elementary  School", "Swans Creek Elementary  School", 
    "T. Clay Wood Elementary  School", "Triangle Elementary  School", "Tyler Elementary  School", "Vaughan Elementary  School", 
    "Victory Elementary  School", "West Gate Elementary  School", "Westridge Elementary  School", "Williams Elementary  School", 
    "Yorkshire Elementary  School", "Battlefield High School", "Benton Middle School", "Beville Middle School", 
    "Brentsville District High School", "Bull Run Middle School", "Colgan High School", "Forest Park High School", 
    "Fred M. Lynn Middle School", "Freedom High School", "Gainesville Middle School", "Gar-Field High School", 
    "Graham Park Middle School", "Hampton Middle School", "Hylton High School", "Lake Ridge Middle School", 
    "Marsteller Middle School", "Osbourn Park High School", "PACE West", "Parkside Middle School", "Patriot High School", 
    "Pennington Traditional School", "Porter Traditional School",  "Potomac High School", "Potomac Middle School", 
    "Reagan Middle School", "Rippon Middle School", "Saunders Middle School", "Stonewall Jackson High School", 
    "Stonewall Middle School", "Woodbridge High School", "Woodbridge Middle School"]}, 
    {"division": "Faith Based", "schools": []}, 
    {"division": "Montesorri", "schools": ["Children's House of Old Town", "Lighthouse Academy of Fredericksburg", "Odyssey Montessori"]},
    {"division": "Other", "schools": ["Head Start", "Friends of the Rappahannock"]}];
    
    
    $scope.practicumBearingClasses = ["EDSE 303", "EDUC 203", "EDUC 204", "EDUC 303", "EDUC 305", "EDUC 351A", "EDUC 371", 
    "EDUC 373", "EDUC 385", "EDUC 388", "EDUC 453", "EDUC 454", "EDUC 455", "EDUC 456",
    "EDUC 457", "EDUC 458", "EDUC 459", "EDUC 510", "MATH 204", "EDCI 501", "EDCI 502", 
    "EDCI 507", "EDCI 509", "EDCI 515", "EDCI 519", "EDCI 521", "EDCI 523", "EDCI 538", 
    "EDCI 552", "EDCI 553", "EDCI 554", "EDCI 555", "EDCI 556", "EDCI 557", "EDCI 558",
    "EDCI 559", "EDSE 512", "EDSE 519", "EDSE 521", "EDSE 539", "EDSE 541", "TESL 515"];

















