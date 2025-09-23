package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.CourseDTO;
import java.util.List;

public interface ICourseService {
    CourseDTO create(CourseDTO dto);
    List<CourseDTO> getAll();
    CourseDTO getById(int id);
    CourseDTO update(int id, CourseDTO dto);
    void delete(int id);
}