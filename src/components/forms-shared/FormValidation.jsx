import React from 'react';

/**
 * Shared form-validation UI helpers.
 * Used across every Add/Edit form in the admin so mandatory fields and
 * errors look and behave the same way everywhere.
 */

// Label with a red "*" appended when the field is required.
export const RequiredLabel = ({ children, required = false, className = '', htmlFor }) => (
  <label className={`form-label fw-medium ${className}`} htmlFor={htmlFor}>
    {children} {required && <span className="text-danger" aria-hidden="true">*</span>}
  </label>
);

// Small red error message shown directly under a field.
export const FieldError = ({ message }) => {
  if (!message) return null;
  return (
    <div className="invalid-feedback d-block" style={{ fontSize: '12px' }}>
      <i className="fa-light fa-circle-exclamation me-1"></i>
      {message}
    </div>
  );
};

// className helper: adds bootstrap's is-invalid class when there's an error for this field
export const invalidClass = (errors, field) => (errors && errors[field] ? 'is-invalid' : '');
