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
import com.itextpdf.text.Font;

@Service
@RequiredArgsConstructor
public class ScheduleExportService {

    private final IScheduleRepository scheduleRepository;

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

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1f, 2f, 2f, 1.5f, 2f, 2f});

        BaseColor headerBg = new BaseColor(60, 120, 180);
        String[] headers = {"Materia", "Docente", "Día", "Inicio", "Fin", "Bloque"};

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(headerBg);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        for (schedule s : horarios) {
            // Nota: Los exports usan la información del TeacherSubject del curso
            // Para mostrar profesores/materias específicas, personaliza el scheduleName
            String materia = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getSubject().getSubjectName()
                    : "";
            String docente = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getTeacher().getTeacherName()
                    : "";

            table.addCell(new PdfPCell(new Phrase(materia, cellFont)));
            table.addCell(new PdfPCell(new Phrase(docente, cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getDay(), cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getStartTime().format(timeFormatter), cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getEndTime().format(timeFormatter), cellFont)));
            table.addCell(new PdfPCell(new Phrase(s.getScheduleName(), cellFont)));
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

        Row headerRow = sheet.createRow(0);
        String[] headers = {"Materia", "Docente", "Día", "Inicio", "Fin", "Bloque"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        int rowIdx = 1;
        for (schedule s : horarios) {
            Row row = sheet.createRow(rowIdx++);

            String materia = "";
            String docente = "";
            if (s.getCourseId().getTeacherSubject() != null) {
                materia = s.getCourseId().getTeacherSubject().getSubject().getSubjectName();
                docente = s.getCourseId().getTeacherSubject().getTeacher().getTeacherName();
            }

            row.createCell(0).setCellValue(materia);
            row.createCell(1).setCellValue(docente);
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
        g.drawString("📘 Horario del Curso", 20, padding);
        int y = padding + rowHeight;

        g.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 14));
        String[] headers = {"Materia", "Docente", "Día", "Inicio", "Fin", "Bloque"};
        int[] xPositions = {20, 240, 420, 520, 620, 720};

        for (int i = 0; i < headers.length; i++) {
            g.drawString(headers[i], xPositions[i], y);
        }

        y += rowHeight;
        g.setFont(new java.awt.Font("Arial", java.awt.Font.PLAIN, 13));
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        for (schedule s : horarios) {
            String materia = "";
            String docente = "";
            if (s.getCourseId().getTeacherSubject() != null) {
                materia = s.getCourseId().getTeacherSubject().getSubject().getSubjectName();
                docente = s.getCourseId().getTeacherSubject().getTeacher().getTeacherName();
            }

            g.drawString(materia, xPositions[0], y);
            g.drawString(docente, xPositions[1], y);
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

            String materia = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getSubject().getSubjectName()
                    : "";
            String docente = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getTeacher().getTeacherName()
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
            String teacher1 = s1.getCourseId().getTeacherSubject() != null
                    ? s1.getCourseId().getTeacherSubject().getTeacher().getTeacherName() : "";
            String teacher2 = s2.getCourseId().getTeacherSubject() != null
                    ? s2.getCourseId().getTeacherSubject().getTeacher().getTeacherName() : "";

            int teacherCompare = teacher1.compareTo(teacher2);
            if (teacherCompare != 0) return teacherCompare;

            String subject1 = s1.getCourseId().getTeacherSubject() != null
                    ? s1.getCourseId().getTeacherSubject().getSubject().getSubjectName() : "";
            String subject2 = s2.getCourseId().getTeacherSubject() != null
                    ? s2.getCourseId().getTeacherSubject().getSubject().getSubjectName() : "";

            int subjectCompare = subject1.compareTo(subject2);
            if (subjectCompare != 0) return subjectCompare;

            return s1.getDay().compareTo(s2.getDay());
        });

        String currentTeacher = "";
        for (schedule s : allHorarios) {
            String docente = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getTeacher().getTeacherName()
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

            String materia = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getSubject().getSubjectName()
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

            String materia = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getSubject().getSubjectName()
                    : "";
            String docente = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getTeacher().getTeacherName()
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
            String teacher1 = s1.getCourseId().getTeacherSubject() != null
                    ? s1.getCourseId().getTeacherSubject().getTeacher().getTeacherName() : "";
            String teacher2 = s2.getCourseId().getTeacherSubject() != null
                    ? s2.getCourseId().getTeacherSubject().getTeacher().getTeacherName() : "";

            int teacherCompare = teacher1.compareTo(teacher2);
            if (teacherCompare != 0) return teacherCompare;

            String subject1 = s1.getCourseId().getTeacherSubject() != null
                    ? s1.getCourseId().getTeacherSubject().getSubject().getSubjectName() : "";
            String subject2 = s2.getCourseId().getTeacherSubject() != null
                    ? s2.getCourseId().getTeacherSubject().getSubject().getSubjectName() : "";

            int subjectCompare = subject1.compareTo(subject2);
            if (subjectCompare != 0) return subjectCompare;

            return s1.getDay().compareTo(s2.getDay());
        });

        int rowIdx = 1;
        String currentTeacher = "";

        for (schedule s : allHorarios) {
            String docente = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getTeacher().getTeacherName()
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

            String materia = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getSubject().getSubjectName()
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

            String materia = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getSubject().getSubjectName()
                    : "";
            String docente = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getTeacher().getTeacherName()
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
            String teacher1 = s1.getCourseId().getTeacherSubject() != null
                    ? s1.getCourseId().getTeacherSubject().getTeacher().getTeacherName() : "";
            String teacher2 = s2.getCourseId().getTeacherSubject() != null
                    ? s2.getCourseId().getTeacherSubject().getTeacher().getTeacherName() : "";

            int teacherCompare = teacher1.compareTo(teacher2);
            if (teacherCompare != 0) return teacherCompare;

            String subject1 = s1.getCourseId().getTeacherSubject() != null
                    ? s1.getCourseId().getTeacherSubject().getSubject().getSubjectName() : "";
            String subject2 = s2.getCourseId().getTeacherSubject() != null
                    ? s2.getCourseId().getTeacherSubject().getSubject().getSubjectName() : "";

            int subjectCompare = subject1.compareTo(subject2);
            if (subjectCompare != 0) return subjectCompare;

            return s1.getDay().compareTo(s2.getDay());
        });

        String currentTeacher = "";

        for (schedule s : allHorarios) {
            String docente = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getTeacher().getTeacherName()
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

            String materia = s.getCourseId().getTeacherSubject() != null
                    ? s.getCourseId().getTeacherSubject().getSubject().getSubjectName()
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