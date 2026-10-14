import React from 'react';
import { X, Calendar, Mail, Phone, BookOpen, Hash, Clock, Edit2, Trash2 } from 'lucide-react';

export default function StudentDetailModal({
  isOpen,
  student,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!isOpen || !student) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3 className="modal-title">Student Profile</h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Card inside Modal */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              marginBottom: '1.5rem',
            }}
          >
            <div
              className="student-avatar"
              style={{ width: 56, height: 56, fontSize: '1.25rem' }}
            >
              {student.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <h4
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--primary-navy)',
                }}
              >
                {student.fullName}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {student.course}
              </p>
              <div style={{ marginTop: '0.4rem' }}>
                <span
                  className={`status-pill ${
                    student.status === 'ACTIVE' ? 'active' : 'inactive'
                  }`}
                >
                  <span className="status-dot" />
                  {student.status}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Info List */}
          <div className="detail-item">
            <span className="detail-label">
              <Hash size={14} style={{ display: 'inline', marginRight: 6 }} />
              Enrollment ID
            </span>
            <span className="detail-value">
              <span className="enrollment-badge">{student.enrollmentNumber}</span>
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Mail size={14} style={{ display: 'inline', marginRight: 6 }} />
              Email
            </span>
            <span className="detail-value">{student.email}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Phone size={14} style={{ display: 'inline', marginRight: 6 }} />
              Phone
            </span>
            <span className="detail-value">{student.phone}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <BookOpen size={14} style={{ display: 'inline', marginRight: 6 }} />
              Course
            </span>
            <span className="detail-value">{student.course}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Calendar size={14} style={{ display: 'inline', marginRight: 6 }} />
              Enrollment Date
            </span>
            <span className="detail-value">
              {formatDate(student.enrollmentDate)}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Clock size={14} style={{ display: 'inline', marginRight: 6 }} />
              Created At
            </span>
            <span
              className="detail-value"
              style={{ fontSize: '0.82rem', color: '#64748b' }}
            >
              {formatDateTime(student.createdAt)}
            </span>
          </div>

          <div className="detail-item" style={{ borderBottom: 'none' }}>
            <span className="detail-label">
              <Clock size={14} style={{ display: 'inline', marginRight: 6 }} />
              Last Updated
            </span>
            <span
              className="detail-value"
              style={{ fontSize: '0.82rem', color: '#64748b' }}
            >
              {formatDateTime(student.updatedAt)}
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              onClose();
              onEdit(student);
            }}
          >
            <Edit2 size={15} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              onClose();
              onDelete(student);
            }}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
