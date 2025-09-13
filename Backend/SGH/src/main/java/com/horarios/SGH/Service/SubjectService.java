package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.SubjectDTO;
import com.horarios.SGH.Exception.ConflictException;
import com.horarios.SGH.Exception.ResourceNotFoundException;
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
        // Validar si la materia ya existe
        subjects existing = repo.findBySubjectName(dto.getSubjectName());
        if (existing != null) {
            throw new ConflictException("La materia '" + dto.getSubjectName() + "' ya existe");
        }

        subjects entity = new subjects();
        entity.setSubjectName(dto.getSubjectName());
        subjects saved = repo.save(entity);
        
        SubjectDTO response = new SubjectDTO();
        response.setSubjectId(saved.getId());
        response.setSubjectName(saved.getSubjectName());
        return response;
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
        subjects subject = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia", id));
        
        SubjectDTO dto = new SubjectDTO();
        dto.setSubjectId(subject.getId());
        dto.setSubjectName(subject.getSubjectName());
        return dto;
    }

    public SubjectDTO update(int id, SubjectDTO dto) {
        subjects entity = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia", id));
        
        // Validar si el nuevo nombre ya existe (excluyendo el actual)
        subjects existingWithName = repo.findBySubjectName(dto.getSubjectName());
        if (existingWithName != null && existingWithName.getId() != id) {
            throw new ConflictException("La materia '" + dto.getSubjectName() + "' ya existe");
        }

        entity.setSubjectName(dto.getSubjectName());
        subjects updated = repo.save(entity);
        
        dto.setSubjectId(updated.getId());
        return dto;
    }

    public void delete(int id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Materia", id);
        }
        repo.deleteById(id);
    }
}