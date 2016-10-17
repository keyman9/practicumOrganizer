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
    this.student = undefined;
    this.teacher = undefined;
    this.course = undefined;
    this.availability = new Availability();
}