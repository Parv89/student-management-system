package com.cognevance.studentmanagement.dto;

import com.cognevance.studentmanagement.model.StudentStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Data Transfer Object for creating and updating students.
 */
public class StudentRequestDto {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Email address must be a valid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+0-9\\-\\s()]{7,20}$", message = "Phone number must be a valid format (7 to 20 digits, spaces or symbols)")
    private String phone;

    @NotBlank(message = "Course is required")
    @Size(max = 100, message = "Course cannot exceed 100 characters")
    private String course;

    @NotBlank(message = "Enrollment number is required")
    @Size(max = 50, message = "Enrollment number cannot exceed 50 characters")
    private String enrollmentNumber;

    @NotNull(message = "Enrollment date is required")
    private LocalDate enrollmentDate;

    @NotNull(message = "Status is required (ACTIVE or INACTIVE)")
    private StudentStatus status = StudentStatus.ACTIVE;

    public StudentRequestDto() {
    }

    public StudentRequestDto(String fullName, String email, String phone, String course,
                             String enrollmentNumber, LocalDate enrollmentDate, StudentStatus status) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.course = course;
        this.enrollmentNumber = enrollmentNumber;
        this.enrollmentDate = enrollmentDate;
        this.status = status;
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
}
