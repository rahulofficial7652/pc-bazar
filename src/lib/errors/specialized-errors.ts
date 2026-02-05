import { AppError } from "./AppError";
import { ERROR_CODES } from "./errorCodes";

/**
 * Validation Errors - For invalid input, missing fields, format errors
 */
export class ValidationError extends AppError {
    constructor(message: string, meta?: unknown) {
        super({
            message,
            statusCode: 400,
            code: ERROR_CODES.VALIDATION_ERROR,
            meta,
        });
    }
}

export class InvalidInputError extends AppError {
    constructor(message: string = "Invalid input provided", meta?: unknown) {
        super({
            message,
            statusCode: 400,
            code: ERROR_CODES.INVALID_INPUT,
            meta,
        });
    }
}

/**
 * Business Logic Errors - Resource not found, duplicates, etc.
 */
export class ResourceNotFoundError extends AppError {
    constructor(resource: string = "Resource", meta?: unknown) {
        super({
            message: `${resource} not found`,
            statusCode: 404,
            code: ERROR_CODES.RESOURCE_NOT_FOUND,
            meta,
        });
    }
}

export class DuplicateResourceError extends AppError {
    constructor(resource: string = "Resource", meta?: unknown) {
        super({
            message: `${resource} already exists`,
            statusCode: 409,
            code: ERROR_CODES.DUPLICATE_RESOURCE,
            meta,
        });
    }
}

/**
 * Authentication & Authorization Errors
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = "Authentication required", meta?: unknown) {
        super({
            message,
            statusCode: 401,
            code: ERROR_CODES.UNAUTHORIZED,
            meta,
        });
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Access forbidden", meta?: unknown) {
        super({
            message,
            statusCode: 403,
            code: ERROR_CODES.FORBIDDEN,
            meta,
        });
    }
}

export class TokenExpiredError extends AppError {
    constructor(message: string = "Token has expired", meta?: unknown) {
        super({
            message,
            statusCode: 401,
            code: ERROR_CODES.TOKEN_EXPIRED,
            meta,
        });
    }
}

/**
 * Database Errors
 */
export class DatabaseError extends AppError {
    constructor(message: string = "Database operation failed", meta?: unknown) {
        super({
            message,
            statusCode: 500,
            code: ERROR_CODES.DATABASE_ERROR,
            isOperational: false, // System error, not user fault
            meta,
        });
    }
}

/**
 * Internal/System Errors
 */
export class InternalServerError extends AppError {
    constructor(message: string = "Internal server error", meta?: unknown) {
        super({
            message,
            statusCode: 500,
            code: ERROR_CODES.INTERNAL_SERVER_ERROR,
            isOperational: false,
            meta,
        });
    }
}
