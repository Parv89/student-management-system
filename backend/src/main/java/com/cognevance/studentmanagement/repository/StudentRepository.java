package com.cognevance.studentmanagement.repository;

import com.cognevance.studentmanagement.model.Student;
import com.cognevance.studentmanagement.model.StudentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Student entity.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    Optional<Student> findByEnrollmentNumber(String enrollmentNumber);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByEnrollmentNumber(String enrollmentNumber);

    boolean existsByEnrollmentNumberAndIdNot(String enrollmentNumber, Long id);

    long countByStatus(StudentStatus status);

    @Query("SELECT COUNT(DISTINCT s.course) FROM Student s")
    long countDistinctCourses();

    @Query("SELECT DISTINCT s.course FROM Student s ORDER BY s.course ASC")
    List<String> findDistinctCourses();

    @Query("SELECT s.course, COUNT(s) FROM Student s GROUP BY s.course ORDER BY COUNT(s) DESC")
    List<Object[]> countStudentsByCourse();

    /**
     * Parameterized JPQL query supporting search across name, email, and enrollment number,
     * along with course and status filtering, plus pagination and sorting.
     */
    @Query("SELECT s FROM Student s WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "   LOWER(s.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "   LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "   LOWER(s.enrollmentNumber) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:course IS NULL OR :course = '' OR s.course = :course) AND " +
           "(:status IS NULL OR s.status = :status)")
    Page<Student> findWithFilters(
            @Param("query") String query,
            @Param("course") String course,
            @Param("status") StudentStatus status,
            Pageable pageable
    );

    /**
     * Direct query search across name, email, and enrollment number.
     */
    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.enrollmentNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Student> searchByKeyword(@Param("query") String query);
}
