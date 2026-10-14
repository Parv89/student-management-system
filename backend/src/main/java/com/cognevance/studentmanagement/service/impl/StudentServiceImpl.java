package com.cognevance.studentmanagement.service.impl;

import com.cognevance.studentmanagement.dto.DashboardStatsDto;
import com.cognevance.studentmanagement.dto.StudentRequestDto;
import com.cognevance.studentmanagement.dto.StudentResponseDto;
import com.cognevance.studentmanagement.exception.DuplicateResourceException;
import com.cognevance.studentmanagement.exception.ResourceNotFoundException;
import com.cognevance.studentmanagement.model.Student;
import com.cognevance.studentmanagement.model.StudentStatus;
import com.cognevance.studentmanagement.repository.StudentRepository;
import com.cognevance.studentmanagement.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service implementation containing core business logic for student management.
 */
@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private static final Logger log = LoggerFactory.getLogger(StudentServiceImpl.class);

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public StudentResponseDto createStudent(StudentRequestDto requestDto) {
        log.info("Creating new student with email: {} and enrollment: {}",
                requestDto.getEmail(), requestDto.getEnrollmentNumber());

        String email = requestDto.getEmail().trim().toLowerCase();
        String enrollment = requestDto.getEnrollmentNumber().trim().toUpperCase();

        if (studentRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("A student with email '" + email + "' already exists.");
        }

        if (studentRepository.existsByEnrollmentNumber(enrollment)) {
            throw new DuplicateResourceException("A student with enrollment number '" + enrollment + "' already exists.");
        }

        Student student = new Student();
        student.setFullName(requestDto.getFullName().trim());
        student.setEmail(email);
        student.setPhone(requestDto.getPhone().trim());
        student.setCourse(requestDto.getCourse().trim());
        student.setEnrollmentNumber(enrollment);
        student.setEnrollmentDate(requestDto.getEnrollmentDate());
        student.setStatus(requestDto.getStatus() != null ? requestDto.getStatus() : StudentStatus.ACTIVE);

        Student saved = studentRepository.save(student);
        log.info("Successfully created student ID: {}", saved.getId());
        return StudentResponseDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponseDto> getAllStudents(String query, String course, StudentStatus status, Pageable pageable) {
        log.debug("Fetching students - query: '{}', course: '{}', status: '{}', page: {}",
                query, course, status, pageable.getPageNumber());

        String trimmedQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String trimmedCourse = (course != null && !course.trim().isEmpty()) ? course.trim() : null;

        Page<Student> page = studentRepository.findWithFilters(trimmedQuery, trimmedCourse, status, pageable);
        return page.map(StudentResponseDto::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDto getStudentById(Long id) {
        log.debug("Fetching student with ID: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return StudentResponseDto.fromEntity(student);
    }

    @Override
    public StudentResponseDto updateStudent(Long id, StudentRequestDto requestDto) {
        log.info("Updating student ID: {}", id);

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        String email = requestDto.getEmail().trim().toLowerCase();
        String enrollment = requestDto.getEnrollmentNumber().trim().toUpperCase();

        if (studentRepository.existsByEmailAndIdNot(email, id)) {
            throw new DuplicateResourceException("Another student with email '" + email + "' already exists.");
        }

        if (studentRepository.existsByEnrollmentNumberAndIdNot(enrollment, id)) {
            throw new DuplicateResourceException("Another student with enrollment number '" + enrollment + "' already exists.");
        }

        student.setFullName(requestDto.getFullName().trim());
        student.setEmail(email);
        student.setPhone(requestDto.getPhone().trim());
        student.setCourse(requestDto.getCourse().trim());
        student.setEnrollmentNumber(enrollment);
        student.setEnrollmentDate(requestDto.getEnrollmentDate());
        if (requestDto.getStatus() != null) {
            student.setStatus(requestDto.getStatus());
        }

        Student updated = studentRepository.save(student);
        log.info("Successfully updated student ID: {}", updated.getId());
        return StudentResponseDto.fromEntity(updated);
    }

    @Override
    public void deleteStudent(Long id) {
        log.info("Deleting student ID: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        studentRepository.delete(student);
        log.info("Successfully deleted student ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> searchStudents(String query) {
        log.debug("Searching students with query keyword: '{}'", query);
        if (query == null || query.trim().isEmpty()) {
            return studentRepository.findAll()
                    .stream()
                    .map(StudentResponseDto::fromEntity)
                    .collect(Collectors.toList());
        }
        return studentRepository.searchByKeyword(query.trim())
                .stream()
                .map(StudentResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        log.debug("Calculating dashboard statistics from database");
        long totalStudents = studentRepository.count();
        long activeStudents = studentRepository.countByStatus(StudentStatus.ACTIVE);
        long inactiveStudents = studentRepository.countByStatus(StudentStatus.INACTIVE);
        long availableCourses = studentRepository.countDistinctCourses();

        List<Object[]> distributionRaw = studentRepository.countStudentsByCourse();
        Map<String, Long> distributionMap = new LinkedHashMap<>();
        for (Object[] row : distributionRaw) {
            String course = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            distributionMap.put(course, count);
        }

        return new DashboardStatsDto(totalStudents, activeStudents, inactiveStudents, availableCourses, distributionMap);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCourses() {
        return studentRepository.findDistinctCourses();
    }
}
