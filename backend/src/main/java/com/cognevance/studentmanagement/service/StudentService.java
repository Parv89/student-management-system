package com.cognevance.studentmanagement.service;

import com.cognevance.studentmanagement.dto.DashboardStatsDto;
import com.cognevance.studentmanagement.dto.StudentRequestDto;
import com.cognevance.studentmanagement.dto.StudentResponseDto;
import com.cognevance.studentmanagement.model.StudentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface defining business operations for students.
 */
public interface StudentService {

    StudentResponseDto createStudent(StudentRequestDto requestDto);

    Page<StudentResponseDto> getAllStudents(String query, String course, StudentStatus status, Pageable pageable);

    StudentResponseDto getStudentById(Long id);

    StudentResponseDto updateStudent(Long id, StudentRequestDto requestDto);

    void deleteStudent(Long id);

    List<StudentResponseDto> searchStudents(String query);

    DashboardStatsDto getDashboardStats();

    List<String> getAllCourses();
}
