import { ERROR_CODES } from "@/lib/errors/errorCodes";

export const ERROR_UI_MAP: Record<string, string> = {
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "Something went wrong. Please try again.",
  [ERROR_CODES.DATABASE_ERROR]: "Database issue. We are looking into it.",
  [ERROR_CODES.TIMEOUT]: "Request timed out. Please check your internet.",
  [ERROR_CODES.SERVICE_UNAVAILABLE]: "Service is temporarily down.",
  
  [ERROR_CODES.UNAUTHORIZED]: "You are not logged in.",
  [ERROR_CODES.FORBIDDEN]: "You do not have permission to do this.",
  [ERROR_CODES.TOKEN_EXPIRED]: "Session expired. Please login again.",
  [ERROR_CODES.INVALID_TOKEN]: "Invalid session.",

  [ERROR_CODES.BAD_REQUEST]: "Invalid request.",
  [ERROR_CODES.VALIDATION_ERROR]: "Please check your inputs.",
  [ERROR_CODES.INVALID_INPUT]: "Invalid input data.",
  [ERROR_CODES.RESOURCE_NOT_FOUND]: "The item you are looking for does not exist.",
  [ERROR_CODES.DUPLICATE_RESOURCE]: "This item already exists.",
  [ERROR_CODES.METHOD_NOT_ALLOWED]: "Action not allowed.",
};

export function getUserMessage(code: string): string {
    return ERROR_UI_MAP[code] || "An unexpected error occurred.";
}
