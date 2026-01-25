import { NextResponse } from "next/server";
import { AppError } from "./AppError";
import { ERROR_CODES } from "./errorCodes";
import { ERROR_MESSAGES } from "./errorMessages";
import { logger } from "@/lib/logger";

type RouteHandler = (req: Request, ...args: any[]) => Promise<NextResponse | void>;

export const handleRouteError = (error: unknown, context?: string) => {
    // 1. Differentiate AppError vs Unknown
    if (error instanceof AppError) {
        // Operational Error: safe to return code + message to client
        // Log logic for internal tracking (server-side only)
        logger.apiError(`[AppError] ${context || 'Unknown Context'} - ${error.code}`, {
            statusCode: error.statusCode,
            message: error.message,
            meta: error.meta,
            stack: error.stack,
        });

        return NextResponse.json(error.toJSON(), { status: error.statusCode });
    }

    // 2. Handling Unknown / System Errors
    // We do NOT expose these details to client
    const isError = error instanceof Error;
    const errorMessage = isError ? error.message : "Unknown error";
    const errorStack = isError ? error.stack : undefined;

    // Log full details for developers
    logger.apiError(`[SystemError] ${context || 'Unknown Context'}`, {
        message: errorMessage,
        stack: errorStack,
        original: error,
    });

    // Return generic 500 to client
    return NextResponse.json(
        {
            success: false,
            error: {
                code: ERROR_CODES.INTERNAL_SERVER_ERROR,
                message: ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
            },
        },
        { status: 500 }
    );
};
