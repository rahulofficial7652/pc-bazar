# PC-Bazar Error Handling System Documentation

> **Last Updated:** January 30, 2026  
> **Location:** `/src/lib/errors/`

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [File Structure](#file-structure)
4. [Detailed File Documentation](#detailed-file-documentation)
   - [AppError.ts](#1-apperrorts)
   - [errorCodes.ts](#2-errorcodests)
   - [errorMessages.ts](#3-errormessagests)
   - [handleRouteError.ts](#4-handlerouteerrorts)
   - [error-map.ts (Frontend)](#5-error-mapts-frontend)
   - [api-client.ts (Frontend)](#6-api-clientts-frontend)
5. [How They Interrelate](#how-they-interrelate)
6. [Data Flow Diagram](#data-flow-diagram)
7. [Usage Examples](#usage-examples)
8. [Error Codes Reference](#error-codes-reference)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

PC-Bazar project में एक **centralized error handling system** implement किया गया है जो:

- ✅ **Consistent Error Responses** - सभी API routes से uniform error format
- ✅ **Developer-Friendly Logging** - Terminal में colored, detailed logs
- ✅ **User-Safe Messages** - Client को sensitive information expose नहीं होती
- ✅ **Type Safety** - TypeScript के साथ full type support
- ✅ **Separation of Concerns** - Backend और Frontend में अलग-अलग error handling

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ERROR HANDLING ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         BACKEND LAYER                                │   │
│  │                                                                      │   │
│  │   ┌──────────────┐    ┌─────────────────┐    ┌──────────────────┐   │   │
│  │   │ errorCodes.ts│───▶│ errorMessages.ts│    │   AppError.ts    │   │   │
│  │   │              │    │                 │    │   (Custom Error  │   │   │
│  │   │ ERROR_CODES  │    │ ERROR_MESSAGES  │    │    Class)        │   │   │
│  │   └──────────────┘    └─────────────────┘    └──────────────────┘   │   │
│  │          │                     │                      │              │   │
│  │          └─────────────────────┼──────────────────────┘              │   │
│  │                                ▼                                     │   │
│  │                    ┌────────────────────────┐                        │   │
│  │                    │ handleRouteError.ts    │                        │   │
│  │                    │ (Central Error Handler)│                        │   │
│  │                    └────────────────────────┘                        │   │
│  │                                │                                     │   │
│  │                    ┌───────────┴───────────┐                         │   │
│  │                    ▼                       ▼                         │   │
│  │           ┌──────────────┐        ┌──────────────┐                   │   │
│  │           │ logger.ts    │        │ JSON Response│                   │   │
│  │           │ (Console Log)│        │ to Client    │                   │   │
│  │           └──────────────┘        └──────────────┘                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                       │                                      │
│                                       ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND LAYER                               │   │
│  │                                                                      │   │
│  │   ┌──────────────┐         ┌─────────────────┐                       │   │
│  │   │ error-map.ts │────────▶│  api-client.ts  │                       │   │
│  │   │              │         │                 │                       │   │
│  │   │ ERROR_UI_MAP │         │ getUserMessage()│──▶ Toast Notification │   │
│  │   │              │         │                 │                       │   │
│  │   └──────────────┘         └─────────────────┘                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
src/lib/
├── errors/
│   ├── AppError.ts          # Custom Error Class
│   ├── errorCodes.ts        # Error Code Constants
│   ├── errorMessages.ts     # Backend Error Messages
│   └── handleRouteError.ts  # Central Error Handler
├── frontend/
│   ├── error-map.ts         # Frontend Error Messages
│   └── api-client.ts        # API Client with Error Handling
└── utils/
    ├── logger.ts            # Logging Utility
    └── apiResponse.ts       # API Response Helpers
```

---

## Detailed File Documentation

### 1. `AppError.ts`

**Location:** `/src/lib/errors/AppError.ts`

**Purpose:** Custom Error class जो native JavaScript `Error` को extend करती है।

#### Class Definition

```typescript
export class AppError extends Error {
    public readonly statusCode: number;    // HTTP Status Code (400, 401, 404, 500, etc.)
    public readonly code: string;          // Error Code from ERROR_CODES
    public readonly isOperational: boolean; // true = expected error, false = system error
    public readonly meta?: unknown;        // Additional debug information

    constructor(args: {
        message: string;
        statusCode: number;
        code: string;
        isOperational?: boolean;  // defaults to true
        meta?: unknown;
    });

    public toJSON(): object;  // Serializes error for response
}
```

#### Properties Explained

| Property | Type | Description |
|----------|------|-------------|
| `statusCode` | `number` | HTTP status code (जैसे 400, 401, 403, 404, 500) |
| `code` | `string` | Unique error identifier (ERROR_CODES से) |
| `message` | `string` | Human-readable error message |
| `isOperational` | `boolean` | `true` = Business logic error (expected), `false` = System error (unexpected) |
| `meta` | `unknown` | Optional debugging info (client को नहीं भेजा जाता) |

#### Key Features

- **Prototype Chain Maintained:** `Object.setPrototypeOf()` ensures proper inheritance
- **Stack Trace Captured:** `Error.captureStackTrace()` for debugging
- **JSON Serialization:** `toJSON()` method for clean API responses

---

### 2. `errorCodes.ts`

**Location:** `/src/lib/errors/errorCodes.ts`

**Purpose:** सभी error codes के लिए centralized constants।

#### Error Code Categories

```typescript
export const ERROR_CODES = {
    // 1. VALIDATION ERRORS (Client Input Issues)
    VALIDATION_ERROR: "VALIDATION_ERROR",
    INVALID_INPUT: "INVALID_INPUT",
    BAD_REQUEST: "BAD_REQUEST",

    // 2. BUSINESS ERRORS (Application Logic Issues)
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
    DUPLICATE_RESOURCE: "DUPLICATE_RESOURCE",
    METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",

    // 3. SECURITY ERRORS (Authentication/Authorization)
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    TOKEN_EXPIRED: "TOKEN_EXPIRED",
    INVALID_TOKEN: "INVALID_TOKEN",

    // 4. INTERNAL ERRORS (Server/System Issues)
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    DATABASE_ERROR: "DATABASE_ERROR",
    TIMEOUT: "TIMEOUT",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
```

#### Category Breakdown

| Category | Errors | Typical HTTP Status |
|----------|--------|---------------------|
| **Validation** | `VALIDATION_ERROR`, `INVALID_INPUT`, `BAD_REQUEST` | 400 |
| **Business** | `RESOURCE_NOT_FOUND`, `DUPLICATE_RESOURCE`, `METHOD_NOT_ALLOWED` | 404, 409, 405 |
| **Security** | `UNAUTHORIZED`, `FORBIDDEN`, `TOKEN_EXPIRED`, `INVALID_TOKEN` | 401, 403 |
| **Internal** | `INTERNAL_SERVER_ERROR`, `DATABASE_ERROR`, `TIMEOUT`, `SERVICE_UNAVAILABLE` | 500, 503 |

---

### 3. `errorMessages.ts`

**Location:** `/src/lib/errors/errorMessages.ts`

**Purpose:** Backend API responses के लिए user-friendly messages।

```typescript
import { ERROR_CODES } from "./errorCodes";

export const ERROR_MESSAGES: Record<string, string> = {
    // SYSTEM ERRORS
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: "Something went wrong on our end. Please try again later.",
    [ERROR_CODES.DATABASE_ERROR]: "We encountered a temporary issue. Please try again.",
    [ERROR_CODES.SERVICE_UNAVAILABLE]: "Service is currently unavailable. Please check back later.",
    [ERROR_CODES.TIMEOUT]: "The request timed out. Please try again.",

    // SECURITY ERRORS
    [ERROR_CODES.UNAUTHORIZED]: "Please sign in to continue.",
    [ERROR_CODES.FORBIDDEN]: "You do not have permission to perform this action.",
    [ERROR_CODES.TOKEN_EXPIRED]: "Your session has expired. Please sign in again.",
    [ERROR_CODES.INVALID_TOKEN]: "Invalid session. Please sign in again.",

    // VALIDATION ERRORS
    [ERROR_CODES.BAD_REQUEST]: "The request was invalid.",
    [ERROR_CODES.VALIDATION_ERROR]: "Please check your input and try again.",
    [ERROR_CODES.INVALID_INPUT]: "One or more fields are invalid.",
    [ERROR_CODES.RESOURCE_NOT_FOUND]: "The requested resource could not be found.",
    [ERROR_CODES.DUPLICATE_RESOURCE]: "This item already exists.",
    [ERROR_CODES.METHOD_NOT_ALLOWED]: "This action is not allowed.",
};
```

---

### 4. `handleRouteError.ts`

**Location:** `/src/lib/errors/handleRouteError.ts`

**Purpose:** API routes में errors को centrally handle करना।

#### Main Function

```typescript
export const handleRouteError = (error: unknown, context: string = "Unknown Context") => {
    // 1. Handle Operational Errors (AppError instances)
    if (error instanceof AppError) {
        logTerminalError(context, error, true);
        return NextResponse.json({
            success: false,
            error: {
                code: error.code,
                message: error.message,
            }
        }, { status: error.statusCode });
    }

    // 2. Handle System/Unknown Errors
    const systemError = error instanceof Error ? error : new Error(String(error));
    logTerminalError(context, systemError, false);
    return NextResponse.json({
        success: false,
        error: {
            code: ERROR_CODES.INTERNAL_SERVER_ERROR,
            message: ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR]
        },
    }, { status: 500 });
};
```

#### Terminal Logging

```typescript
const logTerminalError = (context: string, error: any, isOperational: boolean) => {
    // Yellow color for operational errors
    // Red color for system errors
    // Includes: timestamp, context, message, stack trace (for system errors)
    // Also persists to logger for file logging
};
```

#### Console Output Examples

**Operational Error (Yellow):**
```
=================================================
[2026-01-30T19:50:00.000Z] OPERATIONAL ERROR
CONTEXT: CreateProduct
MESSAGE: Product name is required
=================================================
```

**System Error (Red):**
```
=================================================
[2026-01-30T19:50:00.000Z] SYSTEM ERROR
CONTEXT: CreateProduct
MESSAGE: Cannot read property 'name' of undefined
STACK:
    at CreateProduct (/src/app/api/v1/products/route.ts:25:10)
    ...
=================================================
```

---

### 5. `error-map.ts` (Frontend)

**Location:** `/src/lib/frontend/error-map.ts`

**Purpose:** Frontend UI के लिए user-friendly error messages।

```typescript
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
```

#### Backend vs Frontend Messages

| Error Code | Backend Message | Frontend Message |
|------------|-----------------|------------------|
| `UNAUTHORIZED` | "Please sign in to continue." | "You are not logged in." |
| `RESOURCE_NOT_FOUND` | "The requested resource could not be found." | "The item you are looking for does not exist." |
| `TIMEOUT` | "The request timed out. Please try again." | "Request timed out. Please check your internet." |

---

### 6. `api-client.ts` (Frontend)

**Location:** `/src/lib/frontend/api-client.ts`

**Purpose:** API calls को handle करना और errors को toast notifications में दिखाना।

```typescript
import { toast } from "sonner";
import { getUserMessage } from "./error-map";

export async function apiClient<T>(url: string, options: RequestInit = {}): Promise<T | null> {
    try {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });

        const json = await res.json();

        if (!json.success && json.error) {
            const userMessage = getUserMessage(json.error.code);
            toast.error(userMessage);  // Show user-friendly error
            return null;
        }

        if (json.success && json.message && options.method !== "GET") {
            toast.success(json.message);  // Show success message
        }

        return json.data;

    } catch (err) {
        toast.error("Failed to connect to the server.");
        return null;
    }
}
```

---

## How They Interrelate

### Dependency Graph

```
                    ┌─────────────────┐
                    │  errorCodes.ts  │ (Source of Truth)
                    └────────┬────────┘
                             │
            ┌────────────────┼─────────────────┐
            ▼                ▼                 ▼
    ┌───────────────┐ ┌─────────────┐  ┌──────────────┐
    │errorMessages.ts│ │error-map.ts │  │ AppError.ts  │
    │   (Backend)   │ │ (Frontend)  │  │   (Class)    │
    └───────┬───────┘ └──────┬──────┘  └──────┬───────┘
            │                │                │
            ▼                │                ▼
    ┌───────────────────┐    │    ┌───────────────────┐
    │handleRouteError.ts│◄───┘    │   API Routes      │
    │ (Error Handler)   │◄────────┤ (throw AppError)  │
    └────────┬──────────┘         └───────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌──────────┐   ┌─────────────┐
│ logger.ts│   │JSON Response│
└──────────┘   └──────┬──────┘
                      │
                      ▼
              ┌──────────────┐
              │api-client.ts │
              │ (Frontend)   │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │Toast Message │
              │ (UI)         │
              └──────────────┘
```

### Relationship Summary

| File | Imports From | Used By |
|------|--------------|---------|
| `errorCodes.ts` | - | `errorMessages.ts`, `error-map.ts`, `handleRouteError.ts`, All API routes |
| `errorMessages.ts` | `errorCodes.ts` | `handleRouteError.ts` |
| `AppError.ts` | - | All API routes, `handleRouteError.ts` |
| `handleRouteError.ts` | `AppError.ts`, `errorCodes.ts`, `errorMessages.ts`, `logger.ts` | All API routes |
| `error-map.ts` | `errorCodes.ts` | `api-client.ts` |
| `api-client.ts` | `error-map.ts` | Frontend components |

---

## Data Flow Diagram

### Complete Error Flow (Request to Toast)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            COMPLETE ERROR FLOW                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  1. USER ACTION                                                               │
│     └──► Click "Add Product" button                                          │
│                                                                               │
│  2. FRONTEND (api-client.ts)                                                  │
│     └──► POST /api/v1/products                                               │
│          Body: { name: "" }  // Missing required field                        │
│                                                                               │
│  3. API ROUTE (products/route.ts)                                            │
│     └──► Validation fails                                                     │
│     └──► throw new AppError({                                                │
│            message: "Product name is required",                               │
│            statusCode: 400,                                                   │
│            code: ERROR_CODES.VALIDATION_ERROR                                │
│          })                                                                   │
│                                                                               │
│  4. ERROR HANDLER (handleRouteError.ts)                                       │
│     └──► Catches AppError                                                     │
│     └──► Logs to terminal (Yellow - Operational)                             │
│     └──► Logs to logger.ts                                                    │
│     └──► Returns: {                                                          │
│            success: false,                                                    │
│            error: { code: "VALIDATION_ERROR", message: "..." }               │
│          }                                                                    │
│                                                                               │
│  5. FRONTEND (api-client.ts)                                                  │
│     └──► Receives response                                                    │
│     └──► json.success === false                                               │
│     └──► Gets code: "VALIDATION_ERROR"                                        │
│     └──► Calls getUserMessage("VALIDATION_ERROR")                            │
│                                                                               │
│  6. ERROR MAP (error-map.ts)                                                  │
│     └──► Returns: "Please check your inputs."                                │
│                                                                               │
│  7. TOAST NOTIFICATION                                                        │
│     └──► toast.error("Please check your inputs.")                            │
│                                                                               │
│  8. USER SEES                                                                 │
│     └──► Red toast: "Please check your inputs."                              │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Usage Examples

### Throwing an AppError in API Route

```typescript
// src/app/api/v1/products/route.ts
import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/errorCodes";
import { handleRouteError } from "@/lib/errors/handleRouteError";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Validation Error
        if (!body.name) {
            throw new AppError({
                message: "Product name is required",
                statusCode: 400,
                code: ERROR_CODES.VALIDATION_ERROR,
            });
        }

        // Duplicate Resource Error
        const existing = await db.product.findUnique({ where: { slug: body.slug } });
        if (existing) {
            throw new AppError({
                message: "A product with this slug already exists",
                statusCode: 409,
                code: ERROR_CODES.DUPLICATE_RESOURCE,
            });
        }

        // Success case
        const product = await db.product.create({ data: body });
        return Response.json({ success: true, data: product });

    } catch (error) {
        return handleRouteError(error, "CreateProduct");
    }
}
```

### Using apiClient in Frontend

```typescript
// src/components/ProductForm.tsx
import { apiClient } from "@/lib/frontend/api-client";

async function createProduct(data: ProductData) {
    const result = await apiClient<Product>("/api/v1/products", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (result) {
        // Success - api-client already showed success toast
        router.push("/products");
    }
    // Error case - api-client already showed error toast
}
```

### Custom Error with Meta Data

```typescript
throw new AppError({
    message: "Validation failed",
    statusCode: 400,
    code: ERROR_CODES.VALIDATION_ERROR,
    meta: {
        fields: ["email", "phone"],
        reason: "Both fields cannot be empty",
    },
});
```

---

## Error Codes Reference

### Complete Error Code Table

| Error Code | HTTP Status | Category | Backend Message | Frontend Message |
|------------|-------------|----------|-----------------|------------------|
| `VALIDATION_ERROR` | 400 | Validation | Please check your input and try again. | Please check your inputs. |
| `INVALID_INPUT` | 400 | Validation | One or more fields are invalid. | Invalid input data. |
| `BAD_REQUEST` | 400 | Validation | The request was invalid. | Invalid request. |
| `RESOURCE_NOT_FOUND` | 404 | Business | The requested resource could not be found. | The item you are looking for does not exist. |
| `DUPLICATE_RESOURCE` | 409 | Business | This item already exists. | This item already exists. |
| `METHOD_NOT_ALLOWED` | 405 | Business | This action is not allowed. | Action not allowed. |
| `UNAUTHORIZED` | 401 | Security | Please sign in to continue. | You are not logged in. |
| `FORBIDDEN` | 403 | Security | You do not have permission to perform this action. | You do not have permission to do this. |
| `TOKEN_EXPIRED` | 401 | Security | Your session has expired. Please sign in again. | Session expired. Please login again. |
| `INVALID_TOKEN` | 401 | Security | Invalid session. Please sign in again. | Invalid session. |
| `INTERNAL_SERVER_ERROR` | 500 | Internal | Something went wrong on our end. Please try again later. | Something went wrong. Please try again. |
| `DATABASE_ERROR` | 500 | Internal | We encountered a temporary issue. Please try again. | Database issue. We are looking into it. |
| `TIMEOUT` | 408 | Internal | The request timed out. Please try again. | Request timed out. Please check your internet. |
| `SERVICE_UNAVAILABLE` | 503 | Internal | Service is currently unavailable. Please check back later. | Service is temporarily down. |

---

## Best Practices

### ✅ DOs

1. **Always use ERROR_CODES constants**
   ```typescript
   // ✅ Good
   throw new AppError({ code: ERROR_CODES.VALIDATION_ERROR, ... });
   
   // ❌ Bad
   throw new AppError({ code: "VALIDATION_ERROR", ... });
   ```

2. **Always wrap route handlers with try-catch**
   ```typescript
   export async function GET(req: Request) {
       try {
           // logic
       } catch (error) {
           return handleRouteError(error, "ContextName");
       }
   }
   ```

3. **Use meaningful context names**
   ```typescript
   // ✅ Good
   return handleRouteError(error, "CreateProduct");
   return handleRouteError(error, "DeleteOrder");
   
   // ❌ Bad
   return handleRouteError(error, "Error");
   return handleRouteError(error, "API");
   ```

4. **Set isOperational correctly**
   ```typescript
   // Business logic error (expected)
   new AppError({ isOperational: true, ... });
   
   // System error (unexpected) - rarely used manually
   new AppError({ isOperational: false, ... });
   ```

5. **Use apiClient in frontend**
   ```typescript
   // ✅ Good - Automatic error handling
   const data = await apiClient("/api/products");
   
   // ❌ Bad - Manual error handling everywhere
   const res = await fetch("/api/products");
   const json = await res.json();
   if (!json.success) { toast.error(...) }
   ```

### ❌ DON'Ts

1. **Don't expose stack traces to client**
   ```typescript
   // ❌ Bad - Never do this
   return Response.json({ error: error.stack });
   ```

2. **Don't create new error codes without updating all maps**
   ```typescript
   // If adding new code, update:
   // 1. errorCodes.ts
   // 2. errorMessages.ts
   // 3. error-map.ts (frontend)
   ```

3. **Don't ignore errors**
   ```typescript
   // ❌ Bad
   } catch (error) {
       return Response.json({ success: false });
   }
   
   // ✅ Good
   } catch (error) {
       return handleRouteError(error, "Context");
   }
   ```

---

## Troubleshooting

### Common Issues

#### 1. "Unknown error code" in toast

**Problem:** Frontend shows "An unexpected error occurred."

**Solution:** Make sure the error code exists in `error-map.ts`:
```typescript
// Add missing code in error-map.ts
export const ERROR_UI_MAP = {
    // ... existing codes
    [ERROR_CODES.NEW_ERROR_CODE]: "User friendly message",
};
```

#### 2. Yellow vs Red terminal logs

| Color | Meaning | Action |
|-------|---------|--------|
| Yellow | Operational Error (Expected) | Normal - validation, auth failures, etc. |
| Red | System Error (Unexpected) | Investigate immediately - database down, null references, etc. |

#### 3. Error not showing proper HTTP status

**Check:** AppError is being thrown with correct statusCode:
```typescript
throw new AppError({
    statusCode: 404,  // Must be valid HTTP status
    // ...
});
```

#### 4. TypeScript error on error code

**Problem:** `Argument of type '"NEW_CODE"' is not assignable...`

**Solution:** Add the code to `errorCodes.ts` first:
```typescript
export const ERROR_CODES = {
    // ...
    NEW_CODE: "NEW_CODE",
} as const;
```

---

## Supported API Routes Using This System

The following API routes implement the error handling system:

- `/api/v1/products/route.ts`
- `/api/v1/products/[id]/route.ts`
- `/api/v1/products/add-product/route.ts`
- `/api/v1/orders/route.ts`
- `/api/v1/categories/route.ts`
- `/api/v1/categories/[id]/route.ts`
- `/api/v1/admin/stats/route.ts`
- `/api/auth/register/route.ts`
- `/api/db/route.ts`

---

## Summary

PC-Bazar का error handling system एक **layered architecture** है:

1. **`errorCodes.ts`** - Single source of truth for all error codes
2. **`AppError.ts`** - Type-safe custom error class
3. **`errorMessages.ts`** - Backend user-friendly messages
4. **`handleRouteError.ts`** - Central error handler with logging
5. **`error-map.ts`** - Frontend user-friendly messages
6. **`api-client.ts`** - Automatic error handling and toast notifications

यह system ensure करता है कि:
- Developers को terminal में detailed logs मिलें
- Users को sensitive information expose न हो
- सभी API routes consistent error format return करें
- Frontend में automatic toast notifications हों

---

*Documentation maintained by PC-Bazar Development Team*
