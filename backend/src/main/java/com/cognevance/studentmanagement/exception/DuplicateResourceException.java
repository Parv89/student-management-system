package com.cognevance.studentmanagement.exception;

/**
 * Exception thrown when a unique constraint violation occurs (e.g., duplicate email or enrollment number).
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
