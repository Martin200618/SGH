package com.horarios.SGH.Repository;

import com.horarios.SGH.Model.TeacherSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeacherSubjectRepository extends JpaRepository<TeacherSubject, Integer> {
    List<TeacherSubject> findBySubject_Id(Integer subjectId);
    List<TeacherSubject> findByTeacher_Id(Integer teacherId);
    Optional<TeacherSubject> findByTeacher_IdAndSubject_Id(Integer teacherId, Integer subjectId);
    boolean existsByTeacher_IdAndSubject_Id(Integer teacherId, Integer subjectId);
}