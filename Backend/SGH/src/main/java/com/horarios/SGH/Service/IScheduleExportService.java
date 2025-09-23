package com.horarios.SGH.Service;

public interface IScheduleExportService {
    byte[] exportToPdfByCourse(Integer courseId) throws Exception;
    byte[] exportToPdfByTeacher(Integer teacherId) throws Exception;
    byte[] exportToExcelByCourse(Integer courseId) throws Exception;
    byte[] exportToExcelByTeacher(Integer teacherId) throws Exception;
    byte[] exportToImageByCourse(Integer courseId) throws Exception;
    byte[] exportToImageByTeacher(Integer teacherId) throws Exception;
    byte[] exportToPdfAllSchedules() throws Exception;
    byte[] exportToPdfAllTeachersSchedules() throws Exception;
    byte[] exportToExcelAllSchedules() throws Exception;
    byte[] exportToExcelAllTeachersSchedules() throws Exception;
    byte[] exportToImageAllSchedules() throws Exception;
    byte[] exportToImageAllTeachersSchedules() throws Exception;
}