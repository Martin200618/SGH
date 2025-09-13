package com.horarios.SGH.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.horarios.SGH.Model.subjects;

public interface Isubjects extends JpaRepository<subjects, Integer> {
    subjects findBySubjectName(String subjectName);
}