import { ERROR_CODES } from "./errorCodes";

export const ERROR_MESSAGES: Record<string, string> = {
    // SYSTEM
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: "Something went wrong on our end. Please try again later.",
    [ERROR_CODES.DATABASE_ERROR]: "We encountered a temporary issue. Please try again.",
    [ERROR_CODES.SERVICE_UNAVAILABLE]: "Service is currently unavailable. Please check back later.",
    [ERROR_CODES.TIMEOUT]: "The request timed out. Please try again.",

    // SECURITY
    [ERROR_CODES.UNAUTHORIZED]: "Please sign in to continue.",
    [ERROR_CODES.FORBIDDEN]: "You do not have permission to perform this action.",
    [ERROR_CODES.TOKEN_EXPIRED]: "Your session has expired. Please sign in again.",
    [ERROR_CODES.INVALID_TOKEN]: "Invalid session. Please sign in again.",

    // VALIDATION
    [ERROR_CODES.BAD_REQUEST]: "The request was invalid.",
    [ERROR_CODES.VALIDATION_ERROR]: "Please check your input and try again.",
    [ERROR_CODES.INVALID_INPUT]: "One or more fields are invalid.",
    [ERROR_CODES.RESOURCE_NOT_FOUND]: "The requested resource could not be found.",
    [ERROR_CODES.DUPLICATE_RESOURCE]: "This item already exists.",
    [ERROR_CODES.METHOD_NOT_ALLOWED]: "This action is not allowed.",
};
