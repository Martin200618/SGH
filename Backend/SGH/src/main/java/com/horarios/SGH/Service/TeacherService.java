package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.TeacherDTO;
import com.horarios.SGH.Exception.ResourceNotFoundException;
import com.horarios.SGH.Model.TeacherSubject;
import com.horarios.SGH.Model.subjects;
import com.horarios.SGH.Model.teachers;
import com.horarios.SGH.Repository.Isubjects;
import com.horarios.SGH.Repository.Iteachers;
import com.horarios.SGH.Repository.TeacherSubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final Isubjects subjectRepo;
    private final Iteachers teacherRepo;
    private final TeacherSubjectRepository teacherSubjectRepo;

    public TeacherDTO create(TeacherDTO dto) {
        teachers teacher = new teachers();
        teacher.setTeacherName(dto.getTeacherName());
        teachers savedTeacher = teacherRepo.save(teacher);

        if (dto.getSubjectId() > 0) {
            subjects subject = subjectRepo.findById(dto.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Materia", dto.getSubjectId()));
            
            TeacherSubject ts = new TeacherSubject();
            ts.setTeacher(savedTeacher);
            ts.setSubject(subject);
            teacherSubjectRepo.save(ts);
        }

        dto.setTeacherId(savedTeacher.getId());
        return dto;
    }

    public List<TeacherDTO> getAll() {
        return teacherRepo.findAll().stream().map(t -> {
            TeacherDTO dto = new TeacherDTO();
            dto.setTeacherId(t.getId());
            dto.setTeacherName(t.getTeacherName());

            List<TeacherSubject> tsList = teacherSubjectRepo.findByTeacher_Id(t.getId());
            if (!tsList.isEmpty()) {
                dto.setSubjectId(tsList.get(0).getSubject().getId());
            } else {
                dto.setSubjectId(0);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public TeacherDTO getById(int id) {
        teachers teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Docente", id));
        
        TeacherDTO dto = new TeacherDTO();
        dto.setTeacherId(teacher.getId());
        dto.setTeacherName(teacher.getTeacherName());

        List<TeacherSubject> tsList = teacherSubjectRepo.findByTeacher_Id(teacher.getId());
        if (!tsList.isEmpty()) {
            dto.setSubjectId(tsList.get(0).getSubject().getId());
        } else {
            dto.setSubjectId(0);
        }
        return dto;
    }

    public TeacherDTO update(int id, TeacherDTO dto) {
        teachers teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Docente", id));

        teacher.setTeacherName(dto.getTeacherName());
        teachers updatedTeacher = teacherRepo.save(teacher);

        if (dto.getSubjectId() > 0) {
            subjects subject = subjectRepo.findById(dto.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Materia", dto.getSubjectId()));
            
            List<TeacherSubject> tsList = teacherSubjectRepo.findByTeacher_Id(id);
            if (tsList.isEmpty()) {
                TeacherSubject ts = new TeacherSubject();
                ts.setTeacher(updatedTeacher);
                ts.setSubject(subject);
                teacherSubjectRepo.save(ts);
            } else {
                TeacherSubject ts = tsList.get(0);
                ts.setSubject(subject);
                teacherSubjectRepo.save(ts);
            }
        } else {
            List<TeacherSubject> tsList = teacherSubjectRepo.findByTeacher_Id(id);
            teacherSubjectRepo.deleteAll(tsList);
        }

        dto.setTeacherId(updatedTeacher.getId());
        return dto;
    }

    public void delete(int id) {
        if (!teacherRepo.existsById(id)) {
            throw new ResourceNotFoundException("Docente", id);
        }
        
        List<TeacherSubject> tsList = teacherSubjectRepo.findByTeacher_Id(id);
        teacherSubjectRepo.deleteAll(tsList);
        teacherRepo.deleteById(id);
    }

    public List<TeacherDTO> getTeachersBySubjectName(String subjectName) {
        subjects subject = subjectRepo.findBySubjectName(subjectName);
        if (subject == null) {
            throw new ResourceNotFoundException("Materia", subjectName);
        }

        return teacherSubjectRepo.findBySubject_Id(subject.getId())
                .stream()
                .map(ts -> {
                    TeacherDTO dto = new TeacherDTO();
                    dto.setTeacherId(ts.getTeacher().getId());
                    dto.setTeacherName(ts.getTeacher().getTeacherName());
                    dto.setSubjectId(ts.getSubject().getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}