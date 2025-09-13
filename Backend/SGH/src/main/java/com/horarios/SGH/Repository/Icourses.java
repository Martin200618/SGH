package com.horarios.SGH.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.horarios.SGH.Model.courses;

public interface Icourses extends JpaRepository<courses, Integer> {
}