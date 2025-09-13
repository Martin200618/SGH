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
            // Ahora obtenemos materia y docente desde Course → TeacherSubject
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
}