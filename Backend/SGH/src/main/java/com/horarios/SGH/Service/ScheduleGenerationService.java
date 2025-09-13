package com.horarios.SGH.Service;

import com.horarios.SGH.DTO.ScheduleHistoryDTO;
import com.horarios.SGH.Exception.BusinessException;
import com.horarios.SGH.Model.schedule_history;
import com.horarios.SGH.Repository.IScheduleHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleGenerationService {

    private final IScheduleHistory historyRepository;

    @Transactional
    public ScheduleHistoryDTO generate(ScheduleHistoryDTO request, String executedBy) {
        validate(request);

        schedule_history history = new schedule_history();
        history.setExecutedBy(executedBy);
        history.setExecutedAt(LocalDateTime.now());
        history.setStatus("RUNNING");
        history.setMessage("Iniciando generación");
        history.setTotalGenerated(0);
        history.setPeriodStart(request.getPeriodStart());
        history.setPeriodEnd(request.getPeriodEnd());
        history.setDryRun(request.isDryRun());
        history.setForce(request.isForce());
        history.setParams(request.getParams());

        history = historyRepository.save(history);

        try {
            long days = ChronoUnit.DAYS.between(request.getPeriodStart(), request.getPeriodEnd()) + 1;
            if (days < 0) {
                throw new BusinessException("El rango de fechas es inválido");
            }

            int totalGenerated = 0;

            if (!request.isDryRun()) {
                // Lógica real de generación de horarios iría aquí
                // Por ahora solo contamos los días como ejemplo
                for (int i = 0; i < days; i++) {
                    // La variable 'day' se calcula pero no se usa en este ejemplo
                    // En una implementación real, aquí generarías los horarios para cada día
                    LocalDate currentDay = request.getPeriodStart().plusDays(i);
                    // generarHorariosParaDia(currentDay); // ← Esto iría en una implementación real
                    totalGenerated += 1; // Ejemplo: 1 slot por día
                }
            } else {
                // Modo simulación: solo contar los días
                totalGenerated = (int) days;
            }

            history.setStatus("SUCCESS");
            history.setTotalGenerated(totalGenerated);
            history.setMessage("Generación completada - " + totalGenerated + " horarios generados");
            history.setExecutedAt(LocalDateTime.now());
            historyRepository.save(history);
        } catch (Exception ex) {
            history.setStatus("FAILED");
            history.setMessage(ex.getMessage() != null ? ex.getMessage() : "Error en la generación");
            history.setExecutedAt(LocalDateTime.now());
            historyRepository.save(history);
            throw new BusinessException("Error durante la generación: " + ex.getMessage());
        }

        return toDTO(history);
    }

    @Transactional(readOnly = true)
    public Page<ScheduleHistoryDTO> history(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "executedAt"));
        var histories = historyRepository.findAllByOrderByExecutedAtDesc(pageable);
        List<ScheduleHistoryDTO> content = histories.map(this::toDTO).getContent();
        return new PageImpl<>(content, pageable, histories.getTotalElements());
    }

    private void validate(ScheduleHistoryDTO r) {
        if (r.getPeriodStart() == null || r.getPeriodEnd() == null) {
            throw new BusinessException("periodStart y periodEnd son obligatorios");
        }
        if (r.getPeriodEnd().isBefore(r.getPeriodStart())) {
            throw new BusinessException("periodEnd no puede ser anterior a periodStart");
        }
        long days = ChronoUnit.DAYS.between(r.getPeriodStart(), r.getPeriodEnd()) + 1;
        if (days > 366) {
            throw new BusinessException("El rango máximo permitido es 366 días");
        }
    }

    private ScheduleHistoryDTO toDTO(schedule_history h) {
        ScheduleHistoryDTO dto = new ScheduleHistoryDTO();
        dto.setId(h.getId());
        dto.setExecutedBy(h.getExecutedBy());
        dto.setExecutedAt(h.getExecutedAt());
        dto.setStatus(h.getStatus());
        dto.setTotalGenerated(h.getTotalGenerated());
        dto.setMessage(h.getMessage());
        dto.setPeriodStart(h.getPeriodStart());
        dto.setPeriodEnd(h.getPeriodEnd());
        dto.setDryRun(h.isDryRun());
        dto.setForce(h.isForce());
        dto.setParams(h.getParams());
        return dto;
    }
}