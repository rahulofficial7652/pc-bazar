import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

type ApiResponseOptions = {
    status?: number;
    data?: any;
    message?: string;
    error?: unknown;
};

export const ApiResponse = {
    success: (data: any, message: string = "Success", status: number = 200) => {
        return NextResponse.json(
            { success: true, message, data },
            { status }
        );
    },

    error: (message: string, error?: unknown, status: number = 500) => {
        // 1. Log detailed error to terminal for Developer
        logger.error(`[API ERROR] ${message}`, error);
        if (error instanceof Error) {
            console.error("\x1b[31m%s\x1b[0m", "[STACK TRACE]:", error.stack); // Red color for visibility
        }

        // 2. Return user-friendly error to Client
        // Hide internal server errors in production if needed, but for now show message
        return NextResponse.json(
            { success: false, message: message },
            { status }
        );
    },
};
