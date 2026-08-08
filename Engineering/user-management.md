# Implement Mobile-App User Management in RoloStay Admin Panel

Analyze the existing `RoloStay` project and implement a complete, production-safe **Mobile User Management module** in both:

```text
roloServer
roloAdmin
```

Do not stop after giving a design or implementation plan. Implement the backend, admin-panel interface, validation, permissions, audit logs, and tests.

The module must be user-friendly, responsive, accessible, and easy for administrators to understand.

---

## Core clarification

The users managed by this module are **residents/customers who use the RoloStay mobile application**.

They log in using:

```text
Mobile number + OTP
```

They do not have passwords.

The module must not provide:

* Create password.
* Change password.
* Reset password.
* Staff login management.
* Admin-account management.
* PG-manager-account management.
* Resident-to-admin promotion.
* Resident-to-PG-manager promotion.

Admin and PG-manager staff accounts must continue to be managed separately using the existing staff-management module.

---

# 1. Objective

Create a new **Mobile Users** section in the RoloStay admin panel.

Administrators must be able to:

* View all mobile-app users.
* Search users by name, mobile number, or user ID.
* Filter users by account status, PG, booking status, login status, and registration date.
* Open a user-details page.
* View the resident’s profile information.
* View their current PG, room, and bed.
* View booking and rental-agreement information.
* View their last successful OTP login.
* View their active mobile-device sessions.
* Revoke one mobile-device session.
* Log the user out from every mobile device.
* Block the user from logging into the mobile application.
* Reactivate a blocked user.
* View safe login and account activity.
* View when the account was created and last updated.

PG managers may:

* View only residents connected to their actively assigned PGs.
* View basic resident, booking, and accommodation information.
* View account status, last login, and active-session count.

PG managers must not:

* Block or reactivate users.
* Log users out.
* Revoke sessions.
* View detailed device information.
* View detailed login-security history.
* Access users belonging only to unassigned PGs.

---

# 2. Existing mobile authentication

Reuse the existing mobile OTP authentication flow.

The mobile application uses endpoints similar to:

```http
POST /api/v1/auth/otp/send
POST /api/v1/auth/otp/resend
POST /api/v1/auth/otp/verify
POST /api/v1/auth/token/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/logout-all
```

Do not create a separate authentication system.

Do not add password-based authentication for residents.

The admin interface must clearly display:

```text
This resident signs in to the RoloStay mobile app using an OTP sent to their registered mobile number.
```

---

# 3. Mobile-user account rules

Only return users matching:

```text
accountType = customer
role = resident
```

Do not display the following accounts in this module:

```text
admin
pg_manager
staff
```

Never allow this module to change a resident into:

```text
admin
pg_manager
```

Do not hard-delete mobile users.

Supported user statuses:

```text
active
blocked
deleted
```

Rules:

* `active`: The user can request and verify OTPs.
* `blocked`: The user cannot log in or refresh a session.
* `deleted`: Historical record only and read-only in the admin panel.
* A deleted user cannot be reactivated through this module.
* Blocking or reactivating a user must not change booking or rental-agreement records.

---

# 4. Permissions

Reuse the existing permission system.

Add or use:

```ts
USER_READ_ANY: 'user:read:any'
USER_READ_ASSIGNED: 'user:read:assigned'
USER_BLOCK_ANY: 'user:block:any'
USER_SESSION_MANAGE_ANY: 'user:session:manage:any'
USER_LOGIN_ACTIVITY_READ_ANY: 'user:login-activity:read:any'
```

Assign permissions:

```text
admin:
- USER_READ_ANY
- USER_BLOCK_ANY
- USER_SESSION_MANAGE_ANY
- USER_LOGIN_ACTIVITY_READ_ANY

pg_manager:
- USER_READ_ASSIGNED
```

Every endpoint must use the existing:

```text
authenticateAdmin
requirePasswordChanged
authorize
```

Backend permission checks are mandatory. Do not rely only on hiding frontend buttons.

---

# 5. PG-manager access scope

For a PG manager, derive assigned PGs using the existing active staff assignments.

A mobile user is visible to a PG manager only when that user has at least one booking or rental agreement connected to an actively assigned PG.

Possible relationship sources include:

```text
BookingModel.userId
BookingModel.pgId

RentalAgreementModel.residentId
RentalAgreementModel.pgId
```

Rules:

* Never trust a PG relationship supplied by the frontend.
* Resolve the relationship server-side.
* Intersect requested PG filters with the manager’s assigned PG IDs.
* Return an empty list when the manager has no active PG assignment.
* Return `404` when a manager requests an out-of-scope user directly.
* Only include bookings and agreements belonging to assigned PGs.
* Do not reveal that an out-of-scope user exists.

---

# 6. Backend module

Create:

```text
roloServer/src/modules/users/mobile-user-management/mobile-user.repository.ts
roloServer/src/modules/users/mobile-user-management/mobile-user.service.ts
roloServer/src/modules/users/mobile-user-management/mobile-user.controller.ts
roloServer/src/modules/users/mobile-user-management/mobile-user.validator.ts
roloServer/src/modules/users/mobile-user-management/mobile-user.routes.ts
```

Mount under:

```text
/api/v1/admin/mobile-users
```

Follow the existing project conventions for:

* Express.
* TypeScript ESM.
* Zod.
* Services and repositories.
* Response formatting.
* `AppError`.
* Error codes.
* Authentication.
* Permissions.
* Transactions.
* Audit logs.

Do not create duplicate admin-user routes.

If basic user-management routes already exist, refactor or reuse them rather than maintaining conflicting implementations.

---

# 7. List mobile users

Implement:

```http
GET /api/v1/admin/mobile-users
```

Query parameters:

```text
page
pageSize
search
pgId
status
profileCompleted
loginStatus
bookingStatus
agreementStatus
registeredFrom
registeredTo
lastLoginFrom
lastLoginTo
sortBy
sortOrder
```

Supported login-status filters:

```text
never_logged_in
currently_logged_in
no_active_session
```

Search must support:

* Resident name.
* Mobile number.
* Exact user ID.

Rules:

* Escape regular-expression search values.
* Normalize mobile numbers using the existing phone utility.
* Default page: `1`.
* Default page size: `20`.
* Maximum page size: `100`.
* Default sorting: newest registration first.
* Exclude staff accounts.
* Exclude deleted users unless explicitly filtered.
* Apply PG-manager access filtering before pagination.
* Avoid N+1 database queries.

Return:

```json
{
  "items": [
    {
      "id": "user-id",
      "name": "Ananya Rao",
      "maskedMobileNumber": "******3210",
      "status": "active",
      "profileCompleted": true,
      "lastLoginAt": "2026-07-30T08:30:00.000Z",
      "activeSessionCount": 2,
      "currentAccommodation": {
        "pg": {
          "id": "pg-id",
          "name": "RoloStay Koramangala"
        },
        "room": {
          "id": "room-id",
          "roomNumber": "A-101"
        },
        "bed": {
          "id": "bed-id",
          "bedNumber": "B1"
        }
      },
      "latestBooking": {
        "id": "booking-id",
        "bookingNumber": "RS-2026-0001",
        "status": "confirmed"
      },
      "createdAt": "2026-06-10T10:00:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 150,
  "totalPages": 8
}
```

Use masked mobile numbers in list responses.

---

# 8. Mobile-user details

Implement:

```http
GET /api/v1/admin/mobile-users/:userId
```

Return:

```json
{
  "id": "user-id",
  "name": "Ananya Rao",
  "maskedMobileNumber": "******3210",
  "phoneVerifiedAt": "2026-06-10T10:00:00.000Z",
  "status": "active",
  "profileCompleted": true,
  "avatarUrl": null,
  "lastLoginAt": "2026-07-30T08:30:00.000Z",
  "activeSessionCount": 2,
  "currentAccommodation": {
    "pg": {
      "id": "pg-id",
      "name": "RoloStay Koramangala"
    },
    "room": {
      "id": "room-id",
      "roomNumber": "A-101"
    },
    "bed": {
      "id": "bed-id",
      "bedNumber": "B1"
    }
  },
  "bookingSummary": {
    "total": 3,
    "active": 1
  },
  "agreementSummary": {
    "total": 1,
    "active": 1
  },
  "blockedAt": null,
  "blockReason": null,
  "createdAt": "2026-06-10T10:00:00.000Z",
  "updatedAt": "2026-07-30T08:30:00.000Z"
}
```

Do not return:

* OTP values.
* OTP hashes.
* Password hashes.
* Access tokens.
* Refresh tokens.
* Refresh-token hashes.
* Raw JWT IDs.
* Internal authentication secrets.
* Unfiltered audit metadata.

---

# 9. Update successful OTP login

When the resident successfully verifies an OTP in the mobile application:

1. Update the user’s `lastLoginAt`.
2. Create the mobile refresh session.
3. Create the successful-login audit record.
4. Store safe device metadata when available.
5. Perform the operations inside the existing transaction where possible.

Example safe device metadata:

```json
{
  "deviceName": "Ananya's iPhone",
  "platform": "ios",
  "deviceId": "safe-device-identifier"
}
```

Do not update `lastLoginAt` when:

* An OTP is requested.
* An OTP is resent.
* OTP verification fails.
* An access token is refreshed.
* An administrator views the user.

A blocked mobile user must not be able to:

* Request or complete login where the existing security policy permits checking.
* Verify an OTP.
* Refresh a session.
* Access protected mobile APIs.

Preserve generic authentication errors where required to prevent account enumeration.

---

# 10. Mobile-device sessions

Reuse the existing refresh-session storage.

Because refresh tokens rotate, multiple refresh-session records may belong to the same logical mobile login.

Group sessions using:

```text
userId
familyId
clientType
```

Treat one `familyId` as one mobile-device session.

Do not show every refresh-token rotation as a separate device.

A session is active when at least one record in the family is:

```text
clientType = mobile
revokedAt is absent
expiresAt > current time
```

Session statuses:

```text
active
revoked
expired
```

Calculate:

```text
firstSeenAt
lastSeenAt
expiresAt
deviceName
platform
status
revokeReason
```

---

# 11. View mobile sessions

Implement an admin-only endpoint:

```http
GET /api/v1/admin/mobile-users/:userId/sessions
```

Return:

```json
{
  "items": [
    {
      "sessionId": "session-family-id",
      "deviceName": "Ananya's iPhone",
      "platform": "ios",
      "firstSeenAt": "2026-07-20T08:00:00.000Z",
      "lastSeenAt": "2026-07-30T08:30:00.000Z",
      "expiresAt": "2026-08-29T08:30:00.000Z",
      "status": "active"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 2,
  "totalPages": 1
}
```

PG managers must not access detailed mobile-device sessions.

---

# 12. Revoke one mobile session

Implement:

```http
POST /api/v1/admin/mobile-users/:userId/sessions/:sessionId/revoke
```

Here, `sessionId` represents the refresh-token `familyId`.

Request:

```json
{
  "reason": "Resident reported a lost phone"
}
```

Requirements:

* Admin only.
* Validate that the session belongs to the selected resident.
* Revoke all unrevoked refresh-session records in that family.
* Do not expose sessions belonging to another user.
* Make repeated requests idempotent and understandable.
* Audit:

```text
ADMIN_MOBILE_USER_SESSION_REVOKED
```

Return:

```json
{
  "userId": "user-id",
  "sessionId": "session-family-id",
  "status": "revoked"
}
```

---

# 13. Log out from all mobile devices

Implement:

```http
POST /api/v1/admin/mobile-users/:userId/logout-all
```

Request:

```json
{
  "reason": "Resident requested account-security assistance"
}
```

Requirements:

* Admin only.
* Revoke all active `mobile` session families.
* Return the number of logical device sessions revoked.
* Do not affect staff `admin_web` sessions.
* Audit:

```text
ADMIN_MOBILE_USER_LOGOUT_ALL
```

Return:

```json
{
  "userId": "user-id",
  "revokedSessionCount": 3
}
```

The admin interface must explain:

```text
This will sign the resident out of the RoloStay mobile app on every device. The resident can sign in again using OTP unless the account is blocked.
```

---

# 14. Block mobile user

Implement:

```http
PATCH /api/v1/admin/mobile-users/:userId/status
```

Blocking request:

```json
{
  "status": "blocked",
  "reason": "Suspected account misuse"
}
```

Reactivation request:

```json
{
  "status": "active",
  "reason": "Identity verified by support"
}
```

Add optional user fields where appropriate:

```ts
blockedAt?: Date
blockedBy?: ObjectId
blockReason?: string
```

Blocking must:

1. Verify that the target is a customer/resident.
2. Set status to `blocked`.
3. Store the reason, time, and administrator.
4. Revoke every active mobile session.
5. Create an audit record.
6. Run atomically using a transaction where supported.

Blocking audit:

```text
MOBILE_USER_BLOCKED_BY_ADMIN
```

Reactivation audit:

```text
MOBILE_USER_REACTIVATED_BY_ADMIN
```

Rules:

* Blocking reason is required.
* Reason length: 5–500 characters.
* Reactivation must not restore old sessions.
* After reactivation, the user must log in again using mobile OTP.
* Blocking must not cancel bookings.
* Blocking must not modify rental agreements.
* Blocking must not remove payments or financial records.
* PG managers cannot perform this action.

---

# 15. Login activity

Implement an admin-only endpoint:

```http
GET /api/v1/admin/mobile-users/:userId/login-activity
```

Display safe events such as:

```text
OTP login successful
Mobile session refreshed
Logged out from mobile app
Logged out from all devices
Session revoked by administrator
All sessions revoked by administrator
Refresh-token reuse detected
Account blocked
Account reactivated
```

Return:

```json
{
  "items": [
    {
      "id": "activity-id",
      "type": "login_success",
      "label": "Signed in to the mobile app",
      "deviceName": "Ananya's iPhone",
      "platform": "ios",
      "occurredAt": "2026-07-30T08:30:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 12,
  "totalPages": 1
}
```

Do not return raw audit metadata.

Do not display:

* OTP values.
* Authentication tokens.
* Token hashes.
* Raw IP addresses.
* IP hashes as physical locations.
* Internal JWT information.

---

# 16. Admin frontend module

Create:

```text
roloAdmin/src/modules/mobile-users/mobile-users-api.js
roloAdmin/src/modules/mobile-users/mobile-user-list.page.jsx
roloAdmin/src/modules/mobile-users/mobile-user-details.page.jsx
roloAdmin/src/modules/mobile-users/mobile-user-overview.jsx
roloAdmin/src/modules/mobile-users/mobile-user-sessions.jsx
roloAdmin/src/modules/mobile-users/mobile-user-activity.jsx
roloAdmin/src/modules/mobile-users/mobile-user-status-dialog.jsx
roloAdmin/src/modules/mobile-users/mobile-users.css
```

Use the existing:

```text
apiClient
React
React Router
existing CSS conventions
existing permission system
```

Do not add:

```text
Axios
Redux
Zustand
```

---

# 17. Admin routes

Add:

```text
/mobile-users
/mobile-users/:userId
```

Navigation label:

```text
Mobile Users
```

Optional subtitle:

```text
Manage residents who use the RoloStay mobile app.
```

Allow:

```text
admin
pg_manager
```

The frontend must adapt to permissions.

---

# 18. Mobile-user list UI

Page heading:

```text
Mobile Users
Manage residents, mobile logins, and account access.
```

Filters:

* Search by name or mobile number.
* PG.
* Account status.
* Profile completion.
* Login status.
* Booking status.
* Agreement status.
* Registration date.
* Last-login date.
* Sort order.
* Clear filters.

Columns:

```text
Resident
Mobile Number
Account Status
Profile
PG / Room / Bed
Booking
Last Mobile Login
Active Devices
Registered On
Actions
```

Actions:

```text
View details
Block user
Reactivate user
Log out all devices
```

Only admins see mutation actions.

Use friendly empty values:

```text
Never logged in
No active mobile sessions
No active booking
Not currently residing
Profile incomplete
```

Requirements:

* Responsive layout.
* Loading state.
* Empty state.
* Error state.
* Pagination.
* Accessible labels.
* Search debounce.
* URL-based filters.
* Prevent duplicate submissions.
* Disable buttons while saving.
* Do not communicate status using color only.

---

# 19. Mobile-user details UI

The details page must contain:

## Resident overview

Show:

* Name.
* Masked mobile number.
* Mobile-number verification status.
* Profile completion.
* Account status.
* Registration date.
* Last successful mobile login.
* Active mobile-device count.
* Current PG.
* Room.
* Bed.
* Booking summary.
* Rental-agreement summary.
* Blocking reason when blocked.

Display:

```text
This resident logs in to the RoloStay mobile app using an OTP sent to their registered mobile number. Resident accounts do not use passwords.
```

## Mobile devices

Admin only.

Columns:

```text
Device
Platform
First Login
Last Active
Session Expiry
Status
Action
```

Action:

```text
Revoke session
```

## Login activity

Admin only.

Show a readable activity timeline.

## PG-manager view

PG managers see only:

* Basic resident details.
* Account status.
* Last-login time.
* Active-session count.
* Assigned-PG booking and accommodation context.

They must not see:

* Detailed devices.
* Session IDs.
* Revoke buttons.
* Login-security history.
* Block/reactivate buttons.
* Logout-all button.
* Information about unassigned PGs.

---

# 20. Confirmation dialogs

Use accessible confirmation dialogs rather than only `window.confirm()`.

## Block user

Display:

```text
Blocking this user immediately signs them out of the RoloStay mobile app on all devices. They will not be able to sign in using OTP until the account is reactivated.
```

Require a reason.

## Reactivate user

Display:

```text
The resident will be able to request a new OTP and sign in again. Previously revoked mobile sessions will remain revoked.
```

## Log out all devices

Display:

```text
This signs the resident out of the RoloStay mobile app on every device but does not block the account.
```

## Revoke one device

Display the device name and platform.

Dialogs must support:

* Focus management.
* Escape key.
* Cancel action.
* Loading state.
* Inline error.
* Duplicate-submit protection.

---

# 21. User-friendly errors

Use clear messages:

```text
Mobile user was not found.
You do not have access to this resident.
This account is already blocked.
This account is already active.
Deleted accounts cannot be reactivated.
The selected mobile session was not found.
This mobile session has already been revoked.
You do not have permission to manage mobile sessions.
A reason is required when blocking a user.
```

Use the existing response and error-code conventions.

---

# 22. Tests

Add tests for at least:

1. Admin can list mobile-app users.
2. Admin and PG-manager staff accounts are excluded.
3. Search by resident name works.
4. Search by mobile number works.
5. Account-status filtering works.
6. Login-status filtering works.
7. PG manager sees users connected to assigned PGs.
8. PG manager cannot see users outside assigned PGs.
9. PG manager receives `404` for an out-of-scope user.
10. PG manager cannot block a user.
11. PG manager cannot revoke mobile sessions.
12. Successful OTP verification updates `lastLoginAt`.
13. Failed OTP verification does not update `lastLoginAt`.
14. A blocked user cannot complete OTP login.
15. A blocked user cannot refresh a mobile session.
16. Refresh-token rotations appear as one logical mobile session.
17. Active-session count uses distinct session families.
18. Admin can revoke one mobile-device session.
19. Admin can log a user out from all devices.
20. Blocking revokes all active mobile sessions.
21. Reactivation does not restore old sessions.
22. A reactivated user can sign in again with a new OTP.
23. Blocking does not change bookings.
24. Blocking does not change rental agreements.
25. Deleted users cannot be reactivated.
26. Mobile-user APIs never expose OTPs.
27. Mobile-user APIs never expose access or refresh tokens.
28. Mobile-user APIs never expose token hashes.
29. Residents cannot be promoted to staff through this module.
30. Audit records are created for account and session actions.
31. Existing mobile-authentication tests remain passing.
32. Existing booking, PG, room, bed, and agreement tests remain passing.

Run:

```text
Server lint
Server build
Server tests
Admin lint
Admin build
Existing frontend tests
```

---

# 23. Constraints

* Manage only mobile-app resident/customer accounts.
* Residents authenticate only using mobile number and OTP.
* Do not add passwords for residents.
* Do not add password-reset functionality for residents.
* Do not manage admin or PG-manager accounts in this module.
* Do not permit resident-to-staff role changes.
* Reuse the existing user model.
* Reuse the existing OTP authentication flow.
* Reuse the existing refresh-session model.
* Reuse the existing audit-log model.
* Never expose OTP values or authentication tokens.
* Never hard-delete mobile users.
* Never modify bookings when blocking a user.
* Never modify rental agreements when blocking a user.
* Never allow PG managers outside their assigned PG scope.
* Never rely only on frontend authorization.
* Do not show refresh-token rotations as different devices.
* Do not add Axios, Redux, or Zustand.
* Follow the existing project architecture and coding conventions.

At completion, report:

* Existing code reused.
* Architecture decisions.
* Files created.
* Files modified.
* APIs created.
* Permission changes.
* Database changes.
* Indexes added.
* Session-grouping approach.
* Audit actions.
* Tests added.
* Commands executed.
* Build and test results.
* Manual verification instructions.
* Remaining limitations.
