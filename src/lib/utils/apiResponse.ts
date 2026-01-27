import { NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

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
        const timestamp = new Date().toISOString();
        const color = "\x1b[31m"; // Red
        const reset = "\x1b[0m";

        console.error(`\n${color}=================================================${reset}`);
        console.error(`${color}[${timestamp}] API RESPONSE ERROR${reset}`);
        console.error(`${color}MESSAGE: ${message}${reset}`);
        if (error instanceof Error) {
            console.error(`${color}STACK:${reset}`);
            console.error(error.stack);
        } else if (error) {
             console.error(`${color}DETAILS:${reset}`, error);
        }
        console.error(`${color}=================================================${reset}\n`);

        logger.error(`[API ERROR] ${message}`, error);

        // 2. Return user-friendly error to Client
        return NextResponse.json(
            { success: false, message: message },
            { status }
        );
    },
};
