# API v1 Documentation

This document contains a backend-first, end-to-end explanation of the routes under `/src/app/api/v1`.

----------------------------------
📁 /src/app/api/v1:
🎯 Purpose:
- Namespace for the application's first-version HTTP API routes (v1). Groups admin, categories, orders, and products endpoints under a single API version.

🔁 Flow:
- Next.js routes map incoming HTTP requests whose path starts with `/api/v1` to the `route.ts` handlers inside these folders.
- Each handler typically: connects to DB, validates/authenticates, performs DB operations, and returns a normalized ApiResponse or an error via `handleRouteError`.

📥 Inputs:
- HTTP requests from frontend or other clients (GET/POST/PUT/DELETE), with query params, JSON bodies, and session cookies/headers for auth.

📤 Outputs:
- JSON `ApiResponse` objects for success or standardized error responses (via `ApiResponse.success` or `handleRouteError`).
- Status codes like 200/201/401/400/404/409 are used based on path logic.

🧠 Key Logic (plain English):
- This folder contains route handlers that:
  1. Ensure DB is connected (`connectDB`).
  2. Optionally check user session/role with `getServerSession(authOptions)`.
  3. Parse request data (URL search params or JSON body).
  4. Perform CRUD queries/aggregations on Mongoose models (`Category`, `Product`, `Order`, `User`).
  5. Return standardized responses with `ApiResponse.success` or delegate exceptions to `handleRouteError`.

⚠️ Important Conditions / Edge Cases:
- All handlers rely on `connectDB` being idempotent; changing connection logic may break all routes.
- Auth checks assume `session.user.role` exists and equals `"ADMIN"` for admin actions — missing or differently-shaped sessions will cause unauthorized errors.
- Many handlers soft-delete by setting `isActive=false`; consumers expect that pattern.
- Query param parsing uses defaults (page/limit); malformed numbers are parsed via `parseInt` without additional validation.

🧩 Dependencies:
- Imports across these routes commonly use:
  - `src/lib/db` (`connectDB`)
  - `src/lib/auth` (`authOptions`)
  - `src/lib/db/models/*` (`Category`, `Product`, `Order`, `User`)
  - `src/lib/utils/apiResponse` (`ApiResponse`)
  - `src/lib/errors/*` (`AppError`, `errorCodes`, `handleRouteError`)
  - `next-auth` `getServerSession`
- Frontend consumers: admin pages and public pages under `src/app` (e.g., admin dashboard, admin products/categories pages, public products/categories listing).

🧪 Safe to Modify?
- NO (overall folder-level): Changes here affect all API traffic; proceed cautiously.
- If yes: Safe changes are minor docs/comments or adding non-breaking query params handling. Avoid changing response shape, auth contract, or DB connection semantics.

----------------------------------
📁 /src/app/api/v1/admin/stats/route.ts:
🎯 Purpose:
- Provide aggregated admin dashboard statistics: user/product/order counts, pending orders, and total revenue.

🔁 Flow:
- Called by frontend admin dashboard `GET /api/v1/admin/stats`.
- Connects DB → validates session is ADMIN → performs counts and aggregation → returns totals.

📥 Inputs:
- HTTP GET request. Session context via next-auth cookies to `getServerSession(authOptions)`.

📤 Outputs:
- JSON object with `{ totalUsers, totalProducts, totalOrders, pendingOrders, totalRevenue }` returned via `ApiResponse.success`.

🧠 Key Logic (plain English):
1. `connectDB()`.
2. `getServerSession(authOptions)`; require `session.user.role === "ADMIN"`.
3. Use model counts:
   - `User.countDocuments()`
   - `Product.countDocuments({ isActive: true })`
   - `Order.countDocuments()`
   - `Order.countDocuments({ status: "PENDING" })`
4. Aggregate paid orders: sum `totalAmount` where `isPaid` true to compute `totalRevenue`.
5. Return the aggregated summary in success response.

⚠️ Important Conditions / Edge Cases:
- Assumes session exists and `session.user.role` is set; missing session → `AppError.UNAUTHORIZED`.
- Aggregation result may be empty; code handles that with `|| 0`.
- Uses `isPaid` to compute revenue; if data uses another flag, result will be wrong.
- Large collections may make counts and aggregation costly.

🧩 Dependencies:
- `src/lib/db` (`connectDB`)
- `src/lib/auth` (`authOptions`)
- `src/lib/db/models/order`, `product`, `user`
- `src/lib/utils/apiResponse`
- `src/lib/errors/*`

🧪 Safe to Modify?
- NO for logic changes (sensitive). Safe modifications: add additional fields with care, and keep auth/aggregation semantics intact.

----------------------------------
📄 /src/app/api/v1/categories/route.ts:
🎯 Purpose:
- Public and admin endpoints for category collection:
  - `POST` to create a category (admin only).
  - `GET` to list active categories (public).

🔁 Flow:
- `POST /api/v1/categories` → `connectDB` → auth check (ADMIN) → validate body → check duplicate slug → create `Category`.
- `GET /api/v1/categories` → `connectDB` → fetch `Category.find({ isActive: true })` sorted by `createdAt`.

📥 Inputs:
- `POST` body JSON: `{ name, slug }` (required).
- `GET` request: no body; public request.
- Session via next-auth for `POST`.

📤 Outputs:
- `POST`: created `Category` object in `ApiResponse` with 201 status.
- `GET`: array of active categories.

🧠 Key Logic (plain English):
1. `POST`:
   - `connectDB`
   - authenticate ADMIN
   - parse JSON body, require `name` & `slug`
   - `findOne({ slug })` to avoid duplicates
   - `Category.create({ name, slug, isActive: true })`
   - return success (201)
2. `GET`:
   - `connectDB`
   - find active categories, sort desc by `createdAt`
   - return list

⚠️ Important Conditions / Edge Cases:
- Duplicate slug → `AppError.DUPLICATE_RESOURCE` (409).
- Missing name/slug → `AppError.INVALID_INPUT` (400).
- `POST` requires `ADMIN` role; role mismatch → `UNAUTHORIZED`.
- Soft-delete pattern: categories have `isActive`; deleted categories are filtered out from `GET`.

🧩 Dependencies:
- `src/lib/db/models/category`
- `src/lib/db`
- `src/lib/auth`
- `src/lib/utils/apiResponse`
- `src/lib/errors/*`

🧪 Safe to Modify?
- YES (with caution). Safe changes: add more validation or optional fields; avoid changing slug uniqueness constraint or response contract without coordinating consumers.

----------------------------------
📄 /src/app/api/v1/categories/[id]/route.ts:
🎯 Purpose:
- Endpoint to delete (soft-delete) a single category by id (admin only).

🔁 Flow:
- `DELETE /api/v1/categories/:id` → `connectDB` → auth check (ADMIN) → find `Category` by id → set `isActive=false` → save → return id.

📥 Inputs:
- Route param `id` (from Next.js route params).
- Session via next-auth.

📤 Outputs:
- Success with `{ id }` when category soft-deleted.

🧠 Key Logic (plain English):
1. `connectDB`
2. extract `id` from params
3. authenticate ADMIN
4. `Category.findById(id)`; if not found or already inactive → 404 `AppError`
5. Set `category.isActive = false` and `save()`
6. Return success containing `id`

⚠️ Important Conditions / Edge Cases:
- If category not found or already inactive → `RESOURCE_NOT_FOUND` (404).
- This performs a soft-delete; consumers expect `isActive` flag rather than physical removal.
- Assumes `id` is a valid Mongo `ObjectId`; invalid `id` may cause DB error.

🧩 Dependencies:
- `src/lib/db/models/category`
- `src/lib/db`
- `src/lib/auth`
- `src/lib/errors/*`

🧪 Safe to Modify?
- NO for changing soft-delete semantics. YES for adding logging or audit fields, but coordinate with frontend expectations.

----------------------------------
📄 /src/app/api/v1/orders/route.ts:
🎯 Purpose:
- Handles listing orders (`GET`) and creating orders (`POST`).
- Admin can list all orders; regular users only see their own.

🔁 Flow:
- `GET /api/v1/orders?limit=&page=` → `connectDB` → session required → build query (all for ADMIN, user-only otherwise) → fetch with pagination and `populate` user → return list and total.
- `POST /api/v1/orders` → `connectDB` → session required → validate body `items`/`shippingAddress`/`totalAmount` → create `Order` with user id and default `PENDING`/`isPaid` false → return created order (201).

📥 Inputs:
- `GET` query params: `limit` (default 20), `page` (default 1).
- `POST` JSON body: `{ items, shippingAddress, totalAmount, paymentMethod }`.
- Session via next-auth for both methods.

📤 Outputs:
- `GET`: `{ orders, total, page, limit }`.
- `POST`: created `Order` object in `ApiResponse` with 201.

🧠 Key Logic (plain English):
1. `GET`:
   - `connectDB`
   - require session; if ADMIN -> `query = {}`; else `query = { user: session.user.id }`
   - parse pagination params and perform `Order.find(query)` with `populate("user", "name email")`, sort, skip, limit
   - count total matching documents and return them with pagination meta
2. `POST`:
   - `connectDB`
   - require session
   - parse and validate body (must have `items`, `shippingAddress`, `totalAmount`)
   - create new `Order` with user id (from session), status `PENDING`, `isPaid` false
   - return created order (201)

⚠️ Important Conditions / Edge Cases:
- Missing/invalid session → `UNAUTHORIZED`.
- Empty `items` or missing address/amount → `INVALID_INPUT` (400).
- No payment verification occurs here; `isPaid` set to false — payment handling likely elsewhere.
- Pagination uses `parseInt` without extra validation; negative/zero values could behave unexpectedly.

🧩 Dependencies:
- `src/lib/db/models/order`
- `src/lib/db/models/user` (populated)
- `src/lib/db`
- `src/lib/auth`
- `src/lib/utils/apiResponse`
- `src/lib/errors/*`

🧪 Safe to Modify?
- NO for behavioral changes (authorization, order creation fields). YES for non-breaking additions like extra optional order fields, but keep the auth contract stable.

----------------------------------
📁 /src/app/api/v1/products:
🎯 Purpose:
- Collection-level product endpoints: list products (`GET`) and create products (`POST`).
- Contains sub-endpoints for single product operations and a separate add-product route.

🔁 Flow:
- `GET /api/v1/products` → `connectDB` → parse filters (category, brand, sort) & pagination → query `Product` with `isActive:true` → populate `category` → return paginated response.
- `POST /api/v1/products` → admin-only create (similar to add-product route).
- Subfolders handle single product operations and an alternate `add-product` path.

📥 Inputs:
- `GET`: query params (`page`, `limit`, `category`, `brand`, `sortBy`, `order`).
- `POST`: product JSON body fields.
- Admin session for `POST`.

📤 Outputs:
- `GET`: `{ products, pagination }` where products have populated category.
- `POST`: created `Product` object (201).

🧠 Key Logic (plain English):
1. Build a base query `{ isActive: true }`.
2. Apply optional filters for category and brand.
3. Compute sort options and apply skip/limit for pagination.
4. Use `populate` to include category reference.
5. Return products plus pagination meta.

⚠️ Important Conditions / Edge Cases:
- Only active products returned; `isActive` toggles visibility.
- Filtering uses exact match strings for category/brand (not IDs coercion or partial matches).
- Sorting by arbitrary field from query; if clients pass invalid fields, behavior depends on Mongoose.

🧩 Dependencies:
- `src/lib/db/models/product`
- `src/lib/db/models/category`
- `src/lib/db`
- `src/lib/utils/apiResponse`
- `src/lib/errors/*`

🧪 Safe to Modify?
- NO for response contract or filtering semantics. YES for adding allowed filter fields or more validation.

----------------------------------
📄 /src/app/api/v1/products/add-product/route.ts:
🎯 Purpose:
- Admin-only endpoint to create a new product (very similar to `POST /api/v1/products`, but present as a separate route).

🔁 Flow:
- `POST /api/v1/products/add-product` → `connectDB` → auth ADMIN check → validate required fields → check slug duplicate → `Product.create` → return 201.

📥 Inputs:
- `POST` JSON: required fields include `name`, `slug`, `price`, `stock`, `category` (plus optional `description`, `images`, `specs`, etc.).
- Session via next-auth.

📤 Outputs:
- Created `Product` document via `ApiResponse` with 201 or error.

🧠 Key Logic (plain English):
1. `connectDB`
2. `getServerSession(authOptions)` and require `ADMIN` role
3. parse JSON and check required properties
4. check if slug already exists; if so throw `DUPLICATE_RESOURCE`
5. `Product.create` with provided fields
6. return created product

⚠️ Important Conditions / Edge Cases:
- Duplicate slug throws error (400 in this file; other product route uses 409).
- Required fields missing → `INVALID_INPUT` (400).
- Slight divergence in duplicate-status code vs other product creation path (watch for inconsistency).

🧩 Dependencies:
- `src/lib/db/models/product`
- `src/lib/db`
- `src/lib/auth`
- `src/lib/utils/apiResponse`
- `src/lib/errors/*`

🧪 Safe to Modify?
- NO for changing uniqueness/slug semantics. YES for harmonizing status codes or adding additional optional fields if you also coordinate consumers.

----------------------------------
📄 /src/app/api/v1/products/[id]/route.ts:
🎯 Purpose:
- Single-product endpoints: `GET` by id, `PUT` (update), `DELETE` (soft-delete). Admin required for update/delete; `GET` is public for active products.

🔁 Flow:
- `GET /api/v1/products/:id` → `connectDB` → `Product.findById(id).populate("category")` → check `isActive` → return product.
- `PUT /api/v1/products/:id` → `connectDB` → ADMIN auth → parse body → `Product.findByIdAndUpdate(id, body, { new: true, runValidators: true })` → return updated product.
- `DELETE /api/v1/products/:id` → `connectDB` → ADMIN auth → `Product.findByIdAndUpdate(id, { isActive: false }, { new: true })` → return id.

📥 Inputs:
- Route param `id`.
- `GET`: no body.
- `PUT`: JSON body with fields to update.
- `DELETE`: no body.
- Session for `PUT`/`DELETE`.

📤 Outputs:
- `GET`: single product object (if active).
- `PUT`: updated product object.
- `DELETE`: `{ deletedProductId: id }`.

🧠 Key Logic (plain English):
1. `GET`:
   - `connectDB`
   - find product by id and populate category
   - if not found or `!isActive` → 404
   - return product
2. `PUT`:
   - `connectDB`
   - require ADMIN
   - parse body
   - `findByIdAndUpdate` with validators and return new doc; 404 if not found
3. `DELETE`:
   - `connectDB`
   - require ADMIN
   - `findByIdAndUpdate` `isActive=false` and return id; 404 if not found

⚠️ Important Conditions / Edge Cases:
- `GET` enforces `isActive`; an admin may still want to see inactive products — current API doesn’t allow that.
- `PUT` uses `runValidators: true` — invalid update payload triggers validation errors.
- `DELETE` is soft-delete; data remains in DB.
- All operations assume valid `ObjectId`; malformed id may cause an exception routed to `handleRouteError`.

🧩 Dependencies:
- `src/lib/db/models/product`
- `src/lib/db`
- `src/lib/auth`
- `src/lib/utils/apiResponse`
- `src/lib/errors/*`

🧪 Safe to Modify?
- NO for auth and delete semantics. YES for minor validation tweaks or adding audit fields, but coordinate with consumers.

----------------------------------

# High-level system flow (backend-focused)
- Client/browser/admin UI → HTTP request to Next.js API path under `/api/v1` (e.g., `/api/v1/products`).
- Next.js matches folder `route.ts` → handler executes.
- Handler calls `connectDB()` to ensure a Mongo connection, often using Mongoose models (`Product`, `Category`, `Order`, `User`).
- For protected endpoints, handler calls `getServerSession(authOptions)` to resolve session and enforce role-based checks (ADMIN vs user).
- Handler executes Mongoose queries/aggregations, possibly populating refs.
- Handler wraps result using `ApiResponse.success` and returns JSON (or throws `AppError` for controlled errors).
- Errors bubble into `handleRouteError` which formats the error response.

# Core backend modules to understand first
- `src/lib/db` and models:
  - `src/lib/db/index.ts` (connect logic)
  - `src/lib/db/models/product.ts`
  - `src/lib/db/models/category.ts`
  - `src/lib/db/models/order.ts`
  - `src/lib/db/models/user.ts`
- Auth/session:
  - `src/lib/auth` (`authOptions` used with next-auth)
- Error handling and response shaping:
  - `src/lib/errors/AppError.ts`
  - `src/lib/errors/errorCodes.ts`
  - `src/lib/errors/handleRouteError.ts`
  - `src/lib/utils/apiResponse.ts`
- Route handlers:
  - The files documented above under `src/app/api/v1`.

# Suggested reading order (backend-first)
1. `src/lib/db` (connect logic).
2. `src/lib/db/models/*` (product/category/order/user) — schema shapes and fields used by routes.
3. `src/lib/auth` and NextAuth setup — session shape and role usage.
4. `src/lib/errors/*` and `src/lib/utils/apiResponse` — standardized error/response contract.
5. Each route file in `/src/app/api/v1` in this order:
   - `admin/stats/route.ts`
   - `categories/route.ts` and `categories/[id]/route.ts`
   - `products/route.ts`, `products/add-product/route.ts`, `products/[id]/route.ts`
   - `orders/route.ts`
6. Finally, scan frontend callers under `src/app` that call these endpoints to see how responses are consumed.

----------------------------------

This file was generated from an automated inspection of `src/app/api/v1` route handlers and the accompanying shared libraries. If you want this included in the main `README.md` instead, or want the next backend modules documented to append to this file, tell me which module to document next.
