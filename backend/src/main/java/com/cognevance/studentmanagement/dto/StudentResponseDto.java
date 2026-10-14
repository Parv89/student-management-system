package com.cognevance.studentmanagement.dto;

import com.cognevance.studentmanagement.model.Student;
import com.cognevance.studentmanagement.model.StudentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for sending student details to the client.
 */
public class StudentResponseDto {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String course;
    private String enrollmentNumber;
    private LocalDate enrollmentDate;
    private StudentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StudentResponseDto() {
    }

    public StudentResponseDto(Long id, String fullName, String email, String phone,
                              String course, String enrollmentNumber, LocalDate enrollmentDate,
                              StudentStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.course = course;
        this.enrollmentNumber = enrollmentNumber;
        this.enrollmentDate = enrollmentDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static StudentResponseDto fromEntity(Student student) {
        if (student == null) {
            return null;
        }
        return new StudentResponseDto(
                student.getId(),
                student.getFullName(),
                student.getEmail(),
                student.getPhone(),
                student.getCourse(),
                student.getEnrollmentNumber(),
                student.getEnrollmentDate(),
                student.getStatus(),
                student.getCreatedAt(),
                student.getUpdatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getEnrollmentNumber() {
        return enrollmentNumber;
    }

    public void setEnrollmentNumber(String enrollmentNumber) {
        this.enrollmentNumber = enrollmentNumber;
    }

    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public StudentStatus getStatus() {
        return status;
    }

    public void setStatus(StudentStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
