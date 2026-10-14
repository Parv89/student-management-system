-- =====================================================================
-- Cognevance Technologies - Student Management System Database Schema
-- Database: student_management_db
-- Target Engine: MySQL 8.0+
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `student_management_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `student_management_db`;

-- ---------------------------------------------------------------------
-- Table: students
-- Description: Stores primary student records with validation constraints
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `students` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `course` VARCHAR(100) NOT NULL,
    `enrollment_number` VARCHAR(50) NOT NULL,
    `enrollment_date` DATE NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `pk_students` PRIMARY KEY (`id`),
    CONSTRAINT `uk_students_email` UNIQUE (`email`),
    CONSTRAINT `uk_students_enrollment_number` UNIQUE (`enrollment_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Indexes for optimized querying, filtering, and search performance
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS `idx_students_full_name` ON `students` (`full_name`);
CREATE INDEX IF NOT EXISTS `idx_students_course` ON `students` (`course`);
CREATE INDEX IF NOT EXISTS `idx_students_status` ON `students` (`status`);
CREATE INDEX IF NOT EXISTS `idx_students_enrollment_date` ON `students` (`enrollment_date`);
