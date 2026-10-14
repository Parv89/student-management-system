-- =====================================================================
-- Cognevance Technologies - Sample Data for Student Management System
-- Database: student_management_db
-- Description: 10 fictional, idempotent sample student records
-- Can be executed multiple times safely without generating duplicates
-- =====================================================================

USE `student_management_db`;

INSERT INTO `students` (
    `full_name`,
    `email`,
    `phone`,
    `course`,
    `enrollment_number`,
    `enrollment_date`,
    `status`
) VALUES
('Aarav Sharma', 'aarav.sharma@example.com', '+91 98765 43210', 'Computer Science & Engineering', 'STU-2026-001', '2026-01-15', 'ACTIVE'),
('Ananya Patel', 'ananya.patel@example.com', '+91 98765 43211', 'Data Science & AI', 'STU-2026-002', '2026-01-18', 'ACTIVE'),
('Rohan Verma', 'rohan.verma@example.com', '+91 98765 43212', 'Information Technology', 'STU-2026-003', '2026-02-01', 'ACTIVE'),
('Sneha Kulkarni', 'sneha.kulkarni@example.com', '+91 98765 43213', 'Computer Science & Engineering', 'STU-2026-004', '2026-02-10', 'ACTIVE'),
('Vikramaditya Roy', 'vikram.roy@example.com', '+91 98765 43214', 'Cybersecurity', 'STU-2026-005', '2026-02-15', 'INACTIVE'),
('Pooja Nair', 'pooja.nair@example.com', '+91 98765 43215', 'Cloud Computing & DevOps', 'STU-2026-006', '2026-03-01', 'ACTIVE'),
('Aditya Joshi', 'aditya.joshi@example.com', '+91 98765 43216', 'Data Science & AI', 'STU-2026-007', '2026-03-12', 'INACTIVE'),
('Meera Iyer', 'meera.iyer@example.com', '+91 98765 43217', 'Computer Science & Engineering', 'STU-2026-008', '2026-03-20', 'ACTIVE'),
('Karan Malhotra', 'karan.malhotra@example.com', '+91 98765 43218', 'Information Technology', 'STU-2026-009', '2026-04-05', 'ACTIVE'),
('Diya Sengupta', 'diya.sengupta@example.com', '+91 98765 43219', 'Cybersecurity', 'STU-2026-010', '2026-04-10', 'ACTIVE')
ON DUPLICATE KEY UPDATE
    `full_name` = VALUES(`full_name`),
    `phone` = VALUES(`phone`),
    `course` = VALUES(`course`),
    `enrollment_date` = VALUES(`enrollment_date`),
    `status` = VALUES(`status`);
