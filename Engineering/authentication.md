# Implement Separate Password Authentication for RoloStay Admin

Analyze the existing project before making changes.

The repository contains:

```text
RoloStay/
├── roloServer/   # Express 5 + TypeScript + MongoDB/Mongoose backend
├── roloAdmin/    # React 19 + Vite admin website
└── roloApp/      # Customer mobile application
```

Implement the complete backend and frontend functionality. Do not only provide recommendations or pseudocode.

---

# Existing Project Architecture

The backend already contains:

* Customer phone OTP authentication
* JWT access and refresh tokens
* Refresh-token rotation and reuse detection
* `authenticate` middleware
* Permission-based `authorize` middleware
* MongoDB rate limiting
* Audit logging
* Existing roles:

  * `resident`
  * `pg_manager`
  * `admin`
* Existing admin user-management routes
* Existing `StaffAssignmentModel` for assigning users to PG properties
* Existing `PgModel`
* Existing `UserModel`
* Existing `AuthRepository` and `TokenService`

The frontend currently contains:

* React 19
* Vite
* A custom Fetch-based API client
* A boilerplate `GettingStartedPage`
* No routing library
* No authentication state

Follow the existing controller/service/repository/validator/routes structure and existing code style.

---

# Objective

Create separate authentication systems for customers and staff.

## Customer authentication

Keep the existing phone OTP flow unchanged:

```text
POST /api/v1/auth/otp/send
POST /api/v1/auth/otp/resend
POST /api/v1/auth/otp/verify
POST /api/v1/auth/token/refresh
POST /api/v1/auth/logout
```

Customer phone OTP authentication must continue working for the mobile application.

## Admin website authentication

The admin website must use username and password.

Both of these roles use the same admin login page:

* `admin` — represents the fixed super administrator
* `pg_manager` — created and managed by the admin

Do not introduce a new `super_admin` role. The existing `admin` role is the super administrator in this project.

Residents must never be allowed to log in through the admin authentication endpoints.

---

# Important Bootstrap Admin Requirement

There must be exactly one bootstrap `admin` account.

The admin username and password are fixed by the deployment operator, but they must not be hardcoded in:

* Backend source code
* Frontend source code
* Vite environment variables
* Git-tracked configuration files

Create the admin using a secure script that reads server-side environment variables:

```env
ADMIN_BOOTSTRAP_USERNAME=rolostay-admin
ADMIN_BOOTSTRAP_PASSWORD=replace-with-a-strong-secret
```

The script must:

1. Normalize the username to lowercase.
2. Hash the password using Argon2id.
3. Store only the password hash.
4. Create the account with role `admin`.
5. Mark it as a staff account.
6. Be idempotent.
7. Never print the raw password.
8. Fail safely if another admin account already exists.
9. Never overwrite an existing admin password unless an explicit reset option is used.

Replace the current phone-promotion behavior in:

```text
roloServer/scripts/create-admin.ts
```

Keep the existing npm command:

```bash
npm run admin:create
```

The new script should create the username/password admin instead of promoting a phone OTP user.

The admin account must not be creatable or deletable through the frontend.

---

# Backend Changes — `roloServer`

## 1. Dependencies

Add the required backend dependencies:

```text
argon2
cookie-parser
```

Add the corresponding TypeScript type dependency for `cookie-parser` when necessary.

Use Argon2id for password hashing.

---

# 2. Extend the Existing User Model

Modify:

```text
roloServer/src/modules/users/user.model.ts
```

Use the existing `User` collection for residents, admins, and PG managers. Do not create an unrelated second user system.

Add fields similar to:

```ts
accountType: 'customer' | 'staff'

username?: string
passwordHash?: string
email?: string

mustChangePassword: boolean
passwordChangedAt?: Date
lastLoginAt?: Date
```

Requirements:

* Existing users should default to `accountType: 'customer'`.
* OTP-created users must be customer accounts.
* Password-created admins and PG managers must be staff accounts.
* `username` must be normalized, lowercase, trimmed, and unique.
* Use a partial unique index so multiple customer users without usernames are allowed.
* Keep phone-number uniqueness working for customer accounts.
* `passwordHash` must use `select: false`.
* Never return `passwordHash` from services or APIs.
* Update `UserService.toPublicUser()` so it safely supports staff users without a customer phone number.
* Return staff-safe fields such as username, email, name, role, status, and `mustChangePassword`.
* Existing customer API response compatibility must be preserved.

Do not require staff users to have a customer OTP phone number.

Optionally store staff contact information separately from the customer login phone number.

---

# 3. Preserve Customer OTP Isolation

Update the customer OTP repository/service logic so that:

* OTP login only finds or creates `accountType: 'customer'` users.
* A staff username/password account cannot log in through the customer OTP endpoints.
* A resident cannot log in through the admin password endpoints.
* Existing customer OTP API contracts remain unchanged.

Do not break the current mobile authentication flow.

---

# 4. Admin JWT Separation

The current JWT audience is intended for the mobile application.

Add a separate admin-web JWT audience:

```env
ADMIN_JWT_AUDIENCE=pg-admin-web
```

Admin website access and refresh tokens must use the admin audience.

Refactor the existing token infrastructure so that:

* Customer tokens continue using the existing mobile audience.
* Admin website tokens use `ADMIN_JWT_AUDIENCE`.
* Admin middleware rejects mobile/customer tokens.
* Customer middleware rejects admin-web tokens.
* Refresh sessions record their client type, such as:

  * `mobile`
  * `admin_web`

Add a field to the existing refresh-session model when necessary:

```ts
clientType: 'mobile' | 'admin_web'
```

Do not duplicate the complete JWT and refresh-token implementation. Reuse or refactor the existing:

```text
AuthRepository
TokenService
RefreshSessionModel
refresh-token rotation logic
reuse-detection logic
```

---

# 5. Admin Authentication Middleware

Create admin-specific authentication middleware, for example:

```text
roloServer/src/common/middleware/authenticate-admin.ts
```

It must:

1. Validate the Bearer access token.
2. Validate the admin JWT audience.
3. Load the current user from MongoDB.
4. Require `accountType = staff`.
5. Require role `admin` or `pg_manager`.
6. Require status `active`.
7. Use the current database role rather than trusting only the JWT role.
8. Populate the existing request authentication context.

Use:

* `401` for missing, invalid, or expired authentication.
* `403` for authenticated users without sufficient permissions.

---

# 6. Admin Authentication Module

Create a separate module, following the project structure:

```text
roloServer/src/modules/admin-auth/
├── admin-auth.controller.ts
├── admin-auth.repository.ts
├── admin-auth.routes.ts
├── admin-auth.service.ts
└── admin-auth.validator.ts
```

Mount it at:

```text
/api/v1/admin/auth
```

Do not place public login routes behind the existing protected `router.use(authenticate)` call.

## Login

```http
POST /api/v1/admin/auth/login
```

Request:

```json
{
  "username": "rolostay-admin",
  "password": "secure-password"
}
```

Requirements:

* Normalize the username.
* Find only active staff accounts with role `admin` or `pg_manager`.
* Select `passwordHash` explicitly.
* Verify the password using Argon2id.
* Return a generic invalid-credentials response for unknown usernames and wrong passwords.
* Do not reveal whether the username exists.
* Record successful and failed login audit events.
* Update `lastLoginAt`.
* Create an admin-web access token and rotating refresh session.
* Return the access token in JSON.
* Set the refresh token in an HttpOnly cookie.
* Never return the admin refresh token in JSON.

Response format must follow the existing response envelope:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "username": "rolostay-admin",
      "name": "RoloStay Admin",
      "role": "admin",
      "status": "active",
      "mustChangePassword": false
    },
    "accessToken": "access-token",
    "accessTokenExpiresIn": 900
  }
}
```

## Refresh

```http
POST /api/v1/admin/auth/refresh
```

Requirements:

* Read the refresh token from the HttpOnly cookie.
* Do not accept the admin refresh token in the JSON request body.
* Verify that it belongs to an `admin_web` session.
* Perform the existing refresh-token rotation.
* Detect refresh-token reuse.
* Set the replacement refresh token in the cookie.
* Return the new access token and expiration.
* Optionally return the current user to simplify frontend session restoration.

## Current user

```http
GET /api/v1/admin/auth/me
```

Return the authenticated staff user and their assigned PG properties.

## Logout

```http
POST /api/v1/admin/auth/logout
```

Requirements:

* Revoke the current refresh-token family.
* Clear the refresh-token cookie.
* Clear it using exactly the same cookie path and attributes used when setting it.
* Return `204`.

## Change password

```http
POST /api/v1/admin/auth/change-password
```

Request:

```json
{
  "currentPassword": "current-password",
  "newPassword": "new-strong-password"
}
```

Requirements:

* Verify the current password.
* Validate password strength.
* Hash the new password with Argon2id.
* Set `mustChangePassword` to false.
* Set `passwordChangedAt`.
* Revoke all other refresh sessions for that user.
* Audit the password change.
* Never return either password.

---

# 7. Refresh Cookie Configuration

Add server-side environment configuration for the admin refresh cookie.

Example:

```env
ADMIN_REFRESH_COOKIE_NAME=rolostay_admin_refresh
ADMIN_REFRESH_COOKIE_SAME_SITE=lax
ADMIN_REFRESH_COOKIE_SECURE=false
ADMIN_REFRESH_COOKIE_PATH=/api/v1/admin/auth
```

Production requirements:

```text
HttpOnly: true
Secure: true
SameSite: Lax, unless deployment requires None
Path: /api/v1/admin/auth
```

For local HTTP development, allow `Secure=false`.

Do not use a `VITE_*` variable for cookie secrets or admin credentials.

The existing CORS configuration already supports credentials. Preserve it and add the admin frontend origin to:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Keep explicit origins. Do not use wildcard origins with credentialed requests.

Validate the request `Origin` for admin authentication state-changing endpoints where appropriate.

---

# 8. Admin Login Rate Limiting

Reuse the existing MongoDB rate-limit infrastructure.

Add admin login limits based on:

* Normalized username hash
* Request IP hash

Add environment variables similar to:

```env
ADMIN_LOGIN_USERNAME_LIMIT=5
ADMIN_LOGIN_USERNAME_WINDOW_SECONDS=900
ADMIN_LOGIN_IP_LIMIT=20
ADMIN_LOGIN_IP_WINDOW_SECONDS=900
```

Do not use the OTP-specific error code for password login limits.

Add appropriate error codes such as:

```text
INVALID_ADMIN_CREDENTIALS
ADMIN_LOGIN_RATE_LIMITED
PASSWORD_CHANGE_REQUIRED
```

Do not implement a permanent account lock that can easily be abused for denial of service.

---

# 9. PG Manager Management

Extend the existing admin module instead of creating a completely unrelated administration system.

Use the existing role:

```text
pg_manager
```

Use the existing:

```text
StaffAssignmentModel
```

for PG assignments.

Do not store an `assignedPgIds` array directly inside `UserModel`.

Add a permission such as:

```text
PG_MANAGER_MANAGE
```

Only role `admin` should receive this permission.

## Create PG manager

```http
POST /api/v1/admin/pg-managers
```

Request:

```json
{
  "name": "Manager Name",
  "username": "manager-one",
  "email": "manager@example.com",
  "temporaryPassword": "temporary-strong-password",
  "pgIds": ["pg-object-id-1", "pg-object-id-2"]
}
```

Requirements:

* Only `admin` can call this endpoint.
* Normalize and validate username and email.
* Require a strong temporary password.
* Hash the password using Argon2id.
* Create the account with:

  * `accountType: staff`
  * `role: pg_manager`
  * `status: active`
  * `mustChangePassword: true`
* Validate that every PG ID exists.
* Create active `StaffAssignment` documents with:

  * `role: manager`
  * `assignedBy` set to the admin user ID
* Use a MongoDB transaction for user creation and assignments.
* Never return the password or password hash.
* Audit the creation.

## List PG managers

```http
GET /api/v1/admin/pg-managers?page=1&pageSize=20&search=
```

Return:

* Manager details
* Account status
* `mustChangePassword`
* Assigned PG summaries
* Creation date
* Last login date

Support pagination and search by username, name, or email.

## Get PG manager

```http
GET /api/v1/admin/pg-managers/:managerId
```

## Update PG manager

```http
PATCH /api/v1/admin/pg-managers/:managerId
```

Allow updates to:

* Name
* Username
* Email

Do not allow changing the manager to the `admin` role.

## Replace PG assignments

```http
PUT /api/v1/admin/pg-managers/:managerId/pg-assignments
```

Request:

```json
{
  "pgIds": ["pg-object-id-1", "pg-object-id-2"]
}
```

Requirements:

* Validate all PG IDs.
* Add missing assignments.
* Reactivate assignments when appropriate.
* Deactivate or remove assignments no longer present.
* Perform the assignment update transactionally.
* Audit assignment changes.

## Reset manager password

```http
POST /api/v1/admin/pg-managers/:managerId/reset-password
```

Request:

```json
{
  "temporaryPassword": "new-temporary-password"
}
```

Requirements:

* Hash the password.
* Set `mustChangePassword: true`.
* Update `passwordChangedAt`.
* Revoke all manager refresh sessions.
* Audit the reset.
* Never return the password.

## Update manager status

```http
PATCH /api/v1/admin/pg-managers/:managerId/status
```

Request:

```json
{
  "status": "active"
}
```

or:

```json
{
  "status": "blocked"
}
```

When blocking a manager:

* Revoke all refresh sessions.
* Prevent future login and refresh.
* Mark active staff assignments inactive or ensure blocked managers cannot use them.
* Audit the action.

The API must not allow these endpoints to modify the fixed `admin` account.

---

# 10. PG Selection API

The project has a `PgModel` but currently does not have a suitable PG-list endpoint for the manager form.

Add:

```http
GET /api/v1/admin/pg-options
```

Only authenticated `admin` users may access it.

Return lightweight data:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "pg-id",
        "name": "RoloStay Koramangala",
        "locality": "Koramangala",
        "status": "active",
        "onboardingStatus": "published"
      }
    ]
  }
}
```

Do not return the full PG document when only selection data is required.

---

# 11. Protect Existing Admin Routes

The current project already has:

```text
GET   /api/v1/admin/users
PATCH /api/v1/admin/users/:userId/status
PATCH /api/v1/admin/users/:userId/role
```

Review these routes carefully.

Requirements:

* Use admin-web authentication for admin routes.
* Do not allow a manager to promote users.
* Do not allow anyone through the API to create another `admin`.
* Do not allow the fixed admin to demote or block itself.
* Do not allow residents to become admin through a generic role-update endpoint.
* Either restrict the generic role route to safe transitions or remove/deprecate it in favor of the dedicated PG-manager endpoints.
* Preserve audit logging.

---

# 12. PG Manager Data Scoping

A `pg_manager` must only access data for PG properties with an active `StaffAssignment`.

Create reusable authorization logic such as:

```text
requirePgAccess
getAssignedPgIds
assertPgAssignment
```

The backend must enforce this restriction.

Frontend menu hiding is not authorization.

When future or existing booking, resident, billing, inventory, or operations APIs are accessed by a PG manager, database queries must be restricted to assigned PG IDs.

The `admin` role may access all PG properties.

Do not consider the current broad role permission sufficient for PG-level isolation.

---

# Frontend Changes — `roloAdmin`

## 1. Dependencies

Add:

```text
react-router-dom
```

Do not replace the existing Fetch API client with Axios.

Do not add Redux or Zustand. React Context and a small module store are sufficient.

---

# 2. Admin API Client

Modify:

```text
roloAdmin/src/infrastructure/api/http-client.js
```

Preserve:

* Existing `ApiError`
* Request timeout
* Environment-based base URL
* Existing API logging
* JSON response parsing

Add:

* `credentials: 'include'`
* Access-token Authorization header
* JSON `Content-Type` handling
* One automatic retry after an eligible `401`
* A single shared refresh promise for simultaneous failed requests
* Protection against refresh loops
* No refresh attempt for:

  * Login endpoint
  * Refresh endpoint
  * Logout endpoint
  * Requests already retried
* No refresh after `403`
* Authentication clearing when refresh fails

Use the admin refresh endpoint:

```text
POST /admin/auth/refresh
```

The refresh cookie is automatically sent by the browser.

Do not read or store the refresh token in JavaScript.

---

# 3. Authentication Store

Create:

```text
roloAdmin/src/modules/auth/auth.store.js
```

Store in module memory:

```js
accessToken
accessTokenExpiresAt
user
```

Expose functions such as:

```js
getAccessToken()
setAccessToken()
clearSession()
getStoredUser()
setStoredUser()
```

Do not store the access token or refresh token in `localStorage`.

The refresh-token cookie will restore the session after page reload.

---

# 4. Authentication Context

Create:

```text
roloAdmin/src/modules/auth/auth.context.jsx
```

Expose:

```js
{
  user,
  isAuthenticated,
  isInitializing,
  login,
  logout,
  restoreSession,
  changePassword
}
```

On application startup:

1. Set `isInitializing` to true.
2. Call `/admin/auth/refresh`.
3. Store the returned access token in memory.
4. Load or use the returned current user.
5. Set authentication state.
6. Set `isInitializing` to false.

A failed refresh during startup should result in an unauthenticated state without an infinite redirect loop.

---

# 5. Admin Authentication API Module

Create:

```text
roloAdmin/src/infrastructure/api/admin-auth-api.js
```

Functions:

```js
loginAdmin({ username, password })
refreshAdminSession()
getCurrentAdmin()
logoutAdmin()
changeAdminPassword({ currentPassword, newPassword })
```

Correctly unwrap the existing backend response format:

```json
{
  "success": true,
  "data": {}
}
```

---

# 6. Login Page

Create:

```text
roloAdmin/src/modules/auth/admin-login.page.jsx
roloAdmin/src/modules/auth/auth.css
```

Route:

```text
/login
```

The page must include:

* Username input
* Password input
* Show/hide-password button
* Login button
* Loading state
* Field validation
* Generic invalid-credentials error
* Rate-limit error
* Disabled-account error
* Keyboard submission
* Accessible labels
* Responsive layout
* Premium RoloStay admin styling

After successful login:

* `admin` redirects to `/dashboard`
* `pg_manager` redirects to `/dashboard`
* A user with `mustChangePassword: true` redirects to `/change-password`

Do not add phone OTP controls to the admin login page.

---

# 7. Forced Password Change Page

Create:

```text
roloAdmin/src/modules/auth/change-password.page.jsx
```

Include:

* Current password
* New password
* Confirm new password
* Password-strength validation
* Loading state
* Error state

A manager with `mustChangePassword: true` should not access the rest of the dashboard until the password has been changed.

The backend must also enforce this requirement for protected administrative operations; do not rely only on the route redirect.

---

# 8. Routing

Modify:

```text
roloAdmin/src/app/App.jsx
```

Add React Router routes:

```text
/login
/change-password
/dashboard
/pg-managers
/pg-managers/new
/pg-managers/:managerId/edit
```

Create:

```text
roloAdmin/src/modules/auth/protected-route.jsx
roloAdmin/src/modules/auth/role-route.jsx
```

Rules:

* `/login` is public.
* Protected routes wait for authentication initialization.
* `/dashboard` allows `admin` and `pg_manager`.
* `/pg-managers/*` allows only `admin`.
* Authenticated users visiting `/login` should redirect appropriately.
* `pg_manager` must never see the PG-manager management menu.

Use the backend role value `admin`, but display it as “Super Admin” in the user interface.

---

# 9. Dashboard Layout

Create an initial reusable admin layout with:

* Sidebar
* Header
* Current user information
* Role label
* Logout button
* Responsive mobile navigation
* Main content outlet

Possible files:

```text
roloAdmin/src/common/layout/admin-layout.jsx
roloAdmin/src/common/layout/admin-layout.css
roloAdmin/src/modules/dashboard/dashboard.page.jsx
```

Admin navigation:

```text
Dashboard
PG Managers
Logout
```

PG manager navigation:

```text
Dashboard
Assigned PGs
Logout
```

A placeholder dashboard is acceptable, but it must show the authenticated user's role and assigned PGs.

---

# 10. PG Manager Frontend

Create:

```text
roloAdmin/src/modules/pg-managers/pg-manager-list.page.jsx
roloAdmin/src/modules/pg-managers/pg-manager-form.page.jsx
roloAdmin/src/modules/pg-managers/pg-manager-api.js
roloAdmin/src/modules/pg-managers/pg-managers.css
```

The admin must be able to:

* List PG managers
* Search PG managers
* Create a PG manager
* Edit manager name, username, and email
* Select one or more PG properties
* Replace PG assignments
* Reset a manager password
* Activate or block a manager
* See status badges
* See assigned PG names
* See last login
* See whether a password change is required

Include:

* Loading states
* Empty states
* API error states
* Confirmation before blocking
* Confirmation before resetting a password
* Client-side validation
* Accessible form labels

Do not display password hashes or refresh tokens.

Do not automatically display or log submitted temporary passwords after the request completes.

---

# Security Rules

Implement all of the following:

* Argon2id password hashing
* Generic invalid-login responses
* Username and IP rate limiting
* Secure HttpOnly refresh cookie
* Access token in browser memory only
* Refresh-token rotation
* Refresh-token reuse detection
* Separate admin JWT audience
* Audit logs for:

  * Login success
  * Login failure
  * Logout
  * Password change
  * Password reset
  * Manager creation
  * Manager status changes
  * PG assignment changes
* Server-side role authorization
* Server-side PG-assignment authorization
* Session revocation when a manager is blocked
* Session revocation after password reset
* No secrets in Vite environment variables
* No hardcoded production credentials
* No refresh token in localStorage or sessionStorage
* No raw passwords in logs
* No password hash in API responses

Do not implement SMS OTP for the admin website in this task.

---

# Required Environment Updates

Update:

```text
roloServer/.env.example
roloAdmin/.env.example
```

Server example additions:

```env
ADMIN_BOOTSTRAP_USERNAME=rolostay-admin
ADMIN_BOOTSTRAP_PASSWORD=replace-only-during-secure-seeding

ADMIN_JWT_AUDIENCE=pg-admin-web

ADMIN_REFRESH_COOKIE_NAME=rolostay_admin_refresh
ADMIN_REFRESH_COOKIE_SAME_SITE=lax
ADMIN_REFRESH_COOKIE_SECURE=false
ADMIN_REFRESH_COOKIE_PATH=/api/v1/admin/auth

ADMIN_LOGIN_USERNAME_LIMIT=5
ADMIN_LOGIN_USERNAME_WINDOW_SECONDS=900
ADMIN_LOGIN_IP_LIMIT=20
ADMIN_LOGIN_IP_WINDOW_SECONDS=900

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Never place the bootstrap password in `roloAdmin/.env`.

Keep:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

---

# Tests

Add backend tests for at least:

1. Admin bootstrap script creates an Argon2id-hashed admin.
2. Bootstrap script is idempotent.
3. Invalid admin credentials return a generic error.
4. Resident users cannot log in through admin login.
5. Staff users cannot use customer OTP authentication.
6. Active admin can log in.
7. Active PG manager can log in.
8. Blocked PG manager cannot log in.
9. Admin refresh token is stored in a cookie, not response JSON.
10. Admin refresh rotates the token.
11. Reusing an admin refresh token revokes the token family.
12. `pg_manager` cannot create another manager.
13. `admin` can create a manager.
14. Duplicate usernames return `409`.
15. Invalid PG IDs are rejected.
16. Manager creation and assignments are transactional.
17. Blocking a manager revokes sessions.
18. Resetting a password revokes sessions.
19. Manager cannot access an unassigned PG.
20. Existing customer OTP tests continue passing.

Frontend verification must include:

```bash
npm run lint
npm run build
```

Backend verification must include:

```bash
npm run lint
npm run build
npm test
```

Do not remove or weaken existing tests.

---

# Manual Verification

Provide exact instructions for:

1. Starting MongoDB with the project's replica-set configuration.
2. Creating the bootstrap admin.
3. Starting `roloServer`.
4. Starting `roloAdmin`.
5. Logging in as the fixed admin.
6. Creating a PG manager.
7. Assigning PG properties.
8. Logging out.
9. Logging in as the PG manager.
10. Forcing the manager to change the temporary password.
11. Confirming the manager only sees assigned PGs.
12. Blocking the manager.
13. Confirming the blocked manager can no longer refresh or log in.
14. Confirming customer phone OTP still works.

---

# Implementation Constraints

* Do not rewrite the backend architecture.
* Reuse existing repositories, services, token rotation, permissions, audit logging, and rate limiting.
* Do not replace Fetch with Axios.
* Do not add Redux or Zustand.
* Do not rename `admin` to `super_admin`.
* Do not add PG IDs directly to the user document.
* Use `StaffAssignmentModel`.
* Do not expose the admin refresh token to JavaScript.
* Do not modify `roloApp` unless required to preserve compatibility.
* Do not remove the existing customer OTP flow.
* Follow the existing TypeScript ESM import convention, including `.js` extensions.
* Follow the existing success and error response envelopes.
* Keep controllers thin and business logic inside services.
* Use Zod for every request body, route parameter, and query.
* Run formatting, linting, builds, and tests before completion.

---

# Final Deliverables

After implementation, provide:

1. A concise architecture summary.
2. Every file created.
3. Every file modified.
4. New dependencies added.
5. Environment variables added.
6. Database/index changes.
7. API endpoint documentation.
8. Example request and response payloads.
9. Commands used to create the bootstrap admin.
10. Manual testing steps.
11. Test results.
12. Any migration considerations for an existing phone-promoted admin account.

Do not stop after generating a plan. Implement the complete backend and frontend functionality.
