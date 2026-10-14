import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  student,
  onClose,
  onConfirm,
  isDeleting,
}) {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: '#dc2626' }}>
            Confirm Student Deletion
          </h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <AlertTriangle size={30} />
          </div>

          <h4
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--primary-navy)',
              marginBottom: '0.5rem',
            }}
          >
            Are you sure you want to delete this student?
          </h4>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            This action will permanently delete student{' '}
            <strong>{student.fullName}</strong> (
            <span style={{ fontFamily: 'monospace' }}>
              {student.enrollmentNumber}
            </span>
            ) from the MySQL database.
          </p>

          <p
            style={{
              color: '#991b1b',
              fontSize: '0.75rem',
              marginTop: '0.75rem',
              fontWeight: 500,
            }}
          >
            Warning: This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="spinner" style={{ width: 14, height: 14 }} />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={15} />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
