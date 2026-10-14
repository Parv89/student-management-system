package com.cognevance.studentmanagement.service;

import com.cognevance.studentmanagement.dto.DashboardStatsDto;
import com.cognevance.studentmanagement.dto.StudentRequestDto;
import com.cognevance.studentmanagement.dto.StudentResponseDto;
import com.cognevance.studentmanagement.exception.DuplicateResourceException;
import com.cognevance.studentmanagement.exception.ResourceNotFoundException;
import com.cognevance.studentmanagement.model.Student;
import com.cognevance.studentmanagement.model.StudentStatus;
import com.cognevance.studentmanagement.repository.StudentRepository;
import com.cognevance.studentmanagement.service.impl.StudentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student sampleStudent;
    private StudentRequestDto sampleRequestDto;

    @BeforeEach
    void setUp() {
        sampleStudent = new Student(
                "Aarav Sharma",
                "aarav.sharma@example.com",
                "+91 98765 43210",
                "Computer Science & Engineering",
                "STU-2026-001",
                LocalDate.of(2026, 1, 15),
                StudentStatus.ACTIVE
        );
        sampleStudent.setId(1L);

        sampleRequestDto = new StudentRequestDto(
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
    @DisplayName("Should create student successfully when inputs are valid and unique")
    void testCreateStudent_Success() {
        when(studentRepository.existsByEmail("aarav.sharma@example.com")).thenReturn(false);
        when(studentRepository.existsByEnrollmentNumber("STU-2026-001")).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(sampleStudent);

        StudentResponseDto response = studentService.createStudent(sampleRequestDto);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getFullName()).isEqualTo("Aarav Sharma");
        assertThat(response.getEmail()).isEqualTo("aarav.sharma@example.com");
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email already exists")
    void testCreateStudent_DuplicateEmail_ThrowsException() {
        when(studentRepository.existsByEmail("aarav.sharma@example.com")).thenReturn(true);

        assertThatThrownBy(() -> studentService.createStudent(sampleRequestDto))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("email 'aarav.sharma@example.com' already exists");

        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when enrollment number already exists")
    void testCreateStudent_DuplicateEnrollmentNumber_ThrowsException() {
        when(studentRepository.existsByEmail("aarav.sharma@example.com")).thenReturn(false);
        when(studentRepository.existsByEnrollmentNumber("STU-2026-001")).thenReturn(true);

        assertThatThrownBy(() -> studentService.createStudent(sampleRequestDto))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("enrollment number 'STU-2026-001' already exists");

        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("Should return student details when student ID exists")
    void testGetStudentById_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));

        StudentResponseDto response = studentService.getStudentById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getFullName()).isEqualTo("Aarav Sharma");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when student ID does not exist")
    void testGetStudentById_NotFound_ThrowsException() {
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.getStudentById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Student not found with ID: 999");
    }

    @Test
    @DisplayName("Should update student details successfully")
    void testUpdateStudent_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));
        when(studentRepository.existsByEmailAndIdNot(anyString(), eq(1L))).thenReturn(false);
        when(studentRepository.existsByEnrollmentNumberAndIdNot(anyString(), eq(1L))).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(sampleStudent);

        StudentRequestDto updateDto = new StudentRequestDto(
                "Aarav Sharma Updated",
                "aarav.updated@example.com",
                "+91 98765 00000",
                "Data Science & AI",
                "STU-2026-001",
                LocalDate.of(2026, 1, 15),
                StudentStatus.ACTIVE
        );

        StudentResponseDto response = studentService.updateStudent(1L, updateDto);

        assertThat(response).isNotNull();
        verify(studentRepository, times(1)).save(sampleStudent);
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when updating with another student's email")
    void testUpdateStudent_DuplicateEmail_ThrowsException() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));
        when(studentRepository.existsByEmailAndIdNot("other@example.com", 1L)).thenReturn(true);

        StudentRequestDto updateDto = new StudentRequestDto(
                "Aarav Sharma",
                "other@example.com",
                "+91 98765 00000",
                "Data Science & AI",
                "STU-2026-001",
                LocalDate.of(2026, 1, 15),
                StudentStatus.ACTIVE
        );

        assertThatThrownBy(() -> studentService.updateStudent(1L, updateDto))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Another student with email 'other@example.com' already exists");

        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("Should delete student when ID exists")
    void testDeleteStudent_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));
        doNothing().when(studentRepository).delete(sampleStudent);

        studentService.deleteStudent(1L);

        verify(studentRepository, times(1)).delete(sampleStudent);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existent student")
    void testDeleteStudent_NotFound_ThrowsException() {
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.deleteStudent(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Student not found with ID: 999");

        verify(studentRepository, never()).delete(any(Student.class));
    }

    @Test
    @DisplayName("Should calculate dashboard statistics accurately")
    void testGetDashboardStats_Success() {
        when(studentRepository.count()).thenReturn(10L);
        when(studentRepository.countByStatus(StudentStatus.ACTIVE)).thenReturn(8L);
        when(studentRepository.countByStatus(StudentStatus.INACTIVE)).thenReturn(2L);
        when(studentRepository.countDistinctCourses()).thenReturn(4L);

        List<Object[]> rawDist = new ArrayList<>();
        rawDist.add(new Object[]{"Computer Science & Engineering", 4L});
        rawDist.add(new Object[]{"Data Science & AI", 2L});
        when(studentRepository.countStudentsByCourse()).thenReturn(rawDist);

        DashboardStatsDto stats = studentService.getDashboardStats();

        assertThat(stats.getTotalStudents()).isEqualTo(10L);
        assertThat(stats.getActiveStudents()).isEqualTo(8L);
        assertThat(stats.getInactiveStudents()).isEqualTo(2L);
        assertThat(stats.getAvailableCourses()).isEqualTo(4L);
        assertThat(stats.getCourseDistribution()).containsEntry("Computer Science & Engineering", 4L);
    }

    @Test
    @DisplayName("Should search students by keyword")
    void testSearchStudents_Success() {
        when(studentRepository.searchByKeyword("Aarav")).thenReturn(Collections.singletonList(sampleStudent));

        List<StudentResponseDto> results = studentService.searchStudents("Aarav");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getFullName()).isEqualTo("Aarav Sharma");
    }

    @Test
    @DisplayName("Should retrieve filtered and paginated students")
    void testGetAllStudents_WithPagination() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Student> page = new PageImpl<>(Collections.singletonList(sampleStudent), pageable, 1);

        when(studentRepository.findWithFilters(null, null, null, pageable)).thenReturn(page);

        Page<StudentResponseDto> result = studentService.getAllStudents(null, null, null, pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getFullName()).isEqualTo("Aarav Sharma");
    }
}
