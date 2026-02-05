# Error Handling Quick Reference Guide

## Import Statement
```typescript
import {
    handleRouteError,
    UnauthorizedError,
    ForbiddenError,
    ValidationError,
    ResourceNotFoundError,
    DuplicateResourceError,
    DatabaseError,
} from "@/lib/errors";
```

## Common Patterns

### 1. Authentication Check
```typescript
const session = await getServerSession(authOptions);
if (!session?.user?.email) {
    throw new UnauthorizedError("Please login to access this resource");
}
```

### 2. Authorization Check (Admin Only)
```typescript
// @ts-ignore
if (!session || session.user?.role !== "ADMIN") {
    throw new ForbiddenError("Admin access required");
}
```

### 3. Input Validation
```typescript
const { field1, field2 } = await req.json();

if (!field1 || !field2) {
    throw new ValidationError("field1 and field2 are required", {
        required: ["field1", "field2"]
    });
}
```

### 4. Resource Not Found
```typescript
const resource = await Model.findById(id);

if (!resource) {
    throw new ResourceNotFoundError("ResourceName");
}
```

### 5. Duplicate Resource
```typescript
const existing = await Model.findOne({ uniqueField: value });

if (existing) {
    throw new DuplicateResourceError("ResourceName with this field");
}
```

### 6. Database Operations Wrapper
```typescript
try {
    const result = await Model.operation();
    
    if (!result) {
        throw new ResourceNotFoundError("Resource");
    }
    
    return Response.json({ data: result }, { status: 200 });
} catch (dbError) {
    // Preserve custom errors
    if (dbError instanceof ResourceNotFoundError) {
        throw dbError;
    }
    // Wrap DB errors
    throw new DatabaseError("Failed to perform operation", {
        originalError: dbError
    });
}
```

### 7. Complete Route Template
```typescript
export async function METHOD(req: Request) {
    try {
        // 1. Auth Check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new UnauthorizedError("Login required");
        }

        // 2. Parse Input
        const body = await req.json();
        const { field1, field2 } = body;

        // 3. Validate Input
        if (!field1) {
            throw new ValidationError("field1 is required");
        }

        // 4. DB Connection
        await dbConnect();

        // 5. DB Operations (wrapped)
        try {
            const result = await Model.findByIdAndUpdate(id, { field1, field2 });
            
            if (!result) {
                throw new ResourceNotFoundError("Resource");
            }
            
            return Response.json(
                { message: "Success", data: result },
                { status: 200 }
            );
        } catch (dbError) {
            if (dbError instanceof ResourceNotFoundError) {
                throw dbError;
            }
            throw new DatabaseError("Operation failed", { originalError: dbError });
        }
    } catch (error) {
        return handleRouteError(error, "METHOD /api/your/path");
    }
}
```

## Error Class Reference

| Error Class | Status Code | Use When | Example |
|------------|-------------|----------|---------|
| `ValidationError` | 400 | Invalid input, missing fields | `throw new ValidationError("Email required")` |
| `UnauthorizedError` | 401 | No auth session | `throw new UnauthorizedError("Login required")` |
| `ForbiddenError` | 403 | Valid session but insufficient permissions | `throw new ForbiddenError("Admin only")` |
| `ResourceNotFoundError` | 404 | Resource doesn't exist | `throw new ResourceNotFoundError("User")` |
| `DuplicateResourceError` | 409 | Unique constraint violation | `throw new DuplicateResourceError("Email")` |
| `DatabaseError` | 500 | DB operation failed | `throw new DatabaseError("Save failed")` |

## DO's and DON'Ts

### ✅ DO
- Always use `handleRouteError` in the outermost catch
- Include context string in `handleRouteError`: `"METHOD /full/api/path"`
- Wrap DB operations in try-catch
- Use specific error classes
- Re-throw custom errors from DB wrapper
- Add validation before DB calls

### ❌ DON'T
- Use `console.log` or `console.error`
- Manually construct `NextResponse.json` for errors
- Use generic `AppError` (use specialized classes)
- Catch errors without re-throwing or wrapping
- Skip input validation
- Mix frontend and backend error handling

## Validation Patterns

### Email Validation
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format");
}
```

### Password Strength
```typescript
if (password.length < 6) {
    throw new ValidationError("Password must be at least 6 characters");
}
```

### Required Fields
```typescript
const required = ["name", "email", "phone"];
const missing = required.filter(field => !body[field]);

if (missing.length > 0) {
    throw new ValidationError("Missing required fields", {
        missing: missing
    });
}
```

### At Least One Field
```typescript
if (!field1 && !field2 && !field3) {
    throw new ValidationError("At least one field must be provided");
}
```

## Testing Error Handling

### Unit Test Example
```typescript
describe("ResourceNotFoundError", () => {
    it("should have status 404", () => {
        const error = new ResourceNotFoundError("User");
        expect(error.statusCode).toBe(404);
    });
    
    it("should have correct message", () => {
        const error = new ResourceNotFoundError("Product");
        expect(error.message).toBe("Product not found");
    });
});
```

### Integration Test Example
```typescript
it("should return 401 for unauthorized access", async () => {
    const response = await fetch("/api/protected", {
        method: "GET"
    });
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error.code).toBe("UNAUTHORIZED");
});
```

## Debugging Tips

1. **Check terminal output**: Errors are color-coded
   - 🟡 Yellow = Operational error (user's fault)
   - 🔴 Red = System error (our fault)

2. **Look for context**: Error logs include the route context
   ```
   [2024-02-05T12:00:00.000Z] OPERATIONAL ERROR
   CONTEXT: GET /api/user/addresses
   MESSAGE: Please login to view addresses
   ```

3. **Check error code**: Frontend receives error.code for handling
   ```json
   {
       "success": false,
       "error": {
           "code": "UNAUTHORIZED",
           "message": "Please login to access this resource"
       }
   }
   ```

4. **Stack traces**: Only system errors (500) show stack traces in logs

## Migration Checklist

When creating new routes:
- [ ] Import error classes from `@/lib/errors`
- [ ] Wrap entire route in try-catch
- [ ] Use `handleRouteError` in catch block
- [ ] Use specialized error classes (not generic AppError)
- [ ] Wrap DB operations in nested try-catch
- [ ] Add input validation before DB calls
- [ ] Include meaningful context in `handleRouteError`
- [ ] Test error responses with unit tests

## Questions?

Refer to:
- Full documentation: `/ERROR_HANDLING_REFACTORING_REPORT.md`
- Error class definitions: `/src/lib/errors/specialized-errors.ts`
- Central handler: `/src/lib/errors/handleRouteError.ts`
