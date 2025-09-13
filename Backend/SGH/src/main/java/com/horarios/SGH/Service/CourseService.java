package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.CourseDTO;
import com.horarios.SGH.Exception.ResourceNotFoundException;
import com.horarios.SGH.Model.TeacherSubject;
import com.horarios.SGH.Model.courses;
import com.horarios.SGH.Model.subjects;
import com.horarios.SGH.Model.teachers;
import com.horarios.SGH.Repository.Icourses;
import com.horarios.SGH.Repository.Iteachers;
import com.horarios.SGH.Repository.Isubjects;
import com.horarios.SGH.Repository.TeacherSubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final Icourses courseRepo;
    private final Iteachers teacherRepo;
    private final Isubjects subjectRepo;
    private final TeacherSubjectRepository teacherSubjectRepo;

    public CourseDTO create(CourseDTO dto) {
        courses entity = new courses();
        entity.setCourseName(dto.getCourseName());

        TeacherSubject ts = resolveTeacherSubject(dto);
        entity.setTeacherSubject(ts);

        if (dto.getGradeDirectorId() != null) {
            teachers director = teacherRepo.findById(dto.getGradeDirectorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Docente", dto.getGradeDirectorId()));
            entity.setGradeDirector(director);
        }

        courses saved = courseRepo.save(entity);
        return toDTO(saved);
    }

    public List<CourseDTO> getAll() {
        return courseRepo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getById(int id) {
        courses course = courseRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso", id));
        return toDTO(course);
    }

    public CourseDTO update(int id, CourseDTO dto) {
        courses entity = courseRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso", id));

        entity.setCourseName(dto.getCourseName());
        TeacherSubject ts = resolveTeacherSubject(dto);
        entity.setTeacherSubject(ts);

        if (dto.getGradeDirectorId() != null) {
            teachers director = teacherRepo.findById(dto.getGradeDirectorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Docente", dto.getGradeDirectorId()));
            entity.setGradeDirector(director);
        } else {
            entity.setGradeDirector(null);
        }

        courses updated = courseRepo.save(entity);
        return toDTO(updated);
    }

    public void delete(int id) {
        if (!courseRepo.existsById(id)) {
            throw new ResourceNotFoundException("Curso", id);
        }
        courseRepo.deleteById(id);
    }

    private TeacherSubject resolveTeacherSubject(CourseDTO dto) {
        if (dto.getTeacherSubjectId() != null) {
            return teacherSubjectRepo.findById(dto.getTeacherSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Relación docente-materia", dto.getTeacherSubjectId()));
        } else if (dto.getTeacherId() != null && dto.getSubjectId() != null) {
            return teacherSubjectRepo.findByTeacher_IdAndSubject_Id(dto.getTeacherId(), dto.getSubjectId())
                    .orElseGet(() -> {
                        teachers t = teacherRepo.findById(dto.getTeacherId())
                                .orElseThrow(() -> new ResourceNotFoundException("Docente", dto.getTeacherId()));
                        subjects s = subjectRepo.findById(dto.getSubjectId())
                                .orElseThrow(() -> new ResourceNotFoundException("Materia", dto.getSubjectId()));
                        TeacherSubject newTs = new TeacherSubject();
                        newTs.setTeacher(t);
                        newTs.setSubject(s);
                        return teacherSubjectRepo.save(newTs);
                    });
        }
        return null;
    }

    private CourseDTO toDTO(courses c) {
        CourseDTO dto = new CourseDTO();
        dto.setCourseId(c.getId());
        dto.setCourseName(c.getCourseName());
        if (c.getTeacherSubject() != null) {
            dto.setTeacherSubjectId(c.getTeacherSubject().getId());
            dto.setTeacherId(c.getTeacherSubject().getTeacher().getId());
            dto.setSubjectId(c.getTeacherSubject().getSubject().getId());
        }
        dto.setGradeDirectorId(c.getGradeDirector() != null ? c.getGradeDirector().getId() : null);
        return dto;
    }
}