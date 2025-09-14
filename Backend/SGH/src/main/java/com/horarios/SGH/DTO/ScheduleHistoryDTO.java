package com.horarios.SGH.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ScheduleHistoryDTO {

    // Respuesta
    private Integer id;
    private String executedBy;
    private LocalDateTime executedAt;
    private String status;         // RUNNING | SUCCESS | FAILED
    private int totalGenerated;
    private String message;

    // Petición
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private boolean dryRun;
    private boolean force;
    private String params;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getExecutedBy() { return executedBy; }
    public void setExecutedBy(String executedBy) { this.executedBy = executedBy; }

    public LocalDateTime getExecutedAt() { return executedAt; }
    public void setExecutedAt(LocalDateTime executedAt) { this.executedAt = executedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTotalGenerated() { return totalGenerated; }
    public void setTotalGenerated(int totalGenerated) { this.totalGenerated = totalGenerated; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDate getPeriodStart() { return periodStart; }
    public void setPeriodStart(LocalDate periodStart) { this.periodStart = periodStart; }

    public LocalDate getPeriodEnd() { return periodEnd; }
    public void setPeriodEnd(LocalDate periodEnd) { this.periodEnd = periodEnd; }

    public boolean isDryRun() { return dryRun; }
    public void setDryRun(boolean dryRun) { this.dryRun = dryRun; }

    public boolean isForce() { return force; }
    public void setForce(boolean force) { this.force = force; }

    public String getParams() { return params; }
    public void setParams(String params) { this.params = params; }
}