package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.ScheduleDTO;
import java.util.List;

public interface IScheduleService {
    List<ScheduleDTO> createSchedule(List<ScheduleDTO> assignments, String executedBy);
    List<ScheduleDTO> getByName(String scheduleName);
    List<ScheduleDTO> getByCourse(Integer courseId);
    List<ScheduleDTO> getByTeacher(Integer teacherId);
    List<ScheduleDTO> getAll();
    ScheduleDTO updateSchedule(Integer id, ScheduleDTO dto, String executedBy);
    void deleteSchedule(Integer id, String executedBy);
    void deleteByDay(String day);
}