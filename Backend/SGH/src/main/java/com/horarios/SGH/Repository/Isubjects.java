package com.horarios.SGH.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.horarios.SGH.Model.subjects;

public interface Isubjects extends JpaRepository<subjects, Integer> {
    Optional<subjects> findById(int id);
    subjects findBySubjectName(String subjectName);
}