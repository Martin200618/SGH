package com.horarios.SGH.Repository;

import com.horarios.SGH.Model.schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IScheduleRepository extends JpaRepository<schedule, Integer> {
    List<schedule> findByScheduleName(String scheduleName);

    @Query("SELECT s FROM schedule s WHERE s.courseId.id = :courseId")
    List<schedule> findByCourseId(@Param("courseId") Integer courseId);

    @Query("SELECT s FROM schedule s " +
           "JOIN s.courseId c " +
           "JOIN c.teacherSubject ts " +
           "JOIN ts.teacher t " +
           "WHERE t.id = :teacherId")
    List<schedule> findByTeacherId(@Param("teacherId") Integer teacherId);
}