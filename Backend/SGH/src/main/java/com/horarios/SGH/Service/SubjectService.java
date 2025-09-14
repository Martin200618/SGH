package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.SubjectDTO;
import com.horarios.SGH.Model.subjects;
import com.horarios.SGH.Repository.Isubjects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final Isubjects repo;

    public SubjectDTO create(SubjectDTO dto) {
        subjects entity = new subjects();
        entity.setSubjectName(dto.getSubjectName());
        subjects saved = repo.save(entity);
        dto.setSubjectId(saved.getId());
        return dto;
    }

    public List<SubjectDTO> getAll() {
        return repo.findAll().stream().map(s -> {
            SubjectDTO dto = new SubjectDTO();
            dto.setSubjectId(s.getId());
            dto.setSubjectName(s.getSubjectName());
            return dto;
        }).collect(Collectors.toList());
    }

    public SubjectDTO getById(int id) {
        return repo.findById(id).map(s -> {
            SubjectDTO dto = new SubjectDTO();
            dto.setSubjectId(s.getId());
            dto.setSubjectName(s.getSubjectName());
            return dto;
        }).orElse(null);
    }

    public SubjectDTO update(int id, SubjectDTO dto) {
        subjects entity = repo.findById(id).orElse(null);
        if (entity == null) return null;
        entity.setSubjectName(dto.getSubjectName());
        subjects updated = repo.save(entity);
        dto.setSubjectId(updated.getId());
        return dto;
    }

    public void delete(int id) {
        repo.deleteById(id);
    }
}