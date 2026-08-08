## Implement Complete Room Management in RoloStay Admin

Analyze the existing repository before changing code, then implement backend and frontend room management. Do not stop after a plan.

## Existing architecture

The project already has:

- `PgModel`
- `RoomModel`
- `BedModel`
- `StaffAssignmentModel`
- Admin authentication
- Roles `admin` and `pg_manager`
- Permission middleware
- PG-level assignment rules
- Audit logging
- Zod validation
- A Fetch-based React admin frontend

The existing room model is:

```ts
{
  pgId,
  roomNumber,
  floor?,
  roomType: 'single' | 'double' | 'triple' | 'four_sharing' | 'dormitory',
  sharingCapacity: number,
  genderCategory: 'male' | 'female' | 'unisex',
  amenities: string[],
  status: 'active' | 'inactive' | 'maintenance'
}
```

It has a unique index on:

```ts
{ pgId: 1, roomNumber: 1 }
```

Reuse `RoomModel`. Do not create a new room collection.

## Objective

Allow:

- `admin` to manage rooms for any PG
- `pg_manager` to manage rooms only for PGs with an active manager assignment

Residents must not access room-management APIs.

Room management must include:

- List rooms for a PG
- Create room
- View room details
- Update room information
- Change room status
- Show bed and occupancy summaries
- Prevent unsafe capacity and status changes

## 1. Permission and PG scope

Add or use a granular permission:

```ts
ROOM_MANAGE: 'room:manage'
```

Assign it to `admin` and `pg_manager`.

Permission alone is not sufficient. Every room query and mutation must also enforce PG scope:

- `admin`: any PG
- `pg_manager`: active `StaffAssignment` for the target PG

Create or reuse helpers such as:

```ts
assertPgAccess(userId, role, pgId)
getAccessiblePgIds(userId, role)
```

## 2. Backend module

Create:

```text
roloServer/src/modules/inventory/room/room.repository.ts
roloServer/src/modules/inventory/room/room.service.ts
roloServer/src/modules/inventory/room/room.controller.ts
roloServer/src/modules/inventory/room/room.validator.ts
roloServer/src/modules/inventory/room/room.routes.ts
```

Mount routes under the admin API.

## 3. List rooms for a PG

```http
GET /api/v1/admin/pgs/:pgId/rooms
```

Query parameters:

```text
page
pageSize
search
status
roomType
genderCategory
floor
sortBy
sortOrder
```

Search at least room number and floor.

Return:

```json
{
  "id": "room-id",
  "pgId": "pg-id",
  "roomNumber": "A-101",
  "floor": "1",
  "roomType": "double",
  "sharingCapacity": 2,
  "genderCategory": "male",
  "amenities": ["Attached bathroom"],
  "status": "active",
  "bedCount": 2,
  "availableBedCount": 1,
  "occupiedBedCount": 1,
  "maintenanceBedCount": 0,
  "activeBookingCount": 1,
  "updatedAt": "2026-07-22T00:00:00.000Z"
}
```

Avoid N+1 queries for bed and booking counts.

## 4. Create room

```http
POST /api/v1/admin/pgs/:pgId/rooms
```

Example:

```json
{
  "roomNumber": "A-101",
  "floor": "1",
  "roomType": "double",
  "sharingCapacity": 2,
  "genderCategory": "male",
  "amenities": ["Attached bathroom", "Wardrobe"],
  "status": "active"
}
```

Requirements:

- Target PG must exist and be active.
- PG must not be archived.
- Enforce role and PG assignment.
- Normalize room number and floor.
- Enforce unique `{ pgId, roomNumber }`.
- Convert duplicate key `11000` to `409`.
- Deduplicate amenities case-insensitively.
- Default status to `active`.
- Return HTTP `201`.
- Do not automatically create beds. Bed creation belongs to the bed-management feature.
- Audit with `ROOM_CREATED`.

Room-type capacity rules:

```text
single       -> sharingCapacity must be 1
double       -> sharingCapacity must be 2
triple       -> sharingCapacity must be 3
four_sharing -> sharingCapacity must be 4
dormitory    -> sharingCapacity may be 1 to 20
```

Reject inconsistent values with `422`.

The room gender category must be compatible with the PG gender policy:

- male PG: room must be male
- female PG: room must be female
- unisex PG: room may be male, female, or unisex

## 5. Get room details

```http
GET /api/v1/admin/rooms/:roomId
```

Return:

- Room details
- Parent PG summary
- Beds grouped by status
- Current occupied residents as safe summaries
- Active pricing-rule summary
- Active booking/agreement counts

Enforce PG access after resolving the room.

## 6. Update room

```http
PATCH /api/v1/admin/rooms/:roomId
```

Allow:

- roomNumber
- floor
- roomType
- sharingCapacity
- genderCategory
- amenities

Do not use this endpoint for status changes.

Rules:

- Reject an empty update.
- Recheck room-number uniqueness inside the PG.
- Recheck PG gender compatibility.
- Recheck room-type capacity rules.
- Do not reduce `sharingCapacity` below the number of non-inactive bed records.
- Do not change gender category while occupied beds or active rental agreements exist.
- If room type changes, ensure the resulting capacity remains valid.
- Use `runValidators: true`.
- Audit with `ROOM_UPDATED`.

## 7. Change room status

```http
PATCH /api/v1/admin/rooms/:roomId/status
```

Request:

```json
{
  "status": "maintenance"
}
```

Allowed status values:

```text
active
maintenance
inactive
```

Rules:

- Reject `maintenance` or `inactive` when any bed is occupied.
- Reject when active rental agreements, confirmed/check-in bookings, or live bed locks exist for the room.
- When moving to `maintenance`, update available beds to `maintenance` in the same MongoDB transaction.
- When moving to `inactive`, update available or maintenance beds to `inactive` in the same transaction.
- Never change occupied beds automatically.
- When reactivating a room, do not automatically reactivate all beds; preserve explicit bed status and let the operator choose.
- Parent PG must be active before a room can be activated.
- Audit with `ROOM_STATUS_CHANGED`.

## 8. Room options endpoint

Create:

```http
GET /api/v1/admin/pgs/:pgId/room-options
```

Return lightweight active-room data for bed and pricing forms:

```json
{
  "id": "room-id",
  "roomNumber": "A-101",
  "floor": "1",
  "roomType": "double",
  "sharingCapacity": 2,
  "activeBedCount": 2,
  "remainingBedCapacity": 0,
  "status": "active"
}
```

Enforce PG scope.

## 9. Frontend

Create:

```text
roloAdmin/src/modules/rooms/room-api.js
roloAdmin/src/modules/rooms/room-list.page.jsx
roloAdmin/src/modules/rooms/room-form.page.jsx
roloAdmin/src/modules/rooms/room-details.page.jsx
roloAdmin/src/modules/rooms/rooms.css
```

Routes:

```text
/pgs/:pgId/rooms
/pgs/:pgId/rooms/new
/rooms/:roomId
/rooms/:roomId/edit
```

Add a Rooms action from the PG list/details page.

## 10. Room list UI

Include:

- PG breadcrumb
- Search
- Status filter
- Room-type filter
- Gender filter
- Floor filter
- Pagination
- Add Room button
- Responsive table/cards

Columns:

```text
Room
Floor
Type
Capacity
Beds
Available
Occupied
Status
Updated
Actions
```

Actions:

- View
- Edit
- Mark maintenance
- Activate
- Deactivate
- Manage beds
- Manage pricing

Only show actions the authenticated user is authorized to perform.

## 11. Room form UI

Fields:

- Room number
- Floor
- Room type
- Sharing capacity
- Gender category
- Amenities tag input
- Status on create

Behavior:

- Auto-set capacity for single/double/triple/four-sharing.
- Let dormitory capacity be manually selected from 1–20.
- Limit gender choices based on PG policy.
- Show a warning if capacity changes affect existing beds.
- Show server conflict messages clearly.
- Prevent duplicate submissions.

## 12. Tests

Add tests for at least:

1. Admin can create a room in any active PG.
2. Assigned PG manager can create a room.
3. Unassigned PG manager receives `403`.
4. Resident receives `403` or `401` as appropriate.
5. Duplicate room number in one PG returns `409`.
6. Same room number in different PGs is allowed.
7. Room-type/capacity mismatch returns `422`.
8. Room gender incompatible with PG policy is rejected.
9. Capacity cannot be reduced below existing active beds.
10. Occupied room cannot enter maintenance or inactive status.
11. Room status cascade uses a transaction.
12. Room list returns bed summaries without N+1 queries.
13. Audit logs are created.
14. Existing PG and authentication tests remain passing.

Run backend and frontend lint/build/tests before completion.

## 13. Constraints

- Reuse `RoomModel`.
- Do not hard-delete rooms.
- Do not create beds automatically.
- Do not allow managers outside their assigned PGs.
- Do not manually modify occupied bed state through room updates.
- Do not add Axios, Redux, or Zustand.
- Follow existing TypeScript ESM imports and response formats.

At completion, report files, APIs, permission changes, audit events, tests, and manual verification steps.

---
