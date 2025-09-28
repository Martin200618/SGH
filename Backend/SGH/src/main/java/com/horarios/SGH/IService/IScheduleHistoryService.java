package com.horarios.SGH.IService;

import com.horarios.SGH.DTO.ScheduleHistoryDTO;
import org.springframework.data.domain.Page;

public interface IScheduleHistoryService {
    Page<ScheduleHistoryDTO> history(int page, int size);
}