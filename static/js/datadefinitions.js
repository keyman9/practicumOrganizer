function Student() {
    this.firstName = undefined;
    this.lastName = undefined;
    this.email = undefined;
    this.hasCar = false;
    this.passengers = 0;
    this.endorsements= {};
    this.enrolledClasses = {};
    this.availability = [];
    this.previousPractica = [];
}

function Availability(){
    this.startTime = undefined;
    this.endTime = undefined;
    this.monday = false;
    this.tuesday = false;
    this.wednesday = false;
    this.thursday = false;
    this.friday = false;
}

function PreviousPractica(){
    this.schoolDivision = undefined;
    this.school = undefined;
    this.grade = undefined;
    this.course = undefined;
    this.other = undefined;
    this.otherSchool = undefined;
}