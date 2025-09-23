package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.ScheduleHistoryDTO;
import org.springframework.data.domain.Page;

public interface IScheduleGenerationService {
    ScheduleHistoryDTO generate(ScheduleHistoryDTO request, String executedBy);
}