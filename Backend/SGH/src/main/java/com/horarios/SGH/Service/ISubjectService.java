package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.SubjectDTO;
import java.util.List;

public interface ISubjectService {
    SubjectDTO create(SubjectDTO dto);
    List<SubjectDTO> getAll();
    SubjectDTO getById(int id);
    SubjectDTO update(int id, SubjectDTO dto);
    void delete(int id);
}