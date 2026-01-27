import { NextResponse } from "next/server";
import { AppError } from "./AppError";
import { ERROR_CODES } from "./errorCodes";
import { ERROR_MESSAGES } from "./errorMessages";
import { logger } from "@/lib/utils/logger";

// Helper to format terminal logs
const logTerminalError = (context: string, error: any, isOperational: boolean) => {
    const timestamp = new Date().toISOString();
    const color = isOperational ? "\x1b[33m" : "\x1b[31m"; // Yellow for operational, Red for system
    const reset = "\x1b[0m";
    
    console.error(`\n${color}=================================================${reset}`);
    console.error(`${color}[${timestamp}] ${isOperational ? 'OPERATIONAL ERROR' : 'SYSTEM ERROR'}${reset}`);
    console.error(`${color}CONTEXT: ${context}${reset}`);
    console.error(`${color}MESSAGE: ${error?.message || 'Unknown Error'}${reset}`);
    if (!isOperational && error?.stack) {
        console.error(`${color}STACK:${reset}`);
        console.error(error.stack);
    }
    console.error(`${color}=================================================${reset}\n`);

    // Persist to logger
    logger.apiError(`[${isOperational ? 'AppError' : 'SystemError'}] ${context}`, {
        message: error?.message,
        stack: error?.stack,
        isOperational
    });
};

export const handleRouteError = (error: unknown, context: string = "Unknown Context") => {
    // 1. Handle Operational Errors (AppError)
    if (error instanceof AppError) {
        logTerminalError(context, error, true);
        
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: error.code,
                    message: error.message, // User-safe message
                    // details: error.meta // Optional: decide if we want to expose this to client. Request said "User-safe messages only", so likely hide meta unless debugging.
                }
            },
            { status: error.statusCode }
        );
    }

    // 2. Handle System/Unknown Errors
    const systemError = error instanceof Error ? error : new Error(String(error));
    logTerminalError(context, systemError, false);

    return NextResponse.json(
        {
            success: false,
            error: {
                code: ERROR_CODES.INTERNAL_SERVER_ERROR,
                message: ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR]
            },
        },
        { status: 500 }
    );
};
