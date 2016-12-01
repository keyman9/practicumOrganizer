from db import *
import pandas as pd
import os
import xlsxwriter
# import practica as prac

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
    
 
    lastNameCol = []
    firstNameCol = []
    assignedSchoolCol = []
    hostTeacherCol = []
    practicumCourseCol = []
    practicumDayTimeCol = []
    courseCol = []
    sortedlist = sorted(results , key=lambda elem: "%s, %s" % (elem['stulastname'], elem['stufirstname']))
    
    for match in sortedlist:
        
        studentMatch = any(row[1] == match['email'] and row[0] == limit for row in studentCourses)
        if not studentMatch and limit != 'none':
            print("Student doesn't have the match")
            continue
        
        lastNameCol.append(match['stulastname'])
        firstNameCol.append(match['stufirstname'])
        practicumCourseCol.append(match['course'])
        assignedSchoolCol.append(match['schoolname'])
        
        teacherName = '{}, {}'.format(match['teacherlastname'], match['teacherfirstname'])
        hostTeacherCol.append(teacherName)
        
        availStr = format_availability_string(match)
        dayTime = '{}: {} - {}'.format(availStr, match['starttime'], match['endtime'])
        practicumDayTimeCol.append(dayTime)
        
        
        if limit != 'none':
            courseCol.append(limit)
            
    # print(lastNameCol)
    # print(firstNameCol)
    # print(assignedSchoolCol)
    # print(practicumDayTimeCol)
    # print(practicumCourseCol)
    # print(courseCol)
    
    if courseCol:
        df = pd.DataFrame({'Course': courseCol, 'Last Name': lastNameCol, 'First Name': firstNameCol, 'Assigned School': assignedSchoolCol,
            'Host Teacher': hostTeacherCol, 'Practicum Course': practicumCourseCol, 'Practicum Day/Time': practicumDayTimeCol})
            
        colsForSheet = ["Course", "Last Name", "First Name", "Assigned School", "Host Teacher", "Practicum Course", "Practicum Day/Time"]
    else:
        df = pd.DataFrame({'Last Name': lastNameCol, 'First Name': firstNameCol, 'Assigned School': assignedSchoolCol,
            'Host Teacher': hostTeacherCol, 'Practicum Course': practicumCourseCol, 'Practicum Day/Time': practicumDayTimeCol})
            
        colsForSheet = ["Last Name", "First Name", "Assigned School", "Host Teacher", "Practicum Course", "Practicum Day/Time"]
        
    directory = os.path.dirname(__file__)
    writer = pd.ExcelWriter(os.path.join(directory, 'static', 'reports', 'coursereport.xlsx'), engine='xlsxwriter')
    
    pd.formats.format.header_style = None
    
    df.to_excel(writer, sheet_name='Sheet1', index=False, columns=colsForSheet)
    workbook  = writer.book
    worksheet = writer.sheets['Sheet1']
    
    formatCourseCol = {'text_wrap': True, 'valign': 'vcenter', 'align': 'center', 'italic': True}
    formatDefaultCol = {'text_wrap': True, 'valign': 'vcenter', 'align': 'center'}
    formatHeaderRow = {'bold': True, 'underline': True, 'align': 'center', 'border': 2}
    
    wrapHeaderRow = workbook.add_format(formatHeaderRow)
    wrapCourseCol = workbook.add_format(formatCourseCol)
    wrapDefaultCol = workbook.add_format(formatDefaultCol)
    
    if courseCol:
        worksheet.set_column('A:A', 10, wrapCourseCol)
        worksheet.set_column('B:B', 15, wrapDefaultCol)
        worksheet.set_column('C:C', 15, wrapDefaultCol)
        worksheet.set_column('D:D', 35, wrapDefaultCol)
        worksheet.set_column('E:E', 30, wrapDefaultCol)
        worksheet.set_column('F:F', 15, wrapDefaultCol)
        worksheet.set_column('G:G', 20, wrapDefaultCol)
    else:
        worksheet.set_column('A:A', 15, wrapDefaultCol)
        worksheet.set_column('B:B', 15, wrapDefaultCol)
        worksheet.set_column('C:C', 35, wrapDefaultCol)
        worksheet.set_column('D:D', 30, wrapDefaultCol)
        worksheet.set_column('E:E', 15, wrapDefaultCol)
        worksheet.set_column('F:F', 30, wrapDefaultCol)
        
    worksheet.set_row(0, None, wrapHeaderRow)
    writer.save()
    
    
def create_school_report(limit):
    
    selectSchoolID = "SELECT schoolid FROM schools where schoolname = %s"
    schoolID = select_query_db(selectSchoolID, (limit, ), True)[0]
    
    practicaCols = "s.email as email, s.firstname as stuFirstname, s.lastname as stuLastname, \
                    sch.schoolname, sch.schoolid as schid, \
                    t.firstname as teacherFirstname, t.lastname as teacherLastname, t.teacherId, p.startTime as starttime, t.schoolid, \
                    p.endTime as endtime, p.course as course, \
                    m.monday, m.tuesday, m.wednesday, m.thursday, m.friday"
                    
    selectPractica = "SELECT " + practicaCols +  " FROM practicumArrangement AS p \
                        JOIN students AS s ON s.email = p.studentEmail \
                        JOIN teachers as t USING (teacherId) \
                        JOIN meetingDays as m USING (meetingid) \
                        JOIN schools as sch USING (schoolid)"
    

    results = select_query_db(selectPractica)
    sortedlist = sorted(results , key=lambda elem: "%s, %s" % (elem['stulastname'], elem['stufirstname']))
    
    # Create the file and add a worksheet
    directory = os.path.dirname(__file__)
    workbook  = xlsxwriter.Workbook(os.path.join(directory, 'static', 'reports', 'schoolreport.xlsx'))
    worksheet = workbook.add_worksheet()
    
    # Cell Format dictionaries
    formatDefaultCol = {'text_wrap': True, 'valign': 'vcenter', 'align': 'center'}
    formatHeaderRow = {'bold': True, 'underline': True, 'align': 'center', 'border': 2}
    formatSchoolCol = {'text_wrap': True, 'valign': 'vcenter', 'align': 'center', 'bg_color': '#92D050'}
    
    # Create formats for the cells
    wrapHeaderRow = workbook.add_format(formatHeaderRow)
    wrapSchoolCol = workbook.add_format(formatSchoolCol)
    wrapDefaultCol = workbook.add_format(formatDefaultCol)
    
    # Set Worksheet Column Width
    worksheet.set_column('A:A', 25)
    worksheet.set_column('B:B', 35)
    worksheet.set_column('C:C', 25)
    worksheet.set_column('D:D', 30)
    
    # Set up the Header information
    worksheet.write('A1', 'Last Name, First Name (Student)', wrapHeaderRow)
    worksheet.write('B1', 'Placement School', wrapHeaderRow)
    worksheet.write('C1', 'Teacher', wrapHeaderRow)
    worksheet.write('D1', 'Days and Time Assigned', wrapHeaderRow)
    
    # Start at the Second row to not overwrite Header info
    row = 1
    col = 0
    
    for match in sortedlist:
        
        studentMatch = match['schid'] == schoolID
        if not studentMatch and limit != 'none': # Skip if the student isn't assigned to the school chosen
            continue
        
        studentName = '{}, {}'.format(match['stulastname'], match['stufirstname'])
        worksheet.write(row, col, studentName, wrapDefaultCol) # Write Student's Name
        
        worksheet.write(row, col+1, match['schoolname'], wrapSchoolCol) # Write the Placement School
        
        teacherName = '{}, {}'.format(match['teacherlastname'], match['teacherfirstname'])
        
        worksheet.write(row, col+2, teacherName, wrapDefaultCol) # Write the Teacher's Name
        
        availStr = format_availability_string(match)
        dayTime = '{}: {} - {}'.format(availStr, match['starttime'], match['endtime'])
        
        worksheet.write(row, col+3, dayTime, wrapDefaultCol) # Write the Practicum Day and Time
        
        row += 1
 
    workbook.close()
    
def create_schoolDivision_report(limit):
    
    selectSchoolDivisions = "SELECT schools.schoolName FROM schoolDivisions JOIN schools ON schoolDivisions.divisionId = schools.divisionId\
        WHERE schoolDivisions.divisionName = %s"
        
    schoolsInDivision = select_query_db(selectSchoolDivisions, (limit, ))
    
    elemSchools = []
    middleSchools = []
    highSchools = []
    otherSchools = []
    
    for school in schoolsInDivision:
        elemSchoolCheck = 'Elementary School' in school['schoolname'] and not 'High' in school['schoolname'] and not 'Middle' in school['schoolname']
        middleSchoolCheck = 'Middle School' in school['schoolname'] and not 'High' in school['schoolname'] and not 'Elementary' in school['schoolname']
        highSchoolCheck = 'High School' in school['schoolname'] and not 'Middle' in school['schoolname'] and not 'Elementary' in school['schoolname']
        
        if elemSchoolCheck:
            elemSchools.append(school['schoolname'])
        elif middleSchoolCheck:
            middleSchools.append(school['schoolname'])
        elif highSchoolCheck:
            highSchools.append(school['schoolname'])
        else:
            otherSchools.append(school['schoolname'])
    
    # Create the file and add a worksheet
    directory = os.path.dirname(__file__)
    workbook  = xlsxwriter.Workbook(os.path.join(directory, 'static', 'reports', 'divisionreport.xlsx'))
    worksheet = workbook.add_worksheet()
    
        
    # Cell Format dictionaries
    formatDefaultCol = {'text_wrap': True, 'valign': 'vcenter', 'align': 'center'}
    formatHeaderRow = {'bold': True, 'underline': True, 'align': 'center', 'border': 2}
    formatSchoolCol = {'text_wrap': True, 'valign': 'vcenter', 'align': 'center', 'bg_color': '#92D050'}
    formatSchoolInfo = {'text_wrap': True, 'valign': 'vcenter', 'align': 'center', 'bg_color': '#FFFF00', 'bold': True, 'underline': True,}
    
    # Create formats for the cells
    wrapHeaderRow = workbook.add_format(formatHeaderRow)
    wrapSchoolCol = workbook.add_format(formatSchoolCol)
    wrapDefaultCol = workbook.add_format(formatDefaultCol)
    wrapSchooInfo = workbook.add_format(formatSchoolInfo)
    
    # Set Worksheet Column Width
    worksheet.set_column('A:A', 30)
    worksheet.set_column('B:B', 35)
    worksheet.set_column('C:C', 25)
    worksheet.set_column('D:D', 35)
    
    # Set up the Header information
    worksheet.write('A1', 'Last Name, First Name (Student)', wrapHeaderRow)
    worksheet.write('B1', 'Placement School', wrapHeaderRow)
    worksheet.write('C1', 'Teacher', wrapHeaderRow)
    worksheet.write('D1', 'Days and Time Assigned', wrapHeaderRow)
    
    # Start at the Second row to not overwrite Header info
    row = 1
    col = 0
    
    
    elemSchools.sort()
    middleSchools.sort()
    highSchools.sort()
    otherSchools.sort()
    
    emptyData = (" ", " ", " ", " ")
    
    formats = {'schoolCol': wrapSchoolCol, 'defaultCol': wrapDefaultCol}
    
    worksheet.write(row, col, 'Elementary Schools:', wrapSchooInfo)
    row += 1
    row = write_to_workbook_by_school(elemSchools, worksheet, row, col, formats)
   
    worksheet.write(row, col, 'Middle Schools:', wrapSchooInfo)
    row += 1
    row = write_to_workbook_by_school(middleSchools, worksheet, row, col, formats)
    
    worksheet.write(row, col, 'High Schools:', wrapSchooInfo)
    row += 1
    row = write_to_workbook_by_school(highSchools, worksheet, row, col, formats)
    
    worksheet.write(row, col, 'Other Schools:', wrapSchooInfo)
    row += 1
    row = write_to_workbook_by_school(otherSchools, worksheet, row, col, formats)
        
    workbook.close()
    
def write_to_workbook_by_school(schools, worksheet, row, col, formats):
    selectSchoolID = "SELECT schoolid FROM schools where schoolname = %s"
    
    for school in schools:
        schoolID = select_query_db(selectSchoolID, (school, ), True)[0]
        results = load_.tica_matches_for_reports(school)
        sortedlist = sorted(results, key=lambda elem: "%s, %s" % (elem['stulastname'], elem['stufirstname']))
        
        for match in sortedlist:
            studentMatch = match['schid'] == schoolID
            if not studentMatch: # Skip if the student isn't assigned to the school chosen
                continue
            
            studentName = '{}, {}'.format(match['stulastname'], match['stufirstname'])
            worksheet.write(row, col, studentName, formats['defaultCol']) # Write Student's Name
            
            worksheet.write(row, col+1, match['schoolname'], formats['schoolCol']) # Write the Placement School
            
            teacherName = '{}, {}'.format(match['teacherlastname'], match['teacherfirstname'])
            worksheet.write(row, col+2, teacherName, formats['defaultCol']) # Write the Teacher's Name
            
            availStr = format_availability_string(match)
            dayTime = '{}: {} - {}'.format(availStr, match['starttime'], match['endtime'])
            worksheet.write(row, col+3, dayTime, formats['defaultCol']) # Write the Practicum Day and Time
            
            row += 1
        worksheet.write_blank(row, col, None)
        row += 1
    worksheet.write_blank(row, col, None)
    return row + 1