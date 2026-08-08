# Implement Public PG Listing in RoloStay Customer Website

Analyze the existing `RoloStay` project and implement a complete, production-ready **Public PG Listing module** in:

```text
roloServer
roloweb
```

Do not stop after giving a design or implementation plan. Implement the backend public catalog API, customer-facing interface, search, filtering, PG detail view, and tests.

The module must be visually excellent, fully responsive, accessible, and fast.

---

## Core clarification

The PG listing is a **public-facing feature** for the `roloweb` customer website.

It allows unauthenticated and authenticated residents to:

```text
Browse available PGs.
Search and filter PGs by city.
View a PG details page with images, rooms, pricing, and booking options.
```

The existing PG data is managed exclusively through admin routes (`roloAdmin` / `roloServer /api/v1/admin/pgs`).

This module must expose a **read-only public catalog API** that filters to only published, active PGs. It must not expose admin-only fields.

The module must not:

* Expose draft, review, or archived PGs to the public.
* Expose inactive PGs.
* Expose admin fields such as `onboardingStatus`, `status`, or `cityId` raw ObjectId.
* Require authentication for browsing.
* Allow any write operations through the public API.
* Use the admin authentication middleware.

---

# 1. Objective

Implement a public PG catalog in `roloweb`.

Residents must be able to:

* View a paginated list of published PGs.
* Search PGs by city.
* Filter PGs by city.
* Open a PG details page.
* View PG name, description, address, gender policy, amenities, house rules, contact, and images.
* See a summary of available room types and pricing.
* Navigate to booking from the PG details page.

Unauthenticated residents may browse and view PGs.

Authentication is required only when proceeding to booking.

---

# 2. Existing project context

## roloServer

The server uses:

```text
Express
TypeScript ESM
Zod
MongoDB / Mongoose
AppError + error codes
authenticateAdmin / requirePasswordChanged / authorize middleware
```

The PG data is already modeled in:

```text
roloServer/src/modules/inventory/pg/pg.model.ts
```

Key fields:

```text
name             (string, required)
slug             (string, unique per city)
description      (string)
address.line1    (string, required)
address.line2    (string)
address.locality (string, required)
address.landmark (string)
address.postalCode (string)
location         (GeoJSON Point)
genderPolicy     (male | female | unisex)
amenities        (string[])
houseRules       (string[])
images           (storageKey, url, caption, isCover, displayOrder)
contact          (phoneNumber, email)
onboardingStatus (draft | review | published | archived) — admin-only
status           (active | inactive) — admin-only
cityId           (ObjectId ref City)
```

Existing admin routes exist at:

```text
GET /api/v1/admin/pgs
GET /api/v1/admin/pgs/:pgId
```

These are admin-only and must not be changed.

Room and bed data is in:

```text
roloServer/src/modules/inventory/room/room.model.ts
roloServer/src/modules/inventory/bed/bed.model.ts
```

The city is in:

```text
roloServer/src/modules/inventory/city/city.model.ts
```

Pricing data is in:

```text
roloServer/src/modules/inventory/pricing/
```

## roloweb

The customer website uses:

```text
React + React Router (BrowserRouter)
Vanilla CSS (existing design system in /src/styles/)
apiClient from /src/infrastructure/api/http-client.js
unwrapResponse from /src/infrastructure/api/response.js
ROUTES from /src/routes/route-paths.js
PublicLayout (Header + Footer + Outlet)
```

Existing placeholder stubs are already in place:

```text
roloweb/src/modules/pgs/pages/pg-list.page.jsx     — placeholder comment only
roloweb/src/modules/pgs/pages/pg-details.page.jsx  — placeholder comment only
roloweb/src/modules/pgs/services/pg-api.js         — placeholder comment only
roloweb/src/modules/pgs/components/pg-card.jsx     — placeholder comment only
roloweb/src/modules/pgs/components/pg-filters.jsx  — placeholder comment only
roloweb/src/modules/pgs/components/pg-gallery.jsx  — placeholder comment only
roloweb/src/modules/pgs/hooks/use-pg-filters.js    — placeholder comment only
roloweb/src/modules/pgs/validation/pg-filter.schema.js — placeholder comment only
```

Replace these placeholder stubs with real implementations.

Existing design tokens:

```css
--color-brand: #176b52
--color-brand-dark: #10513e
--color-surface: #ffffff
--color-border: #dce4df
--color-muted: #60746e
--color-danger: #b42318
--color-danger-surface: #fff3f1
--color-success: #176b52
--shadow-card: 0 18px 50px rgba(24, 48, 42, 0.1)
--page-width: 1200px
```

Existing CSS utility classes:

```text
.page, .site-header, .site-footer, .site-shell
.eyebrow, .brand, .auth-page, .auth-card, .account-card
.state-page, .spinner, .nav-button, .error-state, .success-message
.button, .button--primary, .button--secondary, .button--link
.field, .field label, .field input, .field__hint, .field__error, .form-error
```

Do not add:

```text
Axios
Redux
Zustand
TailwindCSS
```

---

# 3. Public API rules

The public catalog API must:

* Return only PGs with `onboardingStatus = published` AND `status = active`.
* Never expose `onboardingStatus`, `status`, or `cityId` raw ObjectId.
* Never expose admin contact emails.
* Paginate results with sensible defaults.
* Support search and filter query parameters.
* Be unauthenticated (no auth middleware).
* Use GET-only routes.
* Be fast. Avoid N+1 queries. Use MongoDB aggregation or selective population.

---

# 4. Backend module

Create:

```text
roloServer/src/modules/catalog/catalog.repository.ts
roloServer/src/modules/catalog/catalog.service.ts
roloServer/src/modules/catalog/catalog.controller.ts
roloServer/src/modules/catalog/catalog.validator.ts
roloServer/src/modules/catalog/catalog.routes.ts
```

Mount under:

```text
/api/v1/catalog
```

Follow the existing project conventions for:

* Express.
* TypeScript ESM.
* Zod.
* Services and repositories.
* Response formatting using the existing `createSuccessResponse` / `sendSuccess` patterns.
* `AppError` and error codes.
* No admin authentication middleware.

Do not modify existing admin PG routes.

Do not add a public route to the existing `pg.routes.ts`.

---

# 5. List public PGs

Implement:

```http
GET /api/v1/catalog/pgs
```

Query parameters:

```text
page
pageSize
search
cityId
genderPolicy
amenity
sortBy
sortOrder
```

Supported `genderPolicy` values:

```text
male
female
unisex
```

Supported `sortBy` values:

```text
name
createdAt
```

Search must support:

* PG name.
* Locality.
* City name (via populated city).

Rules:

* Escape regular-expression search values.
* Default page: `1`.
* Default page size: `12`.
* Maximum page size: `48`.
* Default sorting: newest published PG first (`createdAt` descending).
* Include only `published` + `active` PGs.
* Avoid N+1 queries.

Return:

```json
{
  "items": [
    {
      "id": "pg-id",
      "name": "RoloStay Koramangala",
      "slug": "rolostay-koramangala",
      "locality": "Koramangala",
      "city": {
        "id": "city-id",
        "name": "Bengaluru"
      },
      "genderPolicy": "male",
      "coverImageUrl": "https://cdn.example.com/pg-cover.webp",
      "amenities": ["WiFi", "AC", "Meals"],
      "startingRent": 8500,
      "currency": "INR",
      "totalBeds": 24,
      "availableBeds": 6,
      "createdAt": "2026-06-01T10:00:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 12,
  "total": 38,
  "totalPages": 4
}
```

`startingRent` is the minimum `monthlyRent` across all active pricing plans for that PG.

`availableBeds` counts beds whose status is `available` (no active booking or rental agreement).

If pricing or bed data is unavailable, return `null` for those fields rather than erroring.

---

# 6. Public PG details

Implement:

```http
GET /api/v1/catalog/pgs/:slug
```

Use `slug` as the identifier, not the internal `_id`.

Return:

```json
{
  "id": "pg-id",
  "name": "RoloStay Koramangala",
  "slug": "rolostay-koramangala",
  "description": "A premium managed PG in the heart of Koramangala.",
  "address": {
    "line1": "23, 5th Cross Road",
    "line2": null,
    "locality": "Koramangala",
    "landmark": "Near Forum Mall",
    "postalCode": "560034"
  },
  "city": {
    "id": "city-id",
    "name": "Bengaluru"
  },
  "genderPolicy": "male",
  "amenities": ["WiFi", "AC", "Meals", "CCTV", "Laundry"],
  "houseRules": ["No smoking", "No guests after 10PM"],
  "images": [
    {
      "url": "https://cdn.example.com/img.webp",
      "caption": "Common area",
      "isCover": true,
      "displayOrder": 0
    }
  ],
  "contact": {
    "phoneNumber": "+91 98765 43210"
  },
  "rooms": [
    {
      "id": "room-id",
      "roomNumber": "A-101",
      "type": "double",
      "floorNumber": 1,
      "totalBeds": 2,
      "availableBeds": 1,
      "startingRent": 9000,
      "currency": "INR"
    }
  ],
  "createdAt": "2026-06-01T10:00:00.000Z"
}
```

Do not return:

* `onboardingStatus`.
* `status`.
* `cityId` raw ObjectId.
* Internal pricing plan IDs.
* Admin email addresses.

Return `404` with a clear message when the PG is not published or not active.

---

# 7. List cities with published PGs

Implement:

```http
GET /api/v1/catalog/cities
```

Return only cities that have at least one published, active PG:

```json
{
  "items": [
    {
      "id": "city-id",
      "name": "Bengaluru",
      "slug": "bengaluru",
      "pgCount": 12
    }
  ]
}
```

Use this to populate city filter dropdowns in the frontend.

No pagination required. Return all matching cities.

---

# 8. Mount public catalog routes

Register the catalog router in:

```text
roloServer/src/routes/v1.routes.ts
```

Add:

```ts
import { createCatalogRouter } from '../modules/catalog/catalog.routes.js';

router.use('/catalog', createCatalogRouter());
```

The catalog router must have no authentication middleware.

---

# 9. Add public API endpoint constants

Add catalog endpoints to:

```text
roloweb/src/config/api-endpoints.js
```

Add:

```js
catalog: {
  pgs: 'catalog/pgs',
  pgBySlug: (slug) => `catalog/pgs/${slug}`,
  cities: 'catalog/cities',
},
```

---

# 10. roloweb frontend module

Replace all placeholder stubs with real implementations.

## pg-api.js

```text
roloweb/src/modules/pgs/services/pg-api.js
```

Implement:

* `fetchPgs(filters)` — calls `GET /api/v1/catalog/pgs`.
* `fetchPgBySlug(slug)` — calls `GET /api/v1/catalog/pgs/:slug`.
* `fetchCities()` — calls `GET /api/v1/catalog/cities`.

Use `apiClient` with `auth: false` for all calls. Use `unwrapResponse`.

## pg-filter.schema.js

```text
roloweb/src/modules/pgs/validation/pg-filter.schema.js
```

Export a schema for validating and parsing filter query parameters from the URL:

```text
page
pageSize
search
cityId
genderPolicy
amenity
sortBy
sortOrder
```

## use-pg-filters.js

```text
roloweb/src/modules/pgs/hooks/use-pg-filters.js
```

Implement a custom hook that:

* Reads filter state from URL search parameters.
* Returns parsed filter values and a `setFilter(key, value)` updater.
* Updates the URL without a full page navigation.
* Resets `page` to `1` when any non-pagination filter changes.

## pg-card.jsx

```text
roloweb/src/modules/pgs/components/pg-card.jsx
```

Display:

* Cover image (or a branded placeholder if absent).
* PG name.
* Locality + city.
* Gender policy badge.
* Starting rent.
* Available beds.
* Amenity pills (show first 3, then `+N more`).
* A "View PG" link to `/pgs/:slug`.

## pg-filters.jsx

```text
roloweb/src/modules/pgs/components/pg-filters.jsx
```

Render a filter bar with:

* Search input (debounced, 300ms).
* City dropdown (populated from `fetchCities()`).
* Gender policy select (`All`, `Male`, `Female`, `Unisex`).
* Sort order select (`Newest first`, `Name A–Z`).
* Clear filters button.

## pg-gallery.jsx

```text
roloweb/src/modules/pgs/components/pg-gallery.jsx
```

Implement an image gallery for the PG details page:

* Show cover image prominently.
* Show thumbnails for remaining images.
* Clicking a thumbnail updates the main image.
* If no images exist, show a branded illustrated placeholder.

## pg-list.page.jsx

```text
roloweb/src/modules/pgs/pages/pg-list.page.jsx
```

Page heading:

```text
Find Your RoloStay
Browse managed PGs — safe, comfortable, and community-first.
```

Requirements:

* Use `usePgFilters` for URL-synced filters.
* Fetch PGs from `fetchPgs(filters)`.
* Display PGs in a responsive card grid.
* Loading state (spinner or skeleton cards).
* Empty state: `No PGs match your search. Try adjusting your filters.`
* Error state.
* Pagination (previous / next / page numbers).
* Search debounce.
* Filter bar using `PgFilters`.
* Document title: `Find a PG — RoloStay`.

## pg-details.page.jsx

```text
roloweb/src/modules/pgs/pages/pg-details.page.jsx
```

Requirements:

* Fetch PG by slug from URL param.
* Loading state.
* 404 state: `This PG is not available.`
* Error state.
* Display all PG details (name, description, address, amenities, house rules, contact, images, rooms).
* Use `PgGallery` for images.
* Show room summary table or cards.
* Show a prominent **Book Now** button:
  * If the user is not authenticated, redirect to login with a return URL.
  * If authenticated but profile is incomplete, redirect to complete-profile.
  * If authenticated and profile complete, navigate to the checkout route (placeholder path until booking is implemented).
* Document title: `{PG Name} — RoloStay`.

---

# 11. Add PG routes to roloweb

## route-paths.js

Add to `ROUTES`:

```js
pgs: '/pgs',
pgDetails: (slug) => `/pgs/${slug}`,
```

## app-routes.jsx

Add public routes inside the existing `<Route element={<PublicLayout />}>` block:

```jsx
import { PgListPage } from '../modules/pgs/pages/pg-list.page.jsx'
import { PgDetailsPage } from '../modules/pgs/pages/pg-details.page.jsx'

<Route path={ROUTES.pgs} element={<PgListPage />} />
<Route path="/pgs/:slug" element={<PgDetailsPage />} />
```

## header.jsx

Add a navigation link to the PG listing:

```jsx
<NavLink to={ROUTES.pgs}>Find a PG</NavLink>
```

---

# 12. Design and UI requirements

The PG listing is the primary marketing surface of `roloweb`. It must look premium.

* Use the existing design tokens (`--color-brand`, `--color-surface`, `--shadow-card`, etc.).
* Create a module-scoped CSS file:

```text
roloweb/src/modules/pgs/pgs.css
```

* Import it inside `pg-list.page.jsx` and `pg-details.page.jsx`.

Required visual elements:

* **Hero section** on the PG list page: large heading, subheading, and an embedded search bar.
* **PG cards**: rounded corners, cover image, card shadow, hover lift effect (`transform: translateY(-4px)`).
* **Gender policy badge**: color-coded pill (green for unisex, blue for male, rose for female). Include a visible text label, not color alone.
* **Available beds indicator**: show `X beds available` in brand green, or `Full` in muted color.
* **Amenity pills**: compact, pill-shaped tags.
* **Room summary on details page**: clean, accessible table or card layout.
* **Gallery**: large main image with a scrollable thumbnail strip below.
* **Responsive grid**: 3 columns on desktop, 2 on tablet, 1 on mobile.
* **Pagination**: numbered pages, accessible previous and next buttons.
* **Smooth transitions**: CSS transitions on card hover and gallery image changes.
* **Loading skeletons** (preferred over a bare spinner): show 6 skeleton cards while data loads.

Do not communicate state using color alone. Include accessible text labels alongside color cues.

---

# 13. User-friendly errors

Use clear messages:

```text
This PG is not currently available.
No PGs match your search. Try clearing some filters.
Something went wrong. Please try again.
We could not load the cities. Please refresh the page.
```

Use the existing `error-state` CSS class for error display.

---

# 14. Accessibility requirements

* All images must have meaningful `alt` text.
* Filter controls must have visible labels.
* Search input must be associated with a label.
* Pagination buttons must have `aria-label` attributes.
* Gallery must support keyboard navigation.
* All interactive elements must be keyboard-reachable.
* Do not communicate status using color alone.
* Use semantic HTML: `<main>`, `<section>`, `<article>`, `<nav>`, one `<h1>` per page.

---

# 15. Tests

Add tests for at least:

**Backend (roloServer):**

1. `GET /api/v1/catalog/pgs` returns only published, active PGs.
2. Draft PGs are excluded from the catalog.
3. Archived PGs are excluded from the catalog.
4. Inactive PGs are excluded from the catalog.
5. Search by PG name works.
6. Search by locality works.
7. 
8. Filter by `cityId` works.
9. Pagination returns correct `page`, `pageSize`, `total`, `totalPages`.
10. `GET /api/v1/catalog/pgs/:slug` returns a valid PG.
11. `GET /api/v1/catalog/pgs/:slug` returns `404` for a non-published PG.
12. `GET /api/v1/catalog/pgs/:slug` returns `404` for an unknown slug.
13. Catalog responses never include `onboardingStatus` or `status`.
14. `GET /api/v1/catalog/cities` returns only cities with at least one published PG.
15. Catalog routes do not require authentication.
16. Admin PG routes remain unaffected.

**Frontend (roloweb):**

17. `fetchPgs` calls the correct endpoint with query parameters.
18. `fetchPgBySlug` calls the correct endpoint.
19. `fetchCities` calls the correct endpoint.
20. `PgListPage` renders a loading state while fetching.
21. `PgListPage` renders PG cards when data is loaded.
22. `PgListPage` renders the empty state when no PGs are returned.
23. `PgListPage` renders the error state when the request fails.
24. `PgDetailsPage` renders PG details when data is loaded.
25. `PgDetailsPage` renders a 404 message when the PG is not found.
26. The `Book Now` button redirects unauthenticated users to login.

Run:

```text
Server lint
Server build
Server tests
roloweb lint
roloweb build
Existing roloweb tests (route guards, auth flows)
```

---

# 16. Constraints

* Expose only `published` + `active` PGs through the public catalog API.
* Never use admin authentication middleware on catalog routes.
* Never expose `onboardingStatus`, `status`, `cityId` raw ObjectId, or internal metadata to the public.
* Do not modify existing admin PG routes.
* Do not add write operations to the catalog API.
* Do not require authentication for browsing PGs.
* Reuse the existing PG, Room, Bed, City, and Pricing models.
* Reuse `apiClient`, `unwrapResponse`, `ROUTES`, and the existing CSS design system.
* Replace placeholder stubs — do not create duplicate files.
* Do not add Axios, Redux, or Zustand.
* Follow the existing project architecture and coding conventions in both `roloServer` and `roloweb`.
* The design must look premium. Minimal or unstyled UI is unacceptable.

At completion, report:

* Existing code reused.
* Architecture decisions.
* Files created.
* Files modified.
* APIs created.
* Database queries and indexes used.
* `startingRent` and `availableBeds` calculation approach.
* Tests added.
* Commands executed.
* Build and test results.
* Manual verification instructions.
* Remaining limitations.
