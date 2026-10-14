package com.cognevance.studentmanagement.controller;

import com.cognevance.studentmanagement.dto.DashboardStatsDto;
import com.cognevance.studentmanagement.dto.StudentRequestDto;
import com.cognevance.studentmanagement.dto.StudentResponseDto;
import com.cognevance.studentmanagement.exception.DuplicateResourceException;
import com.cognevance.studentmanagement.exception.GlobalExceptionHandler;
import com.cognevance.studentmanagement.exception.ResourceNotFoundException;
import com.cognevance.studentmanagement.model.StudentStatus;
import com.cognevance.studentmanagement.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = StudentController.class)
@Import(GlobalExceptionHandler.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudentService studentService;

    private StudentResponseDto sampleResponse;
    private StudentRequestDto sampleRequest;

    @BeforeEach
    void setUp() {
        sampleResponse = new StudentResponseDto(
                1L,
                "Aarav Sharma",
                "aarav.sharma@example.com",
                "+91 98765 43210",
                "Computer Science & Engineering",
                "STU-2026-001",
                LocalDate.of(2026, 1, 15),
                StudentStatus.ACTIVE,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        sampleRequest = new StudentRequestDto(
                "Aarav Sharma",
                "aarav.sharma@example.com",
                "+91 98765 43210",
                "Computer Science & Engineering",
                "STU-2026-001",
                LocalDate.of(2026, 1, 15),
                StudentStatus.ACTIVE
        );
    }

    @Test
    @DisplayName("POST /api/students - Should create student and return 201 Created")
    void testCreateStudent_Success_Returns201() throws Exception {
        when(studentService.createStudent(any(StudentRequestDto.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.fullName").value("Aarav Sharma"))
                .andExpect(jsonPath("$.data.email").value("aarav.sharma@example.com"));
    }

    @Test
    @DisplayName("POST /api/students - Validation failure returns 400 Bad Request with field errors")
    void testCreateStudent_ValidationError_Returns400() throws Exception {
        StudentRequestDto invalidRequest = new StudentRequestDto(
                "", // Blank name
                "invalid-email-address", // Invalid email format
                "123", // Too short phone
                "", // Blank course
                "", // Blank enrollment number
                null, // Null date
                null
        );

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors.fullName").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }

    @Test
    @DisplayName("POST /api/students - Duplicate email returns 409 Conflict")
    void testCreateStudent_DuplicateEmail_Returns409() throws Exception {
        when(studentService.createStudent(any(StudentRequestDto.class)))
                .thenThrow(new DuplicateResourceException("A student with email 'aarav.sharma@example.com' already exists."));

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Duplicate Resource"))
                .andExpect(jsonPath("$.message").value("A student with email 'aarav.sharma@example.com' already exists."));
    }

    @Test
    @DisplayName("GET /api/students/{id} - Should return 200 with student details")
    void testGetStudentById_Success_Returns200() throws Exception {
        when(studentService.getStudentById(1L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Aarav Sharma"))
                .andExpect(jsonPath("$.data.enrollmentNumber").value("STU-2026-001"));
    }

    @Test
    @DisplayName("GET /api/students/{id} - Non-existent ID returns 404 Not Found")
    void testGetStudentById_NotFound_Returns404() throws Exception {
        when(studentService.getStudentById(999L))
                .thenThrow(new ResourceNotFoundException("Student not found with ID: 999"));

        mockMvc.perform(get("/api/students/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Resource Not Found"))
                .andExpect(jsonPath("$.message").value("Student not found with ID: 999"));
    }

    @Test
    @DisplayName("PUT /api/students/{id} - Updates student and returns 200 OK")
    void testUpdateStudent_Success_Returns200() throws Exception {
        when(studentService.updateStudent(eq(1L), any(StudentRequestDto.class))).thenReturn(sampleResponse);

        mockMvc.perform(put("/api/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("DELETE /api/students/{id} - Deletes student and returns 200 OK")
    void testDeleteStudent_Success_Returns200() throws Exception {
        doNothing().when(studentService).deleteStudent(1L);

        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Student deleted successfully"));
    }

    @Test
    @DisplayName("GET /api/students - Returns paginated student listing")
    void testGetAllStudents_Returns200() throws Exception {
        Page<StudentResponseDto> page = new PageImpl<>(Collections.singletonList(sampleResponse));
        when(studentService.getAllStudents(any(), any(), any(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/students?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content[0].fullName").value("Aarav Sharma"));
    }

    @Test
    @DisplayName("GET /api/students/stats - Returns dashboard statistics")
    void testGetDashboardStats_Returns200() throws Exception {
        DashboardStatsDto stats = new DashboardStatsDto(10L, 8L, 2L, 4L, new HashMap<>());
        when(studentService.getDashboardStats()).thenReturn(stats);

        mockMvc.perform(get("/api/students/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalStudents").value(10))
                .andExpect(jsonPath("$.data.activeStudents").value(8))
                .andExpect(jsonPath("$.data.inactiveStudents").value(2))
                .andExpect(jsonPath("$.data.availableCourses").value(4));
    }

    @Test
    @DisplayName("GET /api/students/search - Returns search results")
    void testSearchStudents_Returns200() throws Exception {
        List<StudentResponseDto> results = Collections.singletonList(sampleResponse);
        when(studentService.searchStudents("Aarav")).thenReturn(results);

        mockMvc.perform(get("/api/students/search?query=Aarav"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].fullName").value("Aarav Sharma"));
    }
}
