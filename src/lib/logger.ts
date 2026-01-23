export const logger = {
    info: (message: string, meta?: unknown) => {
        console.log(
            JSON.stringify({ level: "INFO", timestamp: new Date().toISOString(), message, meta })
        );
    },
    error: (message: string, error?: unknown) => {
        console.error(
            JSON.stringify({
                level: "ERROR",
                timestamp: new Date().toISOString(),
                message,
                error: error instanceof Error ? error.stack : error,
            })
        );
    },
    warn: (message: string, meta?: unknown) => {
        console.warn(
            JSON.stringify({ level: "WARN", timestamp: new Date().toISOString(), message, meta })
        );
    },
};
