package com.horarios.SGH.Controller;

import com.horarios.SGH.DTO.CourseDTO;
import com.horarios.SGH.Service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService service;

    @PostMapping
    public CourseDTO create(@RequestBody CourseDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<CourseDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CourseDTO getById(@PathVariable int id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public CourseDTO update(@PathVariable int id, @RequestBody CourseDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        service.delete(id);
    }
}