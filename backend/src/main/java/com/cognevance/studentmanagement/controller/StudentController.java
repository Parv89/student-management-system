package com.cognevance.studentmanagement.controller;

import com.cognevance.studentmanagement.dto.ApiResponse;
import com.cognevance.studentmanagement.dto.DashboardStatsDto;
import com.cognevance.studentmanagement.dto.StudentRequestDto;
import com.cognevance.studentmanagement.dto.StudentResponseDto;
import com.cognevance.studentmanagement.model.StudentStatus;
import com.cognevance.studentmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller exposing student management operations.
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * GET /api/students - List students with optional search, course, status filters, and pagination.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudentResponseDto>>> getAllStudents(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String course,
            @RequestParam(required = false) StudentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<StudentResponseDto> students = studentService.getAllStudents(query, course, status, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Students retrieved successfully", students));
    }

    /**
     * GET /api/students/{id} - Retrieve student details by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponseDto>> getStudentById(@PathVariable Long id) {
        StudentResponseDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.ok("Student retrieved successfully", student));
    }

    /**
     * POST /api/students - Create a new student record.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponseDto>> createStudent(
            @Valid @RequestBody StudentRequestDto requestDto) {
        StudentResponseDto created = studentService.createStudent(requestDto);
        return new ResponseEntity<>(
                ApiResponse.ok("Student registered successfully", created),
                HttpStatus.CREATED
        );
    }

    /**
     * PUT /api/students/{id} - Update an existing student record.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponseDto>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequestDto requestDto) {
        StudentResponseDto updated = studentService.updateStudent(id, requestDto);
        return ResponseEntity.ok(ApiResponse.ok("Student updated successfully", updated));
    }

    /**
     * DELETE /api/students/{id} - Delete a student record by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.ok("Student deleted successfully", null));
    }

    /**
     * GET /api/students/search?query= - Quick search students by name, email, or enrollment number.
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<StudentResponseDto>>> searchStudents(
            @RequestParam(required = false, defaultValue = "") String query) {
        List<StudentResponseDto> results = studentService.searchStudents(query);
        return ResponseEntity.ok(ApiResponse.ok("Search results retrieved successfully", results));
    }

    /**
     * GET /api/students/stats - Aggregated statistics for dashboard cards.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        DashboardStatsDto stats = studentService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved successfully", stats));
    }

    /**
     * GET /api/students/courses - Distinct list of enrolled courses for filter dropdowns.
     */
    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<String>>> getAllCourses() {
        List<String> courses = studentService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.ok("Courses retrieved successfully", courses));
    }
}
