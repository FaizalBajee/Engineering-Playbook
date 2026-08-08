## Implement Complete PG Management in RoloStay Admin

Analyze the existing repository before changing code, then implement the complete backend and admin frontend feature. Do not stop after producing a plan.

## Project context

The repository contains:

```text
RoloStay/
├── roloServer/   # Express 5 + TypeScript + MongoDB/Mongoose
└── roloAdmin/    # React 19 + Vite admin website
```

The project already contains:

- `CityModel` in `roloServer/src/modules/inventory/city.model.ts`
- `PgModel` in `roloServer/src/modules/inventory/pg.model.ts`
- `StaffAssignmentModel` for linking PG managers to PGs
- Roles: `resident`, `pg_manager`, and `admin`
- Admin authentication and protected admin routes
- Permission-based authorization
- Audit logging
- Zod request validation
- Standard success/error response envelopes
- A Fetch-based frontend API client
- City management implemented under `/api/v1/admin/cities`

Reuse the existing architecture. Do not create another PG model or collection.

## Existing PG model

The existing `PgModel` contains fields equivalent to:

```ts
{
  cityId,
  name,
  slug,
  description,
  address: {
    line1,
    line2,
    locality,
    landmark,
    postalCode
  },
  location: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  genderPolicy: 'male' | 'female' | 'unisex',
  amenities: string[],
  houseRules: string[],
  images: Array<{
    storageKey,
    url?,
    caption?,
    isCover,
    displayOrder
  }>,
  contact: {
    phoneNumber?,
    email?
  },
  onboardingStatus: 'draft' | 'review' | 'published' | 'archived',
  status: 'active' | 'inactive'
}
```

The existing unique index is:

```ts
{ cityId: 1, slug: 1 }
```

Therefore, slug uniqueness is scoped to a city, not globally.

## Objective

Build an admin PG-management feature that allows the `admin` role to:

- List and search PG properties
- Create a PG
- View PG details
- Edit a PG
- Change operational status
- Move a PG through onboarding states
- Manage amenities and house rules
- Manage image metadata
- View room, bed, manager, and occupancy summaries

A `pg_manager` may view only PGs assigned through active `StaffAssignment` records. A PG manager must not create, archive, publish, or reassign PG properties.

All authorization must be enforced by the backend.

## 1. Permissions

Update the permission constants with granular permissions such as:

```ts
PG_READ_ASSIGNED: 'pg:read:assigned'
PG_MANAGE: 'pg:manage'
PG_PUBLISH: 'pg:publish'
```

Recommended assignment:

- `admin`: all three permissions
- `pg_manager`: `PG_READ_ASSIGNED` only
- `resident`: none

Do not rely only on the broad existing `INVENTORY_MANAGE` permission because PG creation and publishing are administrator-level operations.

## 2. Backend module

Create files following the current controller/service/repository structure:

```text
roloServer/src/modules/inventory/pg.repository.ts
roloServer/src/modules/inventory/pg.service.ts
roloServer/src/modules/inventory/pg.controller.ts
roloServer/src/modules/inventory/pg.validator.ts
roloServer/src/modules/inventory/pg.routes.ts
```

Keep controllers thin. Put business rules in the service and database queries in the repository.

Mount routes under:

```text
/api/v1/admin/pgs
```

Use the existing admin authentication middleware.

## 3. List PGs

```http
GET /api/v1/admin/pgs
```

Supported query parameters:

```text
page
pageSize
search
cityId
status
onboardingStatus
genderPolicy
sortBy
sortOrder
```

Defaults:

```text
page=1
pageSize=20
sortBy=updatedAt
sortOrder=desc
```

Search should support:

- PG name
- Slug
- Locality
- Landmark
- Postal code

Escape search input before using it in MongoDB regular expressions.

Role behavior:

- `admin`: may list all PGs
- `pg_manager`: may list only PGs having an active `StaffAssignment` for the authenticated user

Return summary fields including:

```json
{
  "id": "pg-id",
  "city": {
    "id": "city-id",
    "name": "Bengaluru",
    "state": "Karnataka"
  },
  "name": "RoloStay Koramangala",
  "slug": "rolostay-koramangala",
  "locality": "Koramangala",
  "genderPolicy": "unisex",
  "status": "active",
  "onboardingStatus": "published",
  "coverImageUrl": "https://...",
  "roomCount": 12,
  "bedCount": 36,
  "availableBedCount": 8,
  "managerCount": 2,
  "updatedAt": "2026-07-22T00:00:00.000Z"
}
```

Avoid N+1 queries. Use aggregation or grouped count queries for room, bed, and assignment summaries.

## 4. Create PG

```http
POST /api/v1/admin/pgs
```

Only `admin` may call this endpoint.

Example request:

```json
{
  "cityId": "city-object-id",
  "name": "RoloStay Koramangala",
  "slug": "rolostay-koramangala",
  "description": "Managed PG accommodation near major offices.",
  "address": {
    "line1": "12, 5th Main Road",
    "line2": "Near Forum Mall",
    "locality": "Koramangala",
    "landmark": "Forum Mall",
    "postalCode": "560095"
  },
  "location": {
    "coordinates": [77.6245, 12.9352]
  },
  "genderPolicy": "unisex",
  "amenities": ["Wi-Fi", "Power backup", "Laundry"],
  "houseRules": ["No smoking", "Visitors allowed until 8 PM"],
  "contact": {
    "phoneNumber": "+919999999999",
    "email": "koramangala@rolostay.com"
  },
  "images": [],
  "status": "active",
  "onboardingStatus": "draft"
}
```

Requirements:

- Validate `cityId` as an ObjectId.
- Require the city to exist and be active.
- Trim and normalize all strings.
- Generate the slug from the name when omitted.
- Normalize the slug to lowercase kebab-case.
- Enforce uniqueness by `{ cityId, slug }`.
- Convert duplicate-key error `11000` to HTTP `409`.
- Validate email and phone format when provided.
- Deduplicate amenities and house rules case-insensitively.
- Remove blank array entries.
- Validate coordinates as `[longitude, latitude]`.
- Longitude must be between `-180` and `180`.
- Latitude must be between `-90` and `90`.
- Do not accept latitude/longitude in reversed order silently.
- Default `status` to `active`.
- Default `onboardingStatus` to `draft`.
- Return HTTP `201`.
- Create an audit event `PG_CREATED`.

Do not implement binary file upload or invent an S3 provider in this task. The existing image model stores metadata. Allow images to be omitted. When image metadata is submitted, validate `storageKey`, URL, caption, cover flag, and display order. Allow only one cover image and normalize the ordering.

## 5. Get PG details

```http
GET /api/v1/admin/pgs/:pgId
```

Access:

- `admin`: any PG
- `pg_manager`: only an actively assigned PG

Return:

- Complete PG details
- City summary
- Room counts by status and type
- Bed counts by operational status
- Assigned manager summaries
- Active pricing summary

Return `404` for an unknown PG and `403` when a PG manager requests an unassigned PG.

## 6. Update PG

```http
PATCH /api/v1/admin/pgs/:pgId
```

Only `admin` may perform general PG updates.

Allow updates to supported model fields. Reject an empty body.

Rules:

- Do not automatically change the slug when only the name changes.
- Change the slug only when explicitly supplied.
- If `cityId` or slug changes, re-check `{ cityId, slug }` uniqueness.
- A new city must exist and be active.
- Preserve image order and ensure only one cover image.
- Use `runValidators: true`.
- Create `PG_UPDATED` audit logs with changed field names and safe before/after values.

## 7. Update status

```http
PATCH /api/v1/admin/pgs/:pgId/status
```

Request:

```json
{
  "status": "inactive"
}
```

Only `admin` may change status.

Rules:

- Use status changes instead of deleting PGs.
- Reject deactivation when the PG has active rental agreements, checked-in bookings, or occupied beds.
- Return a clear `409` conflict explaining why deactivation is blocked.
- When a PG is inactive, new rooms, beds, bookings, and active pricing rules must not be created for it.
- Existing historical records must remain readable.
- Audit with `PG_STATUS_CHANGED`.

## 8. Onboarding transition

```http
PATCH /api/v1/admin/pgs/:pgId/onboarding-status
```

Request:

```json
{
  "onboardingStatus": "published"
}
```

Only `admin` may call it.

Allowed transitions:

```text
draft -> review
review -> draft
review -> published
published -> archived
archived -> draft
```

Publishing requirements:

- City is active
- PG status is active
- Name, address, locality, gender policy, and valid coordinates are present
- At least one active room exists
- At least one available or active bed exists
- At least one currently effective active pricing rule resolves for a bookable bed

Reject invalid transitions with `409` and useful details.

Audit with `PG_ONBOARDING_STATUS_CHANGED`.

## 9. PG option endpoint

Create a lightweight endpoint for room, assignment, and pricing forms:

```http
GET /api/v1/admin/pg-options
```

Return only:

```json
{
  "id": "pg-id",
  "name": "RoloStay Koramangala",
  "cityName": "Bengaluru",
  "locality": "Koramangala",
  "status": "active",
  "onboardingStatus": "published"
}
```

Role behavior:

- `admin`: all suitable PGs
- `pg_manager`: actively assigned PGs only

Support an `includeInactive=false` query available only to admin.

## 10. Frontend API and routes

Create:

```text
roloAdmin/src/modules/pgs/pg-api.js
roloAdmin/src/modules/pgs/pg-list.page.jsx
roloAdmin/src/modules/pgs/pg-form.page.jsx
roloAdmin/src/modules/pgs/pg-details.page.jsx
roloAdmin/src/modules/pgs/pgs.css
```

Add protected routes:

```text
/pgs
/pgs/new
/pgs/:pgId
/pgs/:pgId/edit
```

Access:

- Admin may use all routes.
- PG manager may use `/pgs` and assigned `/pgs/:pgId` details only.
- PG manager must not see Add, Edit, Publish, Archive, or Status controls.

Use the existing Fetch-based `apiClient`. Do not add Axios.

## 11. PG list UI

Include:

- Search
- City filter
- Status filter
- Onboarding-status filter
- Gender-policy filter
- Pagination
- Responsive table/cards
- Status and onboarding badges
- Room/bed/availability summaries
- Add PG button for admin
- View and Edit actions according to role

Columns should include:

```text
PG
City / Locality
Gender
Rooms
Beds
Available
Managers
Status
Onboarding
Updated
Actions
```

## 12. PG create/edit form

Fields:

- City selector populated from city options
- PG name
- Slug
- Description
- Address fields
- Longitude and latitude as separate UI fields, converted to `[longitude, latitude]`
- Gender policy
- Amenities tag input
- House-rules list editor
- Contact phone
- Contact email
- Status
- Onboarding status, with invalid transitions disabled
- Optional image metadata editor

Requirements:

- Accessible labels
- Inline errors
- Duplicate-slug error handling
- Prevent duplicate submissions
- Unsaved-changes warning
- Loading and not-found states
- Success notification

## 13. Tests

Add backend tests for at least:

1. Admin can create a PG.
2. PG manager cannot create a PG.
3. Resident cannot access admin PG routes.
4. Inactive or missing city is rejected.
5. Duplicate `{ cityId, slug }` returns `409`.
6. Slug is generated when omitted.
7. Invalid coordinates return `422`.
8. PG manager only lists assigned PGs.
9. PG manager cannot read an unassigned PG.
10. Deactivation is blocked when occupied beds or active agreements exist.
11. Invalid onboarding transition is rejected.
12. Publishing fails when inventory or pricing prerequisites are missing.
13. Creation and updates create audit records.
14. Existing auth and city tests remain passing.

Run:

```bash
cd roloServer
npm run lint
npm run build
npm test

cd ../roloAdmin
npm run lint
npm run build
```

## 14. Final deliverables

After implementation provide:

- Architecture summary
- Files created and modified
- API documentation
- Permission changes
- Validation and business rules
- Audit events
- Test results
- Manual verification steps

Do not rewrite unrelated project architecture, do not hard-delete PGs, and do not rely on frontend role checks for security.

---