function Student() {
    this.firstName = undefined;
    this.lastName = undefined;
    this.email = undefined;
    this.hasCar = false;
    this.passengers = 0;
    this.endorsements = {};
    this.enrolledClasses = {};
    this.availability = [];
    this.previousPractica = [];
    
    this.initialize = function(obj){
        if (obj.firstName)
            this.firstName = obj.firstName;
        if (obj.lastName)
            this.lastName = obj.lastName;
        if (obj.email)
            this.email = obj.email;
        if (obj.hasCar)
            this.hasCar = obj.hasCar;
        if (obj.passengers)
            this.passengers = obj.passengers;
        if (obj.endorsements)
            this.endorsements = obj.endorsements;
        if (obj.enrolledClasses)
            this.enrolledClasses = obj.enrolledClasses;
            
        if (obj.availability){
            for (var i = 0; i < obj.availability.length; i++){
                var av = new Availability();
                av.initialize(obj.availability[i]);
                this.availability.push(av);
            }
        }
        
        if (obj.previousPractica){
            for (var i = 0; i < obj.previousPractica.length; i++){
                var prac = new PreviousPractica();
                prac.initialize(obj.previousPractica[i]);
                this.previousPractica.push(prac);
            }
        }
    }
}


function Availability(){
    this.startTime = undefined;
    this.endTime = undefined;
    this.monday = false;
    this.tuesday = false;
    this.wednesday = false;
    this.thursday = false;
    this.friday = false;
    
    this.initialize = function(obj){
        if (obj.startTime)
            this.startTime = obj.startTime;
        if (obj.endTime)
            this.endTime = obj.endTime;
        if (obj.monday)
            this.monday = obj.monday;
        if (obj.tuesday)
            this.tuesday = obj.tuesday;
        if (obj.wednesday)
            this.wednesday = obj.wednesday;
        if (obj.thursday)
            this.thursday = obj.thursday;
        if (obj.startTime)
            this.friday = obj.friday;
    }
}

function PreviousPractica(){
    this.schoolDivision = undefined;
    this.school = undefined;
    this.grade = undefined;
    this.course = undefined;
    this.other = undefined;
    this.otherSchool = undefined;
    
    this.initialize = function(obj){
        if (obj.school)
            this.school = obj.school;
        if (obj.grade)
            this.grade = obj.grade;
        if (obj.course)
            this.course = obj.course;
            
        delete this.schoolDivision;
        delete this.other;
        delete this.otherSchool;
    }
}


function PracticumAssignment(){
    //student email
    this.studentId = undefined;
    //teacher serial id
    this.teacherId = undefined;
    this.course = undefined;
    //stores the day booleans, start, and end time
    this.availability = new Availability();
    
    this.initialize = function(obj){
        if (obj.studentId)
            this.studentId  = obj.studentId;
        if (obj.teacherId)
            this.teacherId = obj.teacherId;
        if (obj.course)
            this.course = obj.course;
        if (obj.availability)
            this.availability.initialize(obj.availability);
    }
}

function ElementaryCourse(){
    this.course = undefined;
    this.startTime = undefined;
    this.endTime = undefined;
    
    this.initialize = function(obj){
        if (obj.course)
            this.course  = obj.course;
        if (obj.startTime)
            this.startTime = obj.startTime;
        if (obj.endTime)
            this.endTime = obj.endTime;
    }
}

function SecondaryCourse(){
    this.course = undefined;
    this.startTime = undefined;
    this.endTime = undefined;
    this.dayType = undefined;
    this.block = undefined;
    
    this.initialize = function(obj){
        if (obj.course)
            this.course  = obj.course;
        if (obj.startTime)
            this.startTime = obj.startTime;
        if (obj.endTime)
            this.endTime = obj.endTime;
        if (obj.dayType)
            this.dayType = obj.dayType;
        if (obj.block)
            this.block = obj.block;
    } 
}

function Teacher() {
    this.firstName = undefined;
    this.lastName = undefined;
    this.email = undefined;
    this.id = undefined;
    this.school = undefined;
    this.schoolDivision = undefined;
    this.grade = undefined;
    this.hostFall = false;
    this.hostSpring = false;
    this.elementarySchedule = [];
    this.secondarySchedule = [];
    
    this.initialize = function(obj){
        if (obj.firstName)
            this.firstName = obj.firstName;
        if (obj.lastName)
            this.lastName = obj.lastName;
        if (obj.email)
            this.email = obj.email;
        if (obj.id)
            this.id = obj.id;
        if (obj.school)
            this.school = obj.school;
        if (obj.schoolDivision)
            this.schoolDivision = obj.schoolDivision;
        if (obj.grade)
            this.grade = obj.grade;
        if (obj.hostFall)
            this.hostFall = obj.hostFall;
        if (obj.hostSpring)
            this.hostSpring = obj.hostSpring;
        if (obj.elementarySchedule){
            for (var i = 0; i < obj.elementarySchedule.length; i++){
                var el = new ElementaryCourse();
                el.initialize(obj.elementarySchedule[i]);
                this.elementarySchedule.push(el);
            }
        }
        
        if (obj.secondarySchedule){
            for (var i = 0; i < obj.secondarySchedule.length; i++){
                var sec = new SecondaryCourse();
                sec.initialize(obj.secondarySchedule[i]);
                this.secondarySchedule.push(sec);
            }
        }
        
    }
}

function TransportationAssignment(){
    this.driver = undefined;
    this.passengers = [];
    
    this.initialize = function(obj){
        if (obj.driver)
            this.driver = obj.driver;
        
        if (obj.passengers){
            for (var i = 0; i < obj.passengers.length; i++){
                var pass = new Passenger();
                pass.initialize(obj.passengers[i]);
                this.passengers.push(pass);
            }
        }
    }
}
