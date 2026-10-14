import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const COMMON_COURSES = [
  'Computer Science & Engineering',
  'Data Science & AI',
  'Information Technology',
  'Cybersecurity',
  'Cloud Computing & DevOps',
  'Software Engineering',
  'Artificial Intelligence & Robotics',
  'Electrical & Computer Engineering',
];

export default function StudentFormModal({
  isOpen,
  mode = 'add', // 'add' or 'edit'
  student = null,
  onClose,
  onSubmit,
  isSubmitting,
  serverError,
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    course: '',
    enrollmentNumber: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && student) {
      setFormData({
        fullName: student.fullName || '',
        email: student.email || '',
        phone: student.phone || '',
        course: student.course || '',
        enrollmentNumber: student.enrollmentNumber || '',
        enrollmentDate: student.enrollmentDate
          ? student.enrollmentDate.substring(0, 10)
          : new Date().toISOString().split('T')[0],
        status: student.status || 'ACTIVE',
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        course: '',
        enrollmentNumber: `STU-${new Date().getFullYear()}-${Math.floor(
          100 + Math.random() * 900
        )}`,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
      });
    }
    setErrors({});
  }, [isOpen, mode, student]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (
      formData.fullName.trim().length < 2 ||
      formData.fullName.trim().length > 100
    ) {
      newErrors.fullName = 'Name must be between 2 and 100 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[+0-9\-\s()]{7,20}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone =
        'Valid format required (7 to 20 digits, symbols or spaces)';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Please select or enter an academic course';
    }

    if (!formData.enrollmentNumber.trim()) {
      newErrors.enrollmentNumber = 'Enrollment number is required';
    }

    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = 'Enrollment date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
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
          <h3 className="modal-title">
            {mode === 'add' ? 'Register New Student' : 'Edit Student Details'}
          </h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Server Error Alert Banner */}
            {serverError && (
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#991b1b',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.85rem',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            <div className="form-grid">
              {/* Full Name */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="fullName">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="e.g. Aarav Sharma"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  maxLength={100}
                />
                {errors.fullName && (
                  <span className="field-error-msg">{errors.fullName}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="aarav.sharma@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  maxLength={100}
                />
                {errors.email && (
                  <span className="field-error-msg">{errors.email}</span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  maxLength={20}
                />
                {errors.phone && (
                  <span className="field-error-msg">{errors.phone}</span>
                )}
              </div>

              {/* Course */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="course">
                  Academic Course / Program <span className="required">*</span>
                </label>
                <input
                  id="course"
                  list="courseOptions"
                  className={`form-input ${errors.course ? 'error' : ''}`}
                  placeholder="Select or enter course..."
                  value={formData.course}
                  onChange={(e) => handleChange('course', e.target.value)}
                  maxLength={100}
                />
                <datalist id="courseOptions">
                  {COMMON_COURSES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {errors.course && (
                  <span className="field-error-msg">{errors.course}</span>
                )}
              </div>

              {/* Enrollment Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="enrollmentNumber">
                  Enrollment ID <span className="required">*</span>
                </label>
                <input
                  id="enrollmentNumber"
                  type="text"
                  className={`form-input ${
                    errors.enrollmentNumber ? 'error' : ''
                  }`}
                  placeholder="STU-2026-001"
                  value={formData.enrollmentNumber}
                  onChange={(e) =>
                    handleChange('enrollmentNumber', e.target.value)
                  }
                  maxLength={50}
                />
                {errors.enrollmentNumber && (
                  <span className="field-error-msg">
                    {errors.enrollmentNumber}
                  </span>
                )}
              </div>

              {/* Enrollment Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="enrollmentDate">
                  Enrollment Date <span className="required">*</span>
                </label>
                <input
                  id="enrollmentDate"
                  type="date"
                  className={`form-input ${
                    errors.enrollmentDate ? 'error' : ''
                  }`}
                  value={formData.enrollmentDate}
                  onChange={(e) =>
                    handleChange('enrollmentDate', e.target.value)
                  }
                />
                {errors.enrollmentDate && (
                  <span className="field-error-msg">
                    {errors.enrollmentDate}
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="status">
                  Enrollment Status <span className="required">*</span>
                </label>
                <select
                  id="status"
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" style={{ width: 14, height: 14 }} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{mode === 'add' ? 'Save Student' : 'Update Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
