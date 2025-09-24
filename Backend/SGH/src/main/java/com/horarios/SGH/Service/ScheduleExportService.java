package com.horarios.SGH.Service;

import com.horarios.SGH.Model.schedule;
import com.horarios.SGH.Repository.IScheduleRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import com.itextpdf.text.Font;

@Service
@RequiredArgsConstructor
public class ScheduleExportService implements IScheduleExportService {

    private final IScheduleRepository scheduleRepository;

    private List<String> generateTimes(List<schedule> schedules) {
        Set<String> timeSet = new TreeSet<>();
        for (schedule s : schedules) {
            timeSet.add(s.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")));
        }
        // Always include break times
        timeSet.add("09:00");
        timeSet.add("12:00");
        List<String> times = new java.util.ArrayList<>();
        for (String startTime : timeSet) {
            String[] parts = startTime.split(":");
            int hours = Integer.parseInt(parts[0]);
            int minutes = Integer.parseInt(parts[1]);
            int endHours = hours;
            int endMinutes = minutes;
            if (startTime.equals("09:00")) {
                // Descanso de 30 minutos
                endMinutes += 30;
            } else {
                // Clases de 1 hora
                endHours += 1;
            }
            String endTime = String.format("%02d:%02d", endHours, endMinutes);
            String periodStart = formatTime(startTime);
            String periodEnd = formatTime(endTime);
            times.add(periodStart + " - " + periodEnd);
        }
        return times;
    }

    private String formatTime(String time) {
        String[] parts = time.split(":");
        int hours = Integer.parseInt(parts[0]);
        int minutes = Integer.parseInt(parts[1]);
        String period = hours >= 12 ? "PM" : "AM";
        int displayHours = hours % 12;
        if (displayHours == 0) displayHours = 12;
        return String.format("%d:%02d %s", displayHours, minutes, period);
    }

    private schedule getScheduleForTimeAndDay(List<schedule> schedules, String time, String day) {
        String[] timeParts = time.split(" - ");
        String startTimeStr = timeParts[0];
        String[] hmp = startTimeStr.split("[: ]");
        int hours = Integer.parseInt(hmp[0]);
        if (hmp[2].equals("PM") && hours != 12) hours += 12;
        if (hmp[2].equals("AM") && hours == 12) hours = 0;
        String scheduleTime = String.format("%02d:%s", hours, hmp[1]);

        for (schedule s : schedules) {
            if (s.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")).equals(scheduleTime) && s.getDay().equals(day)) {
                return s;
            }
        }
        return null;
    }

    public byte[] exportToPdfByCourse(Integer courseId) throws Exception {
        List<schedule> horarios = scheduleRepository.findByCourseId(courseId);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, outputStream);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLACK);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE);
        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);

        document.add(new Paragraph("📘 Horario del Curso", titleFont));
        document.add(Chunk.NEWLINE);

        // Generar tiempos únicos
        List<String> times = generateTimes(horarios);
        String[] days = {"Lunes", "Martes", "Miércoles", "Jueves", "Viernes"};

        PdfPTable table = new PdfPTable(days.length + 1);
        table.setWidthPercentage(100);
        float[] columnWidths = new float[days.length + 1];
        columnWidths[0] = 1.5f; // Tiempo
        for (int i = 1; i < columnWidths.length; i++) {
            columnWidths[i] = 2f;
        }
        table.setWidths(columnWidths);

        BaseColor headerBg = new BaseColor(60, 120, 180);

        // Header: Tiempo + días
        PdfPCell timeHeader = new PdfPCell(new Phrase("Tiempo", headerFont));
        timeHeader.setBackgroundColor(headerBg);
        timeHeader.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(timeHeader);

        for (String day : days) {
            PdfPCell dayHeader = new PdfPCell(new Phrase(day, headerFont));
            dayHeader.setBackgroundColor(headerBg);
            dayHeader.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(dayHeader);
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        for (String time : times) {
            // Celda de tiempo
            PdfPCell timeCell = new PdfPCell(new Phrase(time, cellFont));
            timeCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(timeCell);

            for (String day : days) {
                schedule s = getScheduleForTimeAndDay(horarios, time, day);
                String content = "";
                if (time.contains("9:00 AM")) {
                    content = "Descanso";
                } else if (time.contains("12:00 PM")) {
                    content = "Almuerzo";
                } else if (s != null) {
                    String docente = s.getTeacherId() != null ? s.getTeacherId().getTeacherName() : "";
                    String materia = s.getSubjectId() != null ? s.getSubjectId().getSubjectName() : "";
                    content = docente + "/" + materia;
                }

                PdfPCell contentCell = new PdfPCell(new Phrase(content, cellFont));
                contentCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                if (time.contains("9:00 AM")) {
                    contentCell.setBackgroundColor(new BaseColor(255, 255, 204)); // Amarillo claro para descanso
                } else if (time.contains("12:00 PM")) {
                    contentCell.setBackgroundColor(new BaseColor(255, 255, 153)); // Amarillo claro para almuerzo
                }
                table.addCell(contentCell);
            }
        }

        document.add(table);
        document.close();
        return outputStream.toByteArray();
    }

    public byte[] exportToPdfByTeacher(Integer teacherId) throws Exception {
        List<schedule> horarios = scheduleRepository.findByTeacherId(teacherId);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, outputStream);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLACK);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE);
        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);

        document.add(new Paragraph("📘 Horario del Profesor", titleFont));
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{2f, 2f, 1.5f, 2f, 2f, 2f});

        BaseColor headerBg = new BaseColor(60, 120, 180);
        String[] headers = {"Curso", "Materia", "Día", "Inicio", "Fin", "Bloque"};

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(headerBg);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        for (schedule s : horarios) {
            String curso = s.getCourseId().getCourseName();
            String materia = "";
            if (s.getCourseId().getTeacherSubject() != null) {
                materia = s.getCourseId().getTeacherSubject().getSubject().getSubjectName();
            }

            table.addCell(new Phrase(curso, cellFont));
            table.addCell(new Phrase(materia, cellFont));
            table.addCell(new Phrase(s.getDay(), cellFont));
            table.addCell(new Phrase(s.getStartTime().format(timeFormatter), cellFont));
            table.addCell(new Phrase(s.getEndTime().format(timeFormatter), cellFont));
            table.addCell(new Phrase(s.getScheduleName(), cellFont));
        }

        document.add(table);
        document.close();
        return outputStream.toByteArray();
    }

    public byte[] exportToExcelByCourse(Integer courseId) throws Exception {
        List<schedule> horarios = scheduleRepository.findByCourseId(courseId);
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Horario Curso");

        CellStyle headerStyle = workbook.createCellStyle();
        org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        // Generar tiempos
        List<String> times = generateTimes(horarios);
        String[] days = {"Lunes", "Martes", "Miércoles", "Jueves", "Viernes"};

        // Header: Tiempo + días
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Tiempo");
        for (int i = 0; i < days.length; i++) {
            Cell cell = headerRow.createCell(i + 1);
            cell.setCellValue(days[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowIdx = 1;
        for (String time : times) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(time);

            for (int i = 0; i < days.length; i++) {
                String day = days[i];
                schedule s = getScheduleForTimeAndDay(horarios, time, day);
                String content = "";
                if (time.contains("9:00 AM")) {
                    content = "Descanso";
                } else if (time.contains("12:00 PM")) {
                    content = "Almuerzo";
                } else if (s != null) {
                    String docente = s.getTeacherId() != null ? s.getTeacherId().getTeacherName() : "";
                    String materia = s.getSubjectId() != null ? s.getSubjectId().getSubjectName() : "";
                    content = docente + "/" + materia;
                }
                row.createCell(i + 1).setCellValue(content);
            }
        }

        // Auto-ajustar columnas
        for (int i = 0; i <= days.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    public byte[] exportToExcelByTeacher(Integer teacherId) throws Exception {
        List<schedule> horarios = scheduleRepository.findByTeacherId(teacherId);
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Horario Profesor");

        CellStyle headerStyle = workbook.createCellStyle();
        org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        Row headerRow = sheet.createRow(0);
        String[] headers = {"Curso", "Materia", "Día", "Inicio", "Fin", "Bloque"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        int rowIdx = 1;
        for (schedule s : horarios) {
            Row row = sheet.createRow(rowIdx++);

            String curso = s.getCourseId().getCourseName();
            String materia = "";
            if (s.getCourseId().getTeacherSubject() != null) {
                materia = s.getCourseId().getTeacherSubject().getSubject().getSubjectName();
            }

            row.createCell(0).setCellValue(curso);
            row.createCell(1).setCellValue(materia);
            row.createCell(2).setCellValue(s.getDay());
            row.createCell(3).setCellValue(s.getStartTime().format(timeFormatter));
            row.createCell(4).setCellValue(s.getEndTime().format(timeFormatter));
            row.createCell(5).setCellValue(s.getScheduleName());
        }

        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    public byte[] exportToImageByCourse(Integer courseId) throws Exception {
        List<schedule> horarios = scheduleRepository.findByCourseId(courseId);

        // Generar tiempos
        List<String> times = generateTimes(horarios);
        String[] days = {"Lunes", "Martes", "Miércoles", "Jueves", "Viernes"};

        int width = 1400;
        int rowHeight = 25;
        int padding = 40;
        int height = padding + (times.size() + 2) * rowHeight;

        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        java.awt.Graphics2D g = image.createGraphics();

        g.setColor(java.awt.Color.WHITE);
        g.fillRect(0, 0, width, height);

        g.setColor(new java.awt.Color(30, 30, 30));
        g.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 18));
        g.drawString("📘 Horario del Curso", 20, padding);
        int y = padding + rowHeight;

        // Headers
        g.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 12));
        int[] xPositions = {20, 150, 350, 550, 650, 750, 850, 950};
        g.drawString("Tiempo", xPositions[0], y);
        for (int i = 0; i < days.length; i++) {
            g.drawString(days[i], xPositions[i + 1], y);
        }

        y += rowHeight;
        g.setFont(new java.awt.Font("Arial", java.awt.Font.PLAIN, 11));

        for (String time : times) {
            g.drawString(time, xPositions[0], y);

            for (int i = 0; i < days.length; i++) {
                String day = days[i];
                schedule s = getScheduleForTimeAndDay(horarios, time, day);
                String content = "";
                if (time.contains("9:00 AM")) {
                    content = "Descanso";
                } else if (time.contains("12:00 PM")) {
                    content = "Almuerzo";
                } else if (s != null) {
                    String docente = s.getTeacherId() != null ? s.getTeacherId().getTeacherName() : "";
                    String materia = s.getSubjectId() != null ? s.getSubjectId().getSubjectName() : "";
                    content = docente + "/" + materia;
                }
                g.drawString(content, xPositions[i + 1], y);
            }
            y += rowHeight;
        }

        g.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "png", outputStream);
        return outputStream.toByteArray();
    }

    public byte[] exportToImageByTeacher(Integer teacherId) throws Exception {
        List<schedule> horarios = scheduleRepository.findByTeacherId(teacherId);

        int width = 1200;
        int rowHeight = 30;
        int padding = 40;
        int height = padding + (horarios.size() + 2) * rowHeight;

        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        java.awt.Graphics2D g = image.createGraphics();

        g.setColor(java.awt.Color.WHITE);
        g.fillRect(0, 0, width, height);

        g.setColor(new java.awt.Color(30, 30, 30));
        g.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 18));
        g.drawString("📘 Horario del Profesor", 20, padding);
        int y = padding + rowHeight;

        g.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 14));
        String[] headers = {"Curso", "Materia", "Día", "Inicio", "Fin", "Bloque"};
        int[] xPositions = {20, 200, 400, 520, 620, 720};

        for (int i = 0; i < headers.length; i++) {
            g.drawString(headers[i], xPositions[i], y);
        }

        y += rowHeight;
        g.setFont(new java.awt.Font("Arial", java.awt.Font.PLAIN, 13));
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        for (schedule s : horarios) {
            String curso = s.getCourseId().getCourseName();
            String materia = "";
            if (s.getCourseId().getTeacherSubject() != null) {
                materia = s.getCourseId().getTeacherSubject().getSubject().getSubjectName();
            }

            g.drawString(curso, xPositions[0], y);
            g.drawString(materia, xPositions[1], y);
            g.drawString(s.getDay(), xPositions[2], y);
            g.drawString(s.getStartTime().format(timeFormatter), xPositions[3], y);
            g.drawString(s.getEndTime().format(timeFormatter), xPositions[4], y);
            g.drawString(s.getScheduleName(), xPositions[5], y);
            y += rowHeight;
        }

        g.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "png", outputStream);
        return outputStream.toByteArray();
    }

    public byte[] exportToPdfAllSchedules() throws Exception {
        List<schedule> allHorarios = scheduleRepository.findAll();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, outputStream);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE);
        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 9, BaseColor.BLACK);

        document.add(new Paragraph("📚 HORARIO GENERAL - TODOS LOS CURSOS", titleFont));
        document.add(new Paragraph("Sistema de Gestión de Horarios (SGH)", FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.GRAY)));
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.5f, 2f, 2f, 1f, 1.5f, 1.5f, 2.5f});

        BaseColor headerBg = new BaseColor(60, 120, 180);
        String[] headers = {"Curso", "Materia", "Docente", "Día", "Inicio", "Fin", "Bloque"};

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(headerBg);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // Ordenar por curso y día
        allHorarios.sort((s1, s2) -> {
            int courseCompare = s1.getCourseId().getCourseName().compareTo(s2.getCourseId().getCourseName());
            if (courseCompare != 0) return courseCompare;
            return s1.getDay().compareTo(s2.getDay());
        });

        String currentCourse = "";
        for (schedule s : allHorarios) {
            String curso = s.getCourseId().getCourseName();

            // Agregar separador visual entre cursos
            if (!currentCourse.equals(curso)) {
                if (!currentCourse.isEmpty()) {
                    // Línea separadora
                    PdfPCell separatorCell = new PdfPCell(new Phrase(" ", cellFont));
                    separatorCell.setColspan(7);
                    separatorCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    separatorCell.setFixedHeight(2);
                    table.addCell(separatorCell);
                }
                currentCourse = curso;
            }

            String materia = s.getSubjectId() != null
                    ? s.getSubjectId().getSubjectName()
                    : "";
            String docente = s.getTeacherId() != null
                    ? s.getTeacherId().getTeacherName()
                    : "";

            table.addCell(new PdfPCell(new Phrase(curso, cellFont)));
            table.addCell(new PdfPCell(new Phrase(materia, cellFont)));
            table.addCell(new PdfPCell(new Phrase(docente, cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getDay(), cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getStartTime().format(timeFormatter), cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getEndTime().format(timeFormatter), cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getScheduleName(), cellFont)));
        }

        document.add(table);

        // Agregar resumen
        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("📊 Resumen: " + allHorarios.size() + " horarios registrados",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK)));

        document.close();
        return outputStream.toByteArray();
    }

    public byte[] exportToPdfAllTeachersSchedules() throws Exception {
        List<schedule> allHorarios = scheduleRepository.findAll();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, outputStream);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE);
        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 9, BaseColor.BLACK);

        document.add(new Paragraph("👨‍🏫 HORARIO GENERAL - TODOS LOS PROFESORES", titleFont));
        document.add(new Paragraph("Sistema de Gestión de Horarios (SGH)", FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.GRAY)));
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{2f, 1.5f, 2f, 1f, 1.5f, 1.5f, 2.5f});

        BaseColor headerBg = new BaseColor(60, 120, 180);
        String[] headers = {"Profesor", "Materia", "Curso", "Día", "Inicio", "Fin", "Bloque"};

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(headerBg);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // Ordenar por profesor, materia y día
        allHorarios.sort((s1, s2) -> {
            String teacher1 = s1.getTeacherId() != null
                    ? s1.getTeacherId().getTeacherName() : "";
            String teacher2 = s2.getTeacherId() != null
                    ? s2.getTeacherId().getTeacherName() : "";

            int teacherCompare = teacher1.compareTo(teacher2);
            if (teacherCompare != 0) return teacherCompare;

            String subject1 = s1.getSubjectId() != null
                    ? s1.getSubjectId().getSubjectName() : "";
            String subject2 = s2.getSubjectId() != null
                    ? s2.getSubjectId().getSubjectName() : "";

            int subjectCompare = subject1.compareTo(subject2);
            if (subjectCompare != 0) return subjectCompare;

            return s1.getDay().compareTo(s2.getDay());
        });

        String currentTeacher = "";
        for (schedule s : allHorarios) {
            String docente = s.getTeacherId() != null
                    ? s.getTeacherId().getTeacherName()
                    : "";

            // Agregar separador visual entre profesores
            if (!currentTeacher.equals(docente)) {
                if (!currentTeacher.isEmpty()) {
                    // Línea separadora
                    PdfPCell separatorCell = new PdfPCell(new Phrase(" ", cellFont));
                    separatorCell.setColspan(7);
                    separatorCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    separatorCell.setFixedHeight(2);
                    table.addCell(separatorCell);
                }
                currentTeacher = docente;
            }

            String materia = s.getSubjectId() != null
                    ? s.getSubjectId().getSubjectName()
                    : "";
            String curso = s.getCourseId().getCourseName();

            table.addCell(new PdfPCell(new Phrase(docente, cellFont)));
            table.addCell(new PdfPCell(new Phrase(materia, cellFont)));
            table.addCell(new PdfPCell(new Phrase(curso, cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getDay(), cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getStartTime().format(timeFormatter), cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getEndTime().format(timeFormatter), cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getScheduleName(), cellFont)));
        }

        document.add(table);

        // Agregar resumen
        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("📊 Resumen: " + allHorarios.size() + " horarios registrados",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK)));

        document.close();
        return outputStream.toByteArray();
    }

    public byte[] exportToExcelAllSchedules() throws Exception {
        List<schedule> allHorarios = scheduleRepository.findAll();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Horario General Completo");

        CellStyle headerStyle = workbook.createCellStyle();
        org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        Row headerRow = sheet.createRow(0);
        String[] headers = {"Curso", "Materia", "Docente", "Día", "Inicio", "Fin", "Bloque"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // Ordenar por curso y día
        allHorarios.sort((s1, s2) -> {
            int courseCompare = s1.getCourseId().getCourseName().compareTo(s2.getCourseId().getCourseName());
            if (courseCompare != 0) return courseCompare;
            return s1.getDay().compareTo(s2.getDay());
        });

        int rowIdx = 1;
        String currentCourse = "";

        for (schedule s : allHorarios) {
            String curso = s.getCourseId().getCourseName();

            // Agregar fila separadora entre cursos
            if (!currentCourse.equals(curso) && !currentCourse.isEmpty()) {
                Row separatorRow = sheet.createRow(rowIdx++);
                Cell separatorCell = separatorRow.createCell(0);
                separatorCell.setCellValue("--- " + curso + " ---");
                separatorCell.setCellStyle(headerStyle);
                // Combinar celdas para la fila separadora
                sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(rowIdx-1, rowIdx-1, 0, headers.length-1));
            }

            if (!currentCourse.equals(curso)) {
                currentCourse = curso;
            }

            Row row = sheet.createRow(rowIdx++);

            String materia = s.getSubjectId() != null
                    ? s.getSubjectId().getSubjectName()
                    : "";
            String docente = s.getTeacherId() != null
                    ? s.getTeacherId().getTeacherName()
                    : "";

            row.createCell(0).setCellValue(curso);
            row.createCell(1).setCellValue(materia);
            row.createCell(2).setCellValue(docente);
            row.createCell(3).setCellValue(s.getDay());
            row.createCell(4).setCellValue(s.getStartTime().format(timeFormatter));
            row.createCell(5).setCellValue(s.getEndTime().format(timeFormatter));
            row.createCell(6).setCellValue(s.getScheduleName());
        }

        // Auto-ajustar columnas
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    public byte[] exportToExcelAllTeachersSchedules() throws Exception {
        List<schedule> allHorarios = scheduleRepository.findAll();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Horario Profesores Completo");

        CellStyle headerStyle = workbook.createCellStyle();
        org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        Row headerRow = sheet.createRow(0);
        String[] headers = {"Profesor", "Materia", "Curso", "Día", "Inicio", "Fin", "Bloque"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // Ordenar por profesor, materia y día
        allHorarios.sort((s1, s2) -> {
            String teacher1 = s1.getTeacherId() != null
                    ? s1.getTeacherId().getTeacherName() : "";
            String teacher2 = s2.getTeacherId() != null
                    ? s2.getTeacherId().getTeacherName() : "";

            int teacherCompare = teacher1.compareTo(teacher2);
            if (teacherCompare != 0) return teacherCompare;

            String subject1 = s1.getSubjectId() != null
                    ? s1.getSubjectId().getSubjectName() : "";
            String subject2 = s2.getSubjectId() != null
                    ? s2.getSubjectId().getSubjectName() : "";

            int subjectCompare = subject1.compareTo(subject2);
            if (subjectCompare != 0) return subjectCompare;

            return s1.getDay().compareTo(s2.getDay());
        });

        int rowIdx = 1;
        String currentTeacher = "";

        for (schedule s : allHorarios) {
            String docente = s.getTeacherId() != null
                    ? s.getTeacherId().getTeacherName()
                    : "";

            // Agregar fila separadora entre profesores
            if (!currentTeacher.equals(docente) && !currentTeacher.isEmpty()) {
                Row separatorRow = sheet.createRow(rowIdx++);
                Cell separatorCell = separatorRow.createCell(0);
                separatorCell.setCellValue("--- " + docente + " ---");
                separatorCell.setCellStyle(headerStyle);
                sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(rowIdx-1, rowIdx-1, 0, headers.length-1));
            }

            if (!currentTeacher.equals(docente)) {
                currentTeacher = docente;
            }

            Row row = sheet.createRow(rowIdx++);

            String materia = s.getSubjectId() != null
                    ? s.getSubjectId().getSubjectName()
                    : "";
            String curso = s.getCourseId().getCourseName();

            row.createCell(0).setCellValue(docente);
            row.createCell(1).setCellValue(materia);
            row.createCell(2).setCellValue(curso);
            row.createCell(3).setCellValue(s.getDay());
            row.createCell(4).setCellValue(s.getStartTime().format(timeFormatter));
            row.createCell(5).setCellValue(s.getEndTime().format(timeFormatter));
            row.createCell(6).setCellValue(s.getScheduleName());
        }

        // Auto-ajustar columnas
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    public byte[] exportToImageAllSchedules() throws Exception {
        List<schedule> allHorarios = scheduleRepository.findAll();

        // Calcular dimensiones basadas en el contenido
        int baseHeight = 60; // Altura base para títulos
        int rowHeight = 25;
        int separatorHeight = 15;
        int totalRows = allHorarios.size();

        // Contar separadores (uno por cada curso único)
        long uniqueCourses = allHorarios.stream()
            .map(s -> s.getCourseId().getCourseName())
            .distinct()
            .count();

        int totalHeight = baseHeight + (totalRows + (int)uniqueCourses) * rowHeight + separatorHeight;
        int width = 1400;

        BufferedImage image = new BufferedImage(width, totalHeight, BufferedImage.TYPE_INT_RGB);
        java.awt.Graphics2D g = image.createGraphics();

        g.setColor(java.awt.Color.WHITE);
        g.fillRect(0, 0, width, totalHeight);

        g.setColor(new java.awt.Color(30, 30, 30));
        g.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 20));
        g.drawString("📚 HORARIO GENERAL - TODOS LOS CURSOS", 20, 30);
        g.setFont(new java.awt.Font("Arial", java.awt.Font.PLAIN, 14));
        g.drawString("Sistema de Gestión de Horarios (SGH)", 20, 50);

        int y = baseHeight + 10;

        // Headers
        g.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 12));
        String[] headers = {"Curso", "Materia", "Docente", "Día", "Inicio", "Fin", "Bloque"};
        int[] xPositions = {20, 150, 350, 550, 650, 750, 850};

        for (int i = 0; i < headers.length; i++) {
            g.drawString(headers[i], xPositions[i], y);
        }

        y += rowHeight;
        g.setFont(new java.awt.Font("Arial", java.awt.Font.PLAIN, 11));
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // Ordenar por curso y día
        allHorarios.sort((s1, s2) -> {
            int courseCompare = s1.getCourseId().getCourseName().compareTo(s2.getCourseId().getCourseName());
            if (courseCompare != 0) return courseCompare;
            return s1.getDay().compareTo(s2.getDay());
        });

        String currentCourse = "";

        for (schedule s : allHorarios) {
            String curso = s.getCourseId().getCourseName();

            // Separador visual entre cursos
            if (!currentCourse.equals(curso) && !currentCourse.isEmpty()) {
                g.setColor(java.awt.Color.LIGHT_GRAY);
                g.fillRect(20, y - 5, width - 40, 2);
                g.setColor(java.awt.Color.BLACK);
                y += separatorHeight;
            }

            if (!currentCourse.equals(curso)) {
                currentCourse = curso;
            }

            String materia = s.getSubjectId() != null
                    ? s.getSubjectId().getSubjectName()
                    : "";
            String docente = s.getTeacherId() != null
                    ? s.getTeacherId().getTeacherName()
                    : "";

            g.drawString(curso, xPositions[0], y);
            g.drawString(materia, xPositions[1], y);
            g.drawString(docente, xPositions[2], y);
            g.drawString(s.getDay(), xPositions[3], y);
            g.drawString(s.getStartTime().format(timeFormatter), xPositions[4], y);
            g.drawString(s.getEndTime().format(timeFormatter), xPositions[5], y);
            g.drawString(s.getScheduleName(), xPositions[6], y);

            y += rowHeight;
        }

        g.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "png", outputStream);
        return outputStream.toByteArray();
    }

    public byte[] exportToImageAllTeachersSchedules() throws Exception {
        List<schedule> allHorarios = scheduleRepository.findAll();

        // Calcular dimensiones basadas en el contenido
        int baseHeight = 60;
        int rowHeight = 25;
        int separatorHeight = 15;
        int totalRows = allHorarios.size();

        // Contar separadores (uno por cada profesor único)
        long uniqueTeachers = allHorarios.stream()
            .filter(s -> s.getCourseId().getTeacherSubject() != null)
            .map(s -> s.getCourseId().getTeacherSubject().getTeacher().getTeacherName())
            .distinct()
            .count();

        int totalHeight = baseHeight + (totalRows + (int)uniqueTeachers) * rowHeight + separatorHeight;
        int width = 1400;

        BufferedImage image = new BufferedImage(width, totalHeight, BufferedImage.TYPE_INT_RGB);
        java.awt.Graphics2D g = image.createGraphics();

        g.setColor(java.awt.Color.WHITE);
        g.fillRect(0, 0, width, totalHeight);

        g.setColor(new java.awt.Color(30, 30, 30));
        g.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 20));
        g.drawString("👨‍🏫 HORARIO GENERAL - TODOS LOS PROFESORES", 20, 30);
        g.setFont(new java.awt.Font("Arial", java.awt.Font.PLAIN, 14));
        g.drawString("Sistema de Gestión de Horarios (SGH)", 20, 50);

        int y = baseHeight + 10;

        // Headers
        g.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 12));
        String[] headers = {"Profesor", "Materia", "Curso", "Día", "Inicio", "Fin", "Bloque"};
        int[] xPositions = {20, 200, 400, 550, 650, 750, 850};

        for (int i = 0; i < headers.length; i++) {
            g.drawString(headers[i], xPositions[i], y);
        }

        y += rowHeight;
        g.setFont(new java.awt.Font("Arial", java.awt.Font.PLAIN, 11));
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // Ordenar por profesor, materia y día
        allHorarios.sort((s1, s2) -> {
            String teacher1 = s1.getTeacherId() != null
                    ? s1.getTeacherId().getTeacherName() : "";
            String teacher2 = s2.getTeacherId() != null
                    ? s2.getTeacherId().getTeacherName() : "";

            int teacherCompare = teacher1.compareTo(teacher2);
            if (teacherCompare != 0) return teacherCompare;

            String subject1 = s1.getSubjectId() != null
                    ? s1.getSubjectId().getSubjectName() : "";
            String subject2 = s2.getSubjectId() != null
                    ? s2.getSubjectId().getSubjectName() : "";

            int subjectCompare = subject1.compareTo(subject2);
            if (subjectCompare != 0) return subjectCompare;

            return s1.getDay().compareTo(s2.getDay());
        });

        String currentTeacher = "";

        for (schedule s : allHorarios) {
            String docente = s.getTeacherId() != null
                    ? s.getTeacherId().getTeacherName()
                    : "";

            // Separador visual entre profesores
            if (!currentTeacher.equals(docente) && !currentTeacher.isEmpty()) {
                g.setColor(java.awt.Color.LIGHT_GRAY);
                g.fillRect(20, y - 5, width - 40, 2);
                g.setColor(java.awt.Color.BLACK);
                y += separatorHeight;
            }

            if (!currentTeacher.equals(docente)) {
                currentTeacher = docente;
            }

            String materia = s.getSubjectId() != null
                    ? s.getSubjectId().getSubjectName()
                    : "";
            String curso = s.getCourseId().getCourseName();

            g.drawString(docente, xPositions[0], y);
            g.drawString(materia, xPositions[1], y);
            g.drawString(curso, xPositions[2], y);
            g.drawString(s.getDay(), xPositions[3], y);
            g.drawString(s.getStartTime().format(timeFormatter), xPositions[4], y);
            g.drawString(s.getEndTime().format(timeFormatter), xPositions[5], y);
            g.drawString(s.getScheduleName(), xPositions[6], y);

            y += rowHeight;
        }

        g.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "png", outputStream);
        return outputStream.toByteArray();
    }
}