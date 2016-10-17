var POBoxApp= angular.module('POBoxApp',['ui.bootstrap','mgcrea.ngStrap', 'ui.slimscroll'])

POBoxApp.controller('StudentFormController', function($scope, $window){
    var socket = io.connect('https://' + document.domain + ':' + location.port + '/student')
    
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
    {"division": "Other", "schools": ["Head Start", "Friends of the Rappahannock", "Other"]}];

    
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

    
    $scope.endorsementSought = undefined;
    $scope.enrolledClasses = undefined;
    $scope.transportation = undefined;
    $scope.passengerNum = 0;
    $scope.firstName = undefined;
    $scope.lastName = undefined;
    $scope.email = undefined;
    $scope.availability = [];
    $scope.previousPractica = [];
    $scope.noPreviousPractica = false;

    $scope.invalidFirstName = false;
    $scope.invalidLastName = false;
    $scope.invalidEmail = false;
    $scope.invalidEndorsement = false;
    $scope.invalidEnrolledClass= false;
    $scope.invalidTransportation= false;
    $scope.invalidAvailability = true;
    $scope.invalidPractica = true;
    $scope.availabilityErrorMsg = ["", "", ""];
    $scope.practicaErrorMsg = [];
        
    //returns schools in selected division (of previous practica)
    $scope.getDivision = function(id){
       for (var i = 0; i < $scope.schools.length; i++){
           if ($scope.schools[i].division === $scope.previousPractica[id].schoolDivision){
               return $scope.schools[i].schools;
           }
       }
    };
    
    $scope.addAvailability = function(){
        var av = new Availability();
        av.start = new Date();
        av.start.setHours(7);
        av.start.setMinutes(30);
        av.end = new Date();
        av.end.setHours(15);
        av.end.setMinutes(30);
        $scope.availability.push(av);
    };
    
    $scope.deleteAvailability = function(av){
        for (var i = 0; i < $scope.availability.length; i++){
            if ($scope.availability[i] === av){
                $scope.availabilityErrorMsg[i] = ""
                $scope.availability.splice(i,1);
            }
        }
    };
    
    $scope.addPractica = function(){
        var prac = new PreviousPractica();
        $scope.practicaErrorMsg.push("");
        $scope.previousPractica.push(prac);
    };
    
    $scope.deletePractica = function(prac){
        for (var i = 0; i < $scope.previousPractica.length; i++){
            if ($scope.previousPractica[i] === prac){
                $scope.previousPractica.splice(i,1);
                $scope.practicaErrorMsg.splice(i,1);
            }
        }
    };
    
    $scope.updatePractica = function(){
       if ($scope.noPreviousPractica){
           $scope.previousPractica = [];
           $scope.practicaErrorMsg = [];
       } else{
            var prac = new PreviousPractica();
            $scope.previousPractica.push(prac);
            $scope.practicaErrorMsg.push("");
       }
    };
    
    $scope.isElementary = function(school){
        var sch = String(school);
        if (sch.indexOf("Elementary") > 0){
            return true;
        } else {
            return false;
        }
    };
    
    $scope.changeGrade = function(item){
        item.course = undefined;
        item.other = undefined;
    }
    
    $scope.changeCourse = function(item){
        item.grade = undefined;
        item.other = undefined;
    }
    
    $scope.changeSchool = function(item){
        item.otherSchool = undefined;
        item.other = undefined;
        $scope.changeCourse(item);
        $scope.changeGrade(item);
    }
    
    $scope.changeSchoolDivision = function(item){
        $scope.changeSchool(item);
        item.school = undefined;
    }

    // $scope.print = function(item){
    //     console.log(item);
    // };
    
    $scope.submit = function(){
        var stu = new Student();
        
        stu.firstName = $scope.firstName;
        stu.lastName = $scope.lastName;
        stu.email = $scope.email;
        stu.endorsements = $scope.endorsementSought;
        stu.enrolledClasses = $scope.enrolledClasses; 
       
        for (var i = 0; i < $scope.availability.length; i++){
            // console.log($scope.availability[i]);
            var av = $scope.availability[i];
            if (Object.prototype.toString.call(av.start) === "[object Date]"){
                av.startTime = av.start.toLocaleTimeString();
            }
            if (Object.prototype.toString.call(av.end) === "[object Date]"){
                av.endTime = av.end.toLocaleTimeString();
            }
            
            delete $scope.availability[i].start;
            delete $scope.availability[i].end;
            
        }
        stu.availability = $scope.availability;
        
        for (var i = 0; i < $scope.previousPractica.length; i++){
            var current = $scope.previousPractica[i]; 
            delete current.schoolDivision;
            if (current.course === "Other"){
                current.course = current.other;
            }
            if (current.school === "Other"){
                current.school = current.otherSchool;
            }
            if (current.grade && current.grade.value == -1){
                current.course = current.grade.displayName;
                current.grade = undefined;
            } else if(current.grade){
                var temp = current.grade.value;
                current.grade = temp;
            }
            delete current.other;
            delete current.otherSchool;
        }
        stu.previousPractica = $scope.previousPractica;
        
        if ($scope.transportation === "none"){
            stu.hasCar = false;
        } else {
            stu.hasCar = true;
        }
        
        stu.passengers = $scope.passengerNum;
        
        console.log(stu);
        
        socket.emit('submit', stu);
    };
    
    for (var i = 0; i < 3; i++){
        $scope.addAvailability();
    }
    
    $scope.addPractica();
    
    //Validation
    
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
    
    $scope.validateEndorsement = function(){
        if ($scope.endorsementSought === undefined || $scope.endorsementSought === []){
            $scope.invalidEndorsement = true;
        } else {
            $scope.invalidEndorsement = false;
        }
    }
    
    $scope.validateEnrolledClass = function(){
        if ($scope.enrolledClasses === undefined || $scope.enrolledClasses === []){
            $scope.invalidEnrolledClass = true;
        } else {
            $scope.invalidEnrolledClass = false;
        }
    }
    
    $scope.validateTransportation = function(){
        var transport = $scope.transportation;
    	if (transport != "none" && transport != "self" && transport != "others"){
    		$scope.invalidTransportation = true;
    	} else {
            $scope.invalidTransportation = false;
        }
    }
    
    
    $scope.validateDays = function(index, updateMsg){
        var av = $scope.availability[index];
        var invalid = false;
        
        if (!av.monday && !av.tuesday && !av.wednesday && !av.thursday && !av.friday){
            invalid = true;
            if (updateMsg && $scope.availabilityErrorMsg[index].indexOf("You must select at least 1 day of the week for each available time!\n") === -1){
                $scope.availabilityErrorMsg[index] += "You must select at least 1 day of the week for each available time!\n";
            }
        } else {
            if (updateMsg && $scope.availabilityErrorMsg[index].indexOf("You must select at least 1 day of the week for each available time!\n") != -1){
                var msg = $scope.availabilityErrorMsg[index];
                msg = msg.replace("You must select at least 1 day of the week for each available time!\n", "");
                $scope.availabilityErrorMsg[index] = msg;
            }
        }
        
        return invalid;
    }
    
    $scope.validateTimes = function(index, updateMsg){
        var av = $scope.availability[index];
        var invalid = false;
        
        //start time is before 7:30AM
        if (av.start.getHours() < 7){
            invalid = true;
            if (updateMsg && $scope.availabilityErrorMsg.indexOf("The start time must be after 7:00AM!\n") === -1){
                $scope.availabilityErrorMsg[index] += "The start time must be after 7:00AM!\n";
            }
        } else {
            if (updateMsg && $scope.availabilityErrorMsg[index].indexOf("The start time must be after 7:00AM!\n") != -1){
                var msg = $scope.availabilityErrorMsg[index];
                msg = msg.replace("The start time must be after 7:00AM!\n", "");
                $scope.availabilityErrorMsg[index] = msg;
            }
        }
        
        //end time is after 3:30PM
        if (av.end.getHours() >= 16){
            invalid = true;
            if (updateMsg && $scope.availabilityErrorMsg.indexOf("The end time must be before 4:00PM!") === -1){
                $scope.availabilityErrorMsg[index] += "The end time must be before 4:00PM!\n";
            }
        } else {
            if (updateMsg && $scope.availabilityErrorMsg[index].indexOf("The end time must be before 4:00PM!\n") != -1){
                var msg = $scope.availabilityErrorMsg[index];
                msg = msg.replace("The end time must be before 4:00PM!\n", "");
                $scope.availabilityErrorMsg[index] = msg;
            }
        }
        
        //end time is not at least 2 hours after start time
        var diff = av.end.getTime() - av.start.getTime();
        var diffMins = (diff/1000)/60;
        if (diffMins < 120){
            invalid = true;
            if (updateMsg && $scope.availabilityErrorMsg.indexOf("Timeslots must be at least 2 hours long!") === -1){
                $scope.availabilityErrorMsg[index] += "Timeslots must be at least 2 hours long!\n";
            }
        } else {
            if (updateMsg && $scope.availabilityErrorMsg[index].indexOf("Timeslots must be at least 2 hours long!\n") != -1){
                var msg = $scope.availabilityErrorMsg[index];
                msg = msg.replace("Timeslots must be at least 2 hours long!\n", "");
                $scope.availabilityErrorMsg[index] = msg;
            }    
        }
        
        return invalid;
        
    }
    $scope.validateAvailability = function(){
        var invalid = false;
        for (var i = 0; i < $scope.availability.length; i++){
            invalid = invalid || $scope.validateDays(i, false) || $scope.validateTimes(i, false);
        }
        $scope.invalidAvailability = invalid;
    }
    
    $scope.validatePracticum = function(index, updateMsg){
        var prac = $scope.previousPractica[index];
        var invalid = false;
  
        if (prac.school && prac.school === "Other" && prac.otherSchool === undefined){
            invalid = true;
            if (updateMsg && $scope.practicaErrorMsg[index].indexOf("You must enter a school!\n") === -1){
                $scope.practicaErrorMsg[index] += "You must enter a school!\n";
            }
        } else {
            if (updateMsg && $scope.practicaErrorMsg[index].indexOf("You must enter a school!\n") != -1){
                var msg = $scope.practicaErrorMsg[index];
                msg = msg.replace("You must enter a school!\n", "");
                $scope.practicaErrorMsg[index] = msg;
            }

        }
        if (prac.course && prac.course === "Other" && prac.other === undefined){
            invalid = true;
            if (updateMsg && $scope.practicaErrorMsg[index].indexOf("You must enter a course!\n") === -1){
                $scope.practicaErrorMsg[index] += "You must enter a course!\n";
            }
        } else {
            if (updateMsg && $scope.practicaErrorMsg[index].indexOf("You must enter a course!\n") != -1){
                var msg = $scope.practicaErrorMsg[index];
                msg = msg.replace("You must enter a course!\n", "");
                $scope.practicaErrorMsg[index] = msg;
            }
        }
        return invalid;
    }
    
    $scope.validateAllPractica = function(){
        var invalid = false;
        if (!$scope.noPreviousPractica){
            for (var i = 0; i < $scope.previousPractica.length; i++){
                var prac = $scope.previousPractica[i];
                invalid = invalid || prac.schoolDivision === undefined || prac.school === undefined || prac.schoolDivision === undefined 
                || (prac.grade === undefined && prac.course === undefined) || $scope.validatePracticum(i, false);
            }
        }
        $scope.invalidPractica = invalid;
    }
    
    $scope.formIsInvalid = function(){
        $scope.validateTransportation();
        $scope.validateEndorsement();
        $scope.validateEnrolledClass();
        $scope.validateAvailability(); 
        $scope.validateAllPractica();
        return ($scope.invalidFirstName || $scope.invalidLastName || $scope.invalidEmail || $scope.invalidEndorsement ||
        $scope.invalidEnrolledClass || $scope.invalidTransportation || $scope.invalidAvailability || $scope.invalidPractica ||
        $scope.firstName === undefined || $scope.lastName === undefined || $scope.email === undefined);
    }
    
     //TODO: Pull school divisions/schools, courses, endorsements, practicum-bearing courses from database
});
