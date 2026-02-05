/**
 * Centralized error handling exports
 * Use these throughout the backend for consistent error handling
 */

export { AppError } from "./AppError";
export { ERROR_CODES } from "./errorCodes";
export { ERROR_MESSAGES } from "./errorMessages";
export { handleRouteError } from "./handleRouteError";

// Specialized error classes
export {
    ValidationError,
    InvalidInputError,
    ResourceNotFoundError,
    DuplicateResourceError,
    UnauthorizedError,
    ForbiddenError,
    TokenExpiredError,
    DatabaseError,
    InternalServerError,
} from "./specialized-errors";
