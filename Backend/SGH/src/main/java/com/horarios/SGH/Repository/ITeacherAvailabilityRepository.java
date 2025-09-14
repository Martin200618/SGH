package com.horarios.SGH.Repository;

import com.horarios.SGH.Model.Days;
import com.horarios.SGH.Model.TeacherAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ITeacherAvailabilityRepository extends JpaRepository<TeacherAvailability, Long> {
    List<TeacherAvailability> findByTeacher_IdAndDay(Integer teacherId, Days day);
    List<TeacherAvailability> findByTeacher_Id(Integer teacherId);
}