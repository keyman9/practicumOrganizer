
def zip_availabilities(student):
    payload = {}
    payload['startTime'] = student['starttime']
    payload['endTime'] = student['endtime']
    payload['monday'] = student['monday']
    payload['tuesday'] = student['tuesday']
    payload['wednesday'] = student['wednesday']
    payload['thursday'] = student['thursday']
    payload['friday'] = student['friday']
    return payload
    
def zip_practica(student):
    payload = {}
    payload['school'] = student['school']
    payload['course'] = student['grade']
    if student['grade'] == '0':
        payload['course'] = student['course']

    return payload
    
def zip_students(student, queryResults):
    payload = {}
    payload['email'] = student['email']
    payload['firstName'] = student['firstname']
    payload['lastName'] = student['lastname']
    payload['hasCar'] = student['hascar']
    payload['passengers'] = student['passengers'] 
    payload['previousPractica'] = [zip_practica(stud) for stud in queryResults['practica'] if payload['email'] == stud['studentemail']]
    payload['availability'] = [zip_availabilities(stud) for stud in queryResults['availability'] if payload['email'] == stud['studentemail']]
    payload['endorsements'] = [stud['endorsementname'] for stud in queryResults['endorsements']  if payload['email'] == stud['studentemail']]
    payload['enrolledClasses'] = [stud['coursename'] for stud in queryResults['courses'] if payload['email'] == stud['studentemail']]
    return payload

    

