package com.horarios.SGH.DTO;

public class TeacherDTO {
    private int teacherId;
    private String teacherName;
    private int subjectId;

    public TeacherDTO() {
    }

    public TeacherDTO(int teacherId, String teacherName, int subjectId) {
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.subjectId = subjectId;
    }

    public int getSubjectId() { 
        return subjectId; 
    }
    
    public void setSubjectId(int subjectId) { 
        this.subjectId = subjectId; 
    }

    public int getTeacherId() { 
        return teacherId; 
    }
    
    public void setTeacherId(int teacherId) { 
        this.teacherId = teacherId; 
    }

    public String getTeacherName() { 
        return teacherName; 
    }

    public void setTeacherName(String teacherName) { 
        this.teacherName = teacherName; 
    }
}