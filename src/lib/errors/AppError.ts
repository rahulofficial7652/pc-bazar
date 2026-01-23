export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;
    public readonly meta?: unknown;

    constructor(args: {
        message: string;
        statusCode: number;
        code: string;
        isOperational?: boolean;
        meta?: unknown;
    }) {
        super(args.message);

        // Set properties
        this.statusCode = args.statusCode;
        this.code = args.code;
        this.isOperational = args.isOperational ?? true;
        this.meta = args.meta;

        // Maintain prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }

    public toJSON() {
        return {
            success: false,
            error: {
                code: this.code,
                message: this.message,
            },
        };
    }
}
