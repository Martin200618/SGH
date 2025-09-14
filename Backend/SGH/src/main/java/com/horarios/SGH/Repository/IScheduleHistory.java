package com.horarios.SGH.Repository;

import com.horarios.SGH.Model.schedule_history;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IScheduleHistory extends JpaRepository<schedule_history, Integer> {
    Page<schedule_history> findAllByOrderByExecutedAtDesc(Pageable pageable);
}