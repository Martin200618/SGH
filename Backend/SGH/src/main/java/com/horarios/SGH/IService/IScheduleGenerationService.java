package com.horarios.SGH.IService;

import com.horarios.SGH.DTO.ScheduleHistoryDTO;
import org.springframework.data.domain.Page;

public interface IScheduleGenerationService {
    ScheduleHistoryDTO generate(ScheduleHistoryDTO request, String executedBy);
}