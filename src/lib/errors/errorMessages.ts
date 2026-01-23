import { ERROR_CODES } from "./errorCodes";

export const ERROR_MESSAGES: Record<string, string> = {
    [ERROR_CODES.BAD_REQUEST]: "Bad request",
    [ERROR_CODES.VALIDATION_ERROR]: "Validation failed",
    [ERROR_CODES.RESOURCE_NOT_FOUND]: "Resource not found",
    [ERROR_CODES.DUPLICATE_RESOURCE]: "Resource already exists",
    [ERROR_CODES.UNAUTHORIZED]: "You are not authorized to perform this action",
    [ERROR_CODES.FORBIDDEN]: "Access forbidden",
    [ERROR_CODES.METHOD_NOT_ALLOWED]: "Method not allowed",

    [ERROR_CODES.INTERNAL_SERVER_ERROR]: "An unexpected error occurred",
    [ERROR_CODES.DATABASE_ERROR]: "A database error occurred",
    [ERROR_CODES.SERVICE_UNAVAILABLE]: "Service unavailable",
    [ERROR_CODES.UPSTREAM_ERROR]: "Upstream service error",
};
