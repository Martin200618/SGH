package com.horarios.SGH.IService;

import com.horarios.SGH.DTO.TeacherDTO;
import java.util.List;

public interface ITeacherService {
    TeacherDTO create(TeacherDTO dto);
    List<TeacherDTO> getAll();
    TeacherDTO getById(int id);
    TeacherDTO update(int id, TeacherDTO dto);
    void delete(int id);
    List<TeacherDTO> getTeachersBySubjectName(String subjectName);
    TeacherDTO createWithSpecializations(TeacherDTO dto);
}