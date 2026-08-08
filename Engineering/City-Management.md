# Implement Admin City Management for RoloStay

Analyze the existing project before making changes, then implement the complete backend and admin frontend feature.

## Project Context

The repository contains:

```text
RoloStay/
├── roloServer/   # Express 5 + TypeScript + MongoDB/Mongoose
└── roloAdmin/    # React 19 + Vite admin website
```

Admin username/password authentication is already being implemented under:

```text
/api/v1/admin/auth
```

The project already has:

* `admin` and `pg_manager` roles
* Admin authentication middleware
* Permission-based authorization
* Audit logging
* Zod validation
* Standard success and error response envelopes
* A Fetch-based frontend API client
* An existing city database model

Do not create a second city model or a parallel authentication system.

---

# Existing City Model

The following model already exists:

```text
roloServer/src/modules/inventory/city.model.ts
```

It contains fields similar to:

```ts
{
  name: string;
  slug: string;
  state?: string;
  country: string;
  status: 'active' | 'inactive';
  displayOrder: number;
  seo?: {
    title?: string;
    description?: string;
  };
}
```

The `PgModel` already references cities using:

```ts
cityId: ObjectId
```

Reuse the existing `CityModel`.

---

# Objective

Add a City Management feature to the admin panel.

Only a user with role:

```text
admin
```

may create or manage cities.

A `pg_manager` must not be allowed to create, edit, activate, or deactivate cities.

The feature must allow an admin to:

* View cities
* Search cities
* Create a city
* Edit a city
* Activate or deactivate a city
* Control city display order
* Manage optional SEO information

Do not allow a city that is currently used by PG properties to be permanently deleted.

Use status changes instead of hard deletion.

---

# Backend Implementation — `roloServer`

## 1. Permission

Update:

```text
roloServer/src/common/constants/permissions.ts
```

Add a city-management permission:

```ts
CITY_MANAGE: 'city:manage'
```

Assign this permission only to the existing `admin` role.

Do not give `CITY_MANAGE` to `pg_manager`.

Do not reuse `INVENTORY_MANAGE` for this feature because the existing `pg_manager` role already has that permission.

---

# 2. City Module

Create the required city API files following the existing project architecture:

```text
roloServer/src/modules/inventory/city.repository.ts
roloServer/src/modules/inventory/city.service.ts
roloServer/src/modules/inventory/city.controller.ts
roloServer/src/modules/inventory/city.validator.ts
roloServer/src/modules/inventory/city.routes.ts
```

Keep controllers thin.

Business rules must be inside the service.

Database operations must be inside the repository.

Use TypeScript ESM imports with `.js` extensions, matching the project.

---

# 3. City API Routes

Mount the city router under:

```text
/api/v1/admin/cities
```

All routes must use:

```ts
authenticateAdmin
authorize(PERMISSIONS.CITY_MANAGE)
```

Use the existing admin authentication middleware rather than the customer/mobile authentication middleware.

## List Cities

```http
GET /api/v1/admin/cities
```

Supported query parameters:

```text
page
pageSize
search
status
sortBy
sortOrder
```

Defaults:

```text
page=1
pageSize=20
sortBy=displayOrder
sortOrder=asc
```

Allowed status values:

```text
active
inactive
all
```

Allowed sort fields:

```text
name
state
displayOrder
createdAt
updatedAt
```

Example response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "city-object-id",
        "name": "Bengaluru",
        "slug": "bengaluru",
        "state": "Karnataka",
        "country": "India",
        "status": "active",
        "displayOrder": 1,
        "seo": {
          "title": "PGs in Bengaluru",
          "description": "Find RoloStay PG accommodation in Bengaluru."
        },
        "pgCount": 5,
        "createdAt": "2026-07-22T00:00:00.000Z",
        "updatedAt": "2026-07-22T00:00:00.000Z"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

Search must support at least:

* City name
* State
* Country
* Slug

Escape search input before using it inside a MongoDB regular expression.

The returned city list should include the number of PG properties linked to each city.

Avoid an N+1 query. Use aggregation or a grouped PG count query.

---

## Create City

```http
POST /api/v1/admin/cities
```

Request:

```json
{
  "name": "Bengaluru",
  "state": "Karnataka",
  "country": "India",
  "displayOrder": 1,
  "status": "active",
  "seo": {
    "title": "PGs in Bengaluru",
    "description": "Find RoloStay PG accommodation in Bengaluru."
  }
}
```

The request may optionally contain a custom slug:

```json
{
  "slug": "bengaluru"
}
```

Requirements:

* Trim all string values.
* Normalize duplicate whitespace.
* Generate the slug from the city name when no slug is provided.
* Normalize the slug to lowercase kebab-case.
* Validate the final generated slug.
* Default `country` to `India`.
* Default `status` to `active`.
* Default `displayOrder` to `0`.
* Reject duplicate slugs with HTTP `409`.
* Do not rely only on a pre-insert duplicate check.
* Handle MongoDB duplicate-key error code `11000`.
* Never expose raw MongoDB errors.
* Return HTTP `201` after successful creation.
* Create an audit log.

Audit action:

```text
CITY_CREATED
```

Audit metadata should include safe fields such as:

```ts
{
  name,
  slug,
  state,
  country,
  status,
  displayOrder
}
```

Do not audit request headers, access tokens, or cookies.

Example response:

```json
{
  "success": true,
  "data": {
    "id": "city-object-id",
    "name": "Bengaluru",
    "slug": "bengaluru",
    "state": "Karnataka",
    "country": "India",
    "status": "active",
    "displayOrder": 1,
    "seo": {
      "title": "PGs in Bengaluru",
      "description": "Find RoloStay PG accommodation in Bengaluru."
    },
    "pgCount": 0,
    "createdAt": "2026-07-22T00:00:00.000Z",
    "updatedAt": "2026-07-22T00:00:00.000Z"
  }
}
```

---

## Get City

```http
GET /api/v1/admin/cities/:cityId
```

Requirements:

* Validate `cityId` as a MongoDB ObjectId.
* Return `404` when the city does not exist.
* Include the linked PG count.

---

## Update City

```http
PATCH /api/v1/admin/cities/:cityId
```

Allow updating:

```text
name
slug
state
country
displayOrder
status
seo.title
seo.description
```

Request example:

```json
{
  "name": "Bengaluru",
  "state": "Karnataka",
  "displayOrder": 2,
  "seo": {
    "title": "Best PGs in Bengaluru",
    "description": "Explore verified PG properties in Bengaluru."
  }
}
```

Requirements:

* Reject an empty update body.
* Do not automatically change the existing slug when only the name changes.
* Change the slug only when a new slug is explicitly submitted.
* Normalize and validate an explicitly submitted slug.
* Reject duplicate slugs with `409`.
* Use `runValidators: true`.
* Return `404` when the city does not exist.
* Create an audit log.

Audit action:

```text
CITY_UPDATED
```

Store changed field names and safe before/after values in audit metadata.

---

## Update City Status

Use either the general update API or create a dedicated endpoint:

```http
PATCH /api/v1/admin/cities/:cityId/status
```

Request:

```json
{
  "status": "inactive"
}
```

Requirements:

* Only allow `active` or `inactive`.
* Do not delete the city.
* Existing PG records may continue referencing an inactive city.
* New PG creation forms should normally show only active cities.
* Create an audit log.

Audit action:

```text
CITY_STATUS_CHANGED
```

---

# 4. Validation

Use Zod schemas in:

```text
roloServer/src/modules/inventory/city.validator.ts
```

Create schemas for:

```ts
listCitiesQuerySchema
cityIdParamsSchema
createCityBodySchema
updateCityBodySchema
updateCityStatusBodySchema
```

Apply limits compatible with the existing Mongoose model:

```text
name: maximum 120 characters
slug: maximum 140 characters
state: maximum 120 characters
country: maximum 120 characters
seo.title: maximum 180 characters
seo.description: maximum 500 characters
```

Additional validation:

* `name` must not be blank after trimming.
* `slug` must contain lowercase letters, numbers, and single hyphens only.
* `displayOrder` must be a non-negative integer.
* `country` must not be blank.
* Empty strings for optional SEO fields may be converted to `undefined`.
* Reject unknown request fields where appropriate.

---

# 5. Repository Requirements

The city repository should contain methods similar to:

```ts
createCity()
findById()
findBySlug()
listCities()
updateCity()
updateStatus()
countLinkedPgs()
```

Use `.lean()` for read-only queries where appropriate.

Do not pass Express request or response objects into the repository.

Ensure pagination queries are properly bounded.

---

# 6. Error Handling

Use the existing:

```text
AppError
ERROR_CODES
errorHandler
```

Use:

* `422` for request validation failure
* `401` for missing or invalid authentication
* `403` for insufficient permission
* `404` when a city does not exist
* `409` when the slug already exists
* `500` only for unexpected errors

Do not leak stack traces, MongoDB errors, or internal implementation details.

Use clear messages such as:

```text
A city with this slug already exists.
City was not found.
```

---

# 7. Router Registration

Register the new city routes without accidentally protecting the public admin login endpoint.

Expected route structure:

```ts
router.use('/admin/auth', createAdminAuthRouter());
router.use('/admin/cities', createCityRouter());
router.use('/admin', createAdminRouter());
```

The city router itself must enforce admin authentication and `CITY_MANAGE`.

Do not mount `authenticateAdmin` globally before `/admin/auth/login`.

---

# Admin Frontend — `roloAdmin`

## 1. City API Module

Create:

```text
roloAdmin/src/modules/cities/city-api.js
```

Functions:

```js
listCities(params)
getCity(cityId)
createCity(payload)
updateCity(cityId, payload)
updateCityStatus(cityId, status)
```

Use the existing Fetch-based `apiClient`.

Do not add Axios.

Correctly unwrap the backend response envelope:

```json
{
  "success": true,
  "data": {}
}
```

Use the existing access-token and refresh-cookie authentication flow.

---

# 2. City Routes

Add protected frontend routes:

```text
/cities
/cities/new
/cities/:cityId/edit
```

Only role `admin` may access these routes.

A `pg_manager` must be redirected to a forbidden page or dashboard.

Add a `Cities` menu item only for admins.

---

# 3. City List Page

Create:

```text
roloAdmin/src/modules/cities/city-list.page.jsx
roloAdmin/src/modules/cities/cities.css
```

The page must include:

* Page title: `Cities`
* `Add City` button
* Search input
* Status filter
* Loading state
* Empty state
* API error state
* Responsive city table
* Pagination

Table columns:

```text
City
State
Country
Slug
PG Count
Display Order
Status
Updated At
Actions
```

Actions:

```text
Edit
Activate
Deactivate
```

Use status badges.

Ask for confirmation before deactivating a city.

Do not optimistically remove a city when deactivating it.

Refresh or update the displayed row after a successful status change.

---

# 4. Add City Page

Create:

```text
roloAdmin/src/modules/cities/city-form.page.jsx
```

The same form may be reused for creating and editing cities.

Fields:

```text
City name
Slug
State
Country
Display order
Status
SEO title
SEO description
```

Create-mode defaults:

```text
country = India
status = active
displayOrder = 0
```

Slug behavior:

* Auto-generate a slug preview from the city name.
* Allow the admin to edit the slug.
* Stop automatically replacing the slug after the admin manually edits it.
* The backend remains the source of truth for final slug normalization.

Form requirements:

* Accessible labels
* Required-field indicators
* Inline validation messages
* Character counters for SEO fields
* Save button
* Cancel button
* Loading state
* Duplicate-slug error
* General API error
* Prevent duplicate form submission

On successful creation:

```text
Redirect to /cities
Show a success notification: “City created successfully.”
```

Do not reset or navigate away after a failed request.

---

# 5. Edit City Page

Route:

```text
/cities/:cityId/edit
```

Requirements:

* Load existing city data.
* Show a loading state.
* Show a not-found state for `404`.
* Populate the same reusable form.
* Save only supported fields.
* Redirect to `/cities` after success.
* Show: `City updated successfully.`

---

# 6. User Experience

Follow the existing RoloStay admin design.

Include:

* Responsive desktop and mobile layouts
* Keyboard-accessible buttons
* Proper focus states
* Disabled submit buttons while saving
* Clear API error messages
* No raw error objects displayed to the user

Do not expose:

* Access tokens
* Refresh tokens
* Cookie values
* Database error messages

---

# Tests

Add backend tests for at least:

1. Unauthenticated user cannot create a city.
2. Resident cannot create a city.
3. `pg_manager` cannot create a city.
4. `admin` can create a city.
5. Missing city name returns `422`.
6. Invalid slug returns `422`.
7. Slug is generated when omitted.
8. Duplicate slug returns `409`.
9. MongoDB duplicate-key errors are converted to `409`.
10. Default country is `India`.
11. Default status is `active`.
12. City list supports pagination.
13. City list supports search.
14. City list supports status filtering.
15. City update returns `404` for an unknown city.
16. City status can be changed to inactive.
17. City creation creates an audit log.
18. City update creates an audit log.
19. PG manager does not receive `CITY_MANAGE`.
20. Existing customer and admin authentication tests still pass.

Frontend verification:

```bash
npm run lint
npm run build
```

Backend verification:

```bash
npm run lint
npm run build
npm test
```

Do not remove or weaken existing tests.

---

# Manual Verification

Provide exact steps to verify:

1. Start MongoDB.
2. Start `roloServer`.
3. Start `roloAdmin`.
4. Log in as the fixed admin.
5. Open `/cities`.
6. Create `Bengaluru, Karnataka, India`.
7. Confirm the city appears in the list.
8. Attempt to create the same slug again.
9. Confirm a duplicate-slug message appears.
10. Edit display order and SEO information.
11. Deactivate the city.
12. Confirm the city remains stored but displays as inactive.
13. Log in as a PG manager.
14. Confirm the Cities menu is hidden.
15. Confirm direct access to `/cities` is denied.
16. Confirm direct API requests by a PG manager return `403`.

---

# Implementation Constraints

* Reuse the existing `CityModel`.
* Do not create another `cities` collection.
* Do not add Axios.
* Do not add Redux or Zustand.
* Do not modify customer OTP authentication.
* Do not hard-delete cities.
* Do not allow PG managers to manage cities.
* Do not use only frontend role checks.
* Follow the existing controller/service/repository architecture.
* Use Zod for body, parameter, and query validation.
* Use existing response and error formats.
* Use existing audit logging.
* Use the existing admin authentication middleware.
* Follow TypeScript ESM imports with `.js` extensions.
* Implement the complete feature, not only a plan.

---

# Final Deliverables

After implementation, provide:

1. Architecture summary
2. Files created
3. Files modified
4. API endpoints
5. Request and response examples
6. Permission changes
7. Database/index changes
8. Audit events added
9. Test results
10. Manual verification instructions

Do not stop after explaining the implementation. Make all required backend and frontend code changes.
