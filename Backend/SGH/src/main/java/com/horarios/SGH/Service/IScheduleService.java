package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.ScheduleDTO;
import java.util.List;

public interface IScheduleService {
    List<ScheduleDTO> createSchedule(List<ScheduleDTO> assignments, String executedBy);
    List<ScheduleDTO> getByName(String scheduleName);
    List<ScheduleDTO> getByCourse(Integer courseId);
    List<ScheduleDTO> getByTeacher(Integer teacherId);
    List<ScheduleDTO> getAll();
    void deleteByDay(String day);
}