package com.horarios.SGH.Repository;

import com.horarios.SGH.Model.schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IScheduleRepository extends JpaRepository<schedule, Integer> {
    List<schedule> findByScheduleName(String scheduleName);
    boolean existsBySubjectId_Id(Integer subjectId);

    @Query("SELECT s FROM schedule s " +
           "LEFT JOIN FETCH s.teacherId t " +
           "LEFT JOIN FETCH s.subjectId sub " +
           "LEFT JOIN FETCH s.courseId c " +
           "WHERE s.courseId.id = :courseId")
    List<schedule> findByCourseId(@Param("courseId") Integer courseId);

    @Query("SELECT s FROM schedule s " +
           "LEFT JOIN FETCH s.teacherId t " +
           "LEFT JOIN FETCH s.subjectId sub " +
           "LEFT JOIN FETCH s.courseId c " +
           "WHERE s.teacherId.id = :teacherId")
    List<schedule> findByTeacherId(@Param("teacherId") Integer teacherId);

    @Query("DELETE FROM schedule s WHERE s.day = :day")
    void deleteByDay(@Param("day") String day);
}