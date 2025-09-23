package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.ScheduleHistoryDTO;
import org.springframework.data.domain.Page;

public interface IScheduleHistoryService {
    Page<ScheduleHistoryDTO> history(int page, int size);
}