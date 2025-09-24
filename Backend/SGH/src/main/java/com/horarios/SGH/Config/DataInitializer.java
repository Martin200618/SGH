package com.horarios.SGH.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.horarios.SGH.Model.users;
import com.horarios.SGH.Model.subjects;
import com.horarios.SGH.Model.teachers;
import com.horarios.SGH.Model.courses;
import com.horarios.SGH.Model.TeacherSubject;
import com.horarios.SGH.Model.TeacherAvailability;
import com.horarios.SGH.Model.Days;
import com.horarios.SGH.Repository.Iusers;
import com.horarios.SGH.Repository.Isubjects;
import com.horarios.SGH.Repository.Iteachers;
import com.horarios.SGH.Repository.Icourses;
import com.horarios.SGH.Repository.TeacherSubjectRepository;
import com.horarios.SGH.Repository.ITeacherAvailabilityRepository;

import org.springframework.boot.CommandLineRunner;
import java.time.LocalTime;

@Configuration
public class DataInitializer {

    @Value("${app.master.username:master}")
    private String masterUsername;

    @Value("${app.master.password:Master$2025!}")
    private String masterPassword;

    @Bean
    public CommandLineRunner seedMasterUser(Iusers repo, PasswordEncoder encoder) {
        return args -> {
            if (!repo.existsByUserName(masterUsername)) {
                users u = new users();
                u.setUserName(masterUsername);
                u.setPassword(encoder.encode(masterPassword));
                repo.save(u);
                System.out.println(">> Master creado: " + masterUsername);
            } else {
                System.out.println(">> Master ya existe: " + masterUsername);
            }
            long total = repo.count();
            System.out.println(">> Usuarios totales: " + total + " (máximo permitido: 2)");
        };
    }

    @Bean
    public CommandLineRunner seedInitialData(Isubjects subjectRepo, Iteachers teacherRepo, Icourses courseRepo, TeacherSubjectRepository teacherSubjectRepo, ITeacherAvailabilityRepository availabilityRepo) {
        return args -> {
            // Crear materias si no existen
            if (subjectRepo.count() == 0) {
                subjects math = new subjects();
                math.setSubjectName("Matemáticas");
                subjectRepo.save(math);

                subjects physics = new subjects();
                physics.setSubjectName("Física");
                subjectRepo.save(physics);

                subjects chemistry = new subjects();
                chemistry.setSubjectName("Química");
                subjectRepo.save(chemistry);

                subjects biology = new subjects();
                biology.setSubjectName("Biología");
                subjectRepo.save(biology);

                System.out.println(">> Materias iniciales creadas");
            }

            // Crear profesores si no existen
            if (teacherRepo.count() == 0) {
                teachers teacher1 = new teachers();
                teacher1.setTeacherName("Juan Pérez");
                teacher1 = teacherRepo.save(teacher1);

                teachers teacher2 = new teachers();
                teacher2.setTeacherName("María García");
                teacher2 = teacherRepo.save(teacher2);

                teachers teacher3 = new teachers();
                teacher3.setTeacherName("Carlos López");
                teacher3 = teacherRepo.save(teacher3);

                // Asignar especializaciones
                subjects math = subjectRepo.findBySubjectName("Matemáticas");
                if (math != null) {
                    TeacherSubject ts1 = new TeacherSubject();
                    ts1.setTeacher(teacher1);
                    ts1.setSubject(math);
                    teacherSubjectRepo.save(ts1);
                }

                subjects physics = subjectRepo.findBySubjectName("Física");
                if (physics != null) {
                    TeacherSubject ts2 = new TeacherSubject();
                    ts2.setTeacher(teacher2);
                    ts2.setSubject(physics);
                    teacherSubjectRepo.save(ts2);
                }

                subjects chemistry = subjectRepo.findBySubjectName("Química");
                if (chemistry != null) {
                    TeacherSubject ts3 = new TeacherSubject();
                    ts3.setTeacher(teacher3);
                    ts3.setSubject(chemistry);
                    teacherSubjectRepo.save(ts3);
                }

                // Crear disponibilidad inicial para profesores
                // Disponibilidad para Juan Pérez (Lunes y Miércoles)
                TeacherAvailability avail1 = new TeacherAvailability();
                avail1.setTeacher(teacher1);
                avail1.setDay(Days.Lunes);
                avail1.setAmStart(LocalTime.of(8, 0));
                avail1.setAmEnd(LocalTime.of(12, 0));
                avail1.setPmStart(LocalTime.of(14, 0));
                avail1.setPmEnd(LocalTime.of(18, 0));
                availabilityRepo.save(avail1);

                TeacherAvailability avail2 = new TeacherAvailability();
                avail2.setTeacher(teacher1);
                avail2.setDay(Days.Miércoles);
                avail2.setAmStart(LocalTime.of(8, 0));
                avail2.setAmEnd(LocalTime.of(12, 0));
                availabilityRepo.save(avail2);

                // Disponibilidad para María García (Martes y Jueves)
                TeacherAvailability avail3 = new TeacherAvailability();
                avail3.setTeacher(teacher2);
                avail3.setDay(Days.Martes);
                avail3.setAmStart(LocalTime.of(9, 0));
                avail3.setAmEnd(LocalTime.of(13, 0));
                availabilityRepo.save(avail3);

                TeacherAvailability avail4 = new TeacherAvailability();
                avail4.setTeacher(teacher2);
                avail4.setDay(Days.Jueves);
                avail4.setAmStart(LocalTime.of(9, 0));
                avail4.setAmEnd(LocalTime.of(13, 0));
                availabilityRepo.save(avail4);

                // Disponibilidad para Carlos López (Viernes)
                TeacherAvailability avail5 = new TeacherAvailability();
                avail5.setTeacher(teacher3);
                avail5.setDay(Days.Viernes);
                avail5.setAmStart(LocalTime.of(10, 0));
                avail5.setAmEnd(LocalTime.of(14, 0));
                avail5.setPmStart(LocalTime.of(15, 0));
                avail5.setPmEnd(LocalTime.of(19, 0));
                availabilityRepo.save(avail5);

                System.out.println(">> Profesores y disponibilidad iniciales creados");
            }

            // Crear cursos si no existen
            if (courseRepo.count() == 0) {
                // Obtener las especializaciones creadas
                subjects math = subjectRepo.findBySubjectName("Matemáticas");
                subjects physics = subjectRepo.findBySubjectName("Física");
                subjects chemistry = subjectRepo.findBySubjectName("Química");

                teachers teacher1 = teacherRepo.findAll().stream().filter(t -> t.getTeacherName().equals("Juan Pérez")).findFirst().orElse(null);
                teachers teacher2 = teacherRepo.findAll().stream().filter(t -> t.getTeacherName().equals("María García")).findFirst().orElse(null);
                teachers teacher3 = teacherRepo.findAll().stream().filter(t -> t.getTeacherName().equals("Carlos López")).findFirst().orElse(null);

                // Asignar teacherSubject a cursos
                TeacherSubject ts1 = teacherSubjectRepo.findByTeacher_IdAndSubject_Id(teacher1.getId(), math.getId()).orElse(null);
                courses course1 = new courses();
                course1.setCourseName("1A");
                course1.setTeacherSubject(ts1);
                courseRepo.save(course1);

                TeacherSubject ts2 = teacherSubjectRepo.findByTeacher_IdAndSubject_Id(teacher2.getId(), physics.getId()).orElse(null);
                courses course2 = new courses();
                course2.setCourseName("2B");
                course2.setTeacherSubject(ts2);
                courseRepo.save(course2);

                TeacherSubject ts3 = teacherSubjectRepo.findByTeacher_IdAndSubject_Id(teacher3.getId(), chemistry.getId()).orElse(null);
                courses course3 = new courses();
                course3.setCourseName("3C");
                course3.setTeacherSubject(ts3);
                courseRepo.save(course3);

                System.out.println(">> Cursos iniciales creados");
            }
        };
    }
}
