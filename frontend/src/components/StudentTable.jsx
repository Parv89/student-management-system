import React from 'react';
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  UserX,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function StudentTable({
  students,
  totalElements,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  searchQuery,
  onSearchChange,
  courseFilter,
  onCourseFilterChange,
  statusFilter,
  onStatusFilterChange,
  availableCourses,
  loading,
  error,
  onRetry,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onOpenAddModal,
}) {
  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Enrolled Students</h2>

        {/* Toolbar: Search & Filters */}
        <div className="toolbar">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email or enrollment ID..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={courseFilter}
            onChange={(e) => onCourseFilterChange(e.target.value)}
            aria-label="Filter by course"
          >
            <option value="">All Courses</option>
            {availableCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Content Area: Table / Loading / Empty State */}
      {loading ? (
        <div className="state-box">
          <div className="spinner" style={{ width: 36, height: 36 }} />
          <p className="state-title" style={{ marginTop: '0.8rem' }}>
            Loading student records...
          </p>
          <p className="state-desc">Fetching data from the MySQL database.</p>
        </div>
      ) : error ? (
        <div className="state-box">
          <AlertCircle size={44} style={{ color: '#ef4444' }} />
          <p className="state-title">Unable to fetch students</p>
          <p className="state-desc">{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={onRetry}>
            <RefreshCw size={14} />
            <span>Retry Request</span>
          </button>
        </div>
      ) : students.length === 0 ? (
        <div className="state-box">
          <UserX className="state-icon" />
          <p className="state-title">No students found</p>
          <p className="state-desc">
            {searchQuery || courseFilter || statusFilter
              ? 'No student records match the active search or filter criteria. Try resetting filters.'
              : 'The student database is currently empty. Get started by adding a new student.'}
          </p>
          {!(searchQuery || courseFilter || statusFilter) && (
            <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
              Register First Student
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="student-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Enrollment ID</th>
                <th>Course</th>
                <th>Phone</th>
                <th>Enrollment Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar">
                        {getInitials(student.fullName)}
                      </div>
                      <div className="student-meta">
                        <span className="student-name">{student.fullName}</span>
                        <span className="student-email">{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="enrollment-badge">
                      {student.enrollmentNumber}
                    </span>
                  </td>
                  <td>{student.course}</td>
                  <td style={{ color: '#475569', fontSize: '0.85rem' }}>
                    {student.phone}
                  </td>
                  <td style={{ color: '#475569', fontSize: '0.85rem' }}>
                    {formatDate(student.enrollmentDate)}
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        student.status === 'ACTIVE' ? 'active' : 'inactive'
                      }`}
                    >
                      <span className="status-dot" />
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div
                      className="table-actions"
                      style={{ justifyContent: 'flex-end' }}
                    >
                      <button
                        className="action-btn view"
                        title="View Details"
                        onClick={() => onViewStudent(student)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-btn edit"
                        title="Edit Student"
                        onClick={() => onEditStudent(student)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete Student"
                        onClick={() => onDeleteStudent(student)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && !error && students.length > 0 && (
        <div className="pagination-bar">
          <div>
            Showing{' '}
            <strong>{currentPage * pageSize + 1}</strong> to{' '}
            <strong>
              {Math.min((currentPage + 1) * pageSize, totalElements)}
            </strong>{' '}
            of <strong>{totalElements}</strong> students
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem' }}>Rows per page:</span>
              <select
                className="filter-select"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="pagination-controls">
              <button
                className="page-btn"
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${currentPage === i ? 'active' : ''}`}
                  onClick={() => onPageChange(i)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="page-btn"
                disabled={currentPage >= totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
