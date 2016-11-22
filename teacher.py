def zip_elementary_schedule(teacher):
    payload = {}
    payload['course'] = teacher['course']
    payload['startTime'] = teacher['starttime']
    payload['endTime'] = teacher['endtime']
    payload['monday'] = teacher['monday']
    payload['tuesday'] = teacher['tuesday']
    payload['wednesday'] = teacher['wednesday']
    payload['thursday'] = teacher['thursday']
    payload['friday'] = teacher['friday']
    return payload
    
def zip_secondary_schedule(teacher):
    payload = {}
    payload['daytype'] = teacher['daytype']
    payload['block'] = teacher['block']
    payload['course'] = teacher['course']
    payload['startTime'] = teacher['starttime']
    payload['endTime'] = teacher['endtime']
    return payload

def zip_teachers(teacher, queryResults):
    
    payload = {}
    payload['firstName'] = teacher['firstname']
    payload['lastName'] = teacher['lastname']
    payload['email'] = teacher['email']
    payload['id'] = teacher['teacherid']
    payload['school'] = teacher['schoolname']
    payload['schoolDivision'] = teacher['divisionname']
    payload['grade'] = teacher['grade']
    payload['hostFall'] = teacher['hostfall']
    payload['hostSpring'] = teacher['hostspring']
    payload['elementarySchedule'] = [zip_elementary_schedule(tea) for tea in queryResults['elemSched'] if tea['teacherid'] == teacher['teacherid']]
    payload['secondarySchedule'] = [zip_secondary_schedule(tea) for tea in queryResults['secondSched'] if tea['teacherid'] == teacher['teacherid']]
    return payload
    