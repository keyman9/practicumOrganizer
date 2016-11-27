from db import *
import pandas as pd

def format_availability_string(availability):
    
    formatStr = ''
    
    if availability['monday']:
        formatStr += 'M/'
        
    if availability['tuesday']:
        formatStr += 'T/'
        
    if availability['wednesday']:
        formatStr += 'W/'
        
    if availability['thursday']:
        formatStr += 'Th/'
        
    if availability['friday']:
        formatStr += 'F/'
    
    return formatStr[:-1]

def create_course_report(limit):
    
    practicaCols = "s.email as email, s.firstname as stuFirstname, s.lastname as stuLastname, \
                    sch.schoolname, \
                    t.firstname as teacherFirstname, t.lastname as teacherLastname, t.teacherId, p.startTime as starttime, t.schoolid, \
                    p.endTime as endtime, p.course as course, \
                    m.monday, m.tuesday, m.wednesday, m.thursday, m.friday"
    selectPractica = "SELECT " + practicaCols +  " FROM practicumArrangement AS p \
                        JOIN students AS s ON s.email = p.studentEmail \
                        JOIN teachers as t USING (teacherId) \
                        JOIN meetingDays as m USING (meetingid) \
                        JOIN schools as sch USING (schoolid)"
    
    selectStudentCourses = "SELECT * FROM enrolledcourses WHERE studentemail IN (SELECT email FROM students)"   
    
    results = select_query_db(selectPractica)
    studentCourses = select_query_db(selectStudentCourses)
    
    # print(results)
    # print("----------------------")
    # print(studentCourses)
    
    lastNameCol = []
    firstNameCol = []
    assignedSchoolCol = []
    hostTeacherCol = []
    practicumCourseCol = []
    practicumDayTimeCol = []
    courseCol = []
    
    sortedlist = sorted(results , key=lambda elem: "%s, %s" % (elem['stulastname'], elem['stufirstname']))
    # print(results)
    # print("========================================")
    # print(sortedlist)
    
    for match in sortedlist:
        
        studentMatch = any(row[1] == match['email'] and row[0] == limit for row in studentCourses)
        if not studentMatch and limit != 'none':
            print("Student doesn't have the match")
            continue
        
        lastNameCol.append(match['stulastname'])
        firstNameCol.append(match['stufirstname'])
        
        assignedSchoolCol.append(match['schoolname'])
        
        teacherName = '{}, {}'.format(match['teacherlastname'], match['teacherfirstname'])
        hostTeacherCol.append(teacherName)
        
        availStr = format_availability_string(match)
        dayTime = '{}: {} - {}'.format(availStr, match['starttime'], match['endtime'])
        practicumDayTimeCol.append(dayTime)
        practicumCourseCol.append(match['course'])
        
        if limit != 'none':
            courseCol.append(limit)
        
        
        
            
        
    print(lastNameCol)
    print(firstNameCol)
    print(assignedSchoolCol)
    print(practicumDayTimeCol)
    print(practicumCourseCol)
    print(courseCol)
    
    
    
    
    
    
    # nameCol = []
    # courseCol = []
    # availCol = []
    # endorsementCol = []
    # previousPracCol = []
    # hasCarCol = []
    # passengerCol = []
    # students = load_students()
    
    # sortedlist = sorted(students , key=lambda elem: "%s %s" % (elem['lastName'], elem['firstName']))
    
    # print("SORTED")
    # print(sortedlist)
    
    # for student in sortedlist:
    #     #col 1
    #     name = '{}, {}'.format(student['lastName'], student['firstName'])
    #     nameCol.append(name)
        
    #     #col 2
    #     courses = '\n'.join(student['enrolledClasses'])
    #     courseCol.append(courses)
        
    #     #col 3
        
    #     availabilities = '\n'.join('{} {} - {}'.format(format_availability_string(value), value['startTime'], value['endTime']) for value in student['availability'])
    #     availCol.append(availabilities)
        
    #     #col 4
    #     endorsements = '\n'.join(student['endorsements'])
    #     endorsementCol.append(endorsements)
        
    #     #col 5
    #     prevPracs = '\n'.join('{}: {}'.format(value['school'], value['course']) for value in student['previousPractica'])    
    #     previousPracCol.append(prevPracs)
        
    #     #col6 and 7
    #     hasCar = 'No'
    #     passengerCount = ''
    #     if student['hasCar'] == True:
    #         hasCar = 'Yes and others'
    #         passengerCount = student['passengers']
    #         if student['passengers'] == 0:
    #             hasCar = 'Yes'
    #             passengerCount = ''
        
    #     hasCarCol.append(hasCar)
    #     passengerCol.append(passengerCount)   
    
    # print(nameCol)
    #print(courseCol)
    # print(availCol)
    # print(endorsementCol)
    # print(previousPracCol)
    # print(hasCarCol)
    # print(passengerCol)
    
    # df = pd.DataFrame({'Last Name, First Name': nameCol, 'Courses': courseCol, 'Days/Times': availCol, 'Endorsements': endorsementCol,
    # 'Previous Practica': previousPracCol, 'Do you have a car?': hasCarCol, 'Number of Passengers you can take':passengerCol})
    
    # colsForSheet = ["Last Name, First Name","Courses","Days/Times", "Endorsements", "Previous Practica", "Do you have a car?", "Number of Passengers you can take"]
    
    # writer = pd.ExcelWriter("pandas_column_formats.xlsx", engine='xlsxwriter')
    
    # pd.formats.format.header_style = None
    
    # df.to_excel(writer, sheet_name='Sheet1', index=False, columns=colsForSheet)
    # workbook  = writer.book
    # worksheet = writer.sheets['Sheet1']
    
    # formatDayTime = {'text_wrap': True, 'valign': 'vcenter', 'align': 'center'}
    # headerRow = {'bg_color': '#CCFFCC', 'bold': True, 'align': 'center', 'border': 2}
    # headerRowFormat = workbook.add_format(headerRow)
    # wrapDayTimeCol = workbook.add_format(formatDayTime)
    # wrapCourseCol = workbook.add_format(formatDayTime)
    # wrapPrevPracCol = workbook.add_format(formatDayTime)
    # wrapEndorsementCol = workbook.add_format(formatDayTime)
    
    
    
    # worksheet.set_column('A:A', 18, wrapDayTimeCol)
    # worksheet.set_column('B:B', 10, wrapDayTimeCol)
    # worksheet.set_column('C:C', 30, wrapDayTimeCol)
    # worksheet.set_column('D:D', 25, wrapDayTimeCol)
    # worksheet.set_column('E:E', 50, wrapDayTimeCol)
    # worksheet.set_column('F:F', 20, wrapDayTimeCol)
    # worksheet.set_column('G:G', 30, wrapDayTimeCol)
    # worksheet.set_row(0, None, headerRowFormat)
    # writer.save()
    
    #df.to_excel('test.xlsx', sheet_name='Test', index=False, columns=["Last Name, First Name","Courses","Days/Times", "Endorsements", "Previous Practica", "Do you have a car?", "Number of Passengers you can take"])
    