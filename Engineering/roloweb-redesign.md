# Redesign the Visual Theme of RoloStay Customer Website (roloweb)

This is an existing, working project. Redesign only the visual appearance.

Do not rebuild it. Do not change any functionality.

---

## Project overview

```text
roloweb/
├── src/
│   ├── main.jsx                          ← imports all global CSS files
│   ├── styles/
│   │   ├── tokens.css                    ← CSS custom properties (colours, shadows)
│   │   ├── globals.css                   ← layout classes, header, footer, page shells
│   │   ├── forms.css                     ← buttons, inputs, form layout
│   │   └── responsive.css               ← mobile breakpoint overrides
│   ├── common/
│   │   ├── layouts/
│   │   │   └── public-layout.jsx        ← wraps all pages with Header + Footer
│   │   └── components/
│   │       ├── navigation/
│   │       │   ├── header.jsx           ← site header + nav links
│   │       │   └── footer.jsx           ← site footer
│   │       └── ui/
│   │           ├── button.jsx           ← <Button variant="primary|secondary|link">
│   │           └── input.jsx            ← <Input> with label, error, hint
│   └── modules/
│       ├── home/pages/home.page.jsx
│       ├── auth/
│       │   ├── pages/
│       │   │   ├── phone-login.page.jsx
│       │   │   ├── verify-otp.page.jsx
│       │   │   └── complete-profile.page.jsx
│       │   └── components/
│       │       ├── phone-form.jsx
│       │       ├── otp-form.jsx
│       │       └── resend-otp.jsx
│       ├── profile/
│       │   ├── pages/profile.page.jsx
│       │   └── components/profile-form.jsx
│       ├── content/
│       │   ├── pages/about.page.jsx
│       │   └── pages/contact.page.jsx
│       ├── errors/pages/not-found.page.jsx
│       └── pgs/                         ← PG listing module (stubs, not yet built)
│           ├── pages/
│           │   ├── pg-list.page.jsx
│           │   └── pg-details.page.jsx
│           └── components/
│               ├── pg-card.jsx
│               ├── pg-filters.jsx
│               └── pg-gallery.jsx
```

Framework: **React (Vite)**. Styling: **Vanilla CSS only**. No Tailwind. No CSS-in-JS.

---

## Current visual theme

The current theme uses:

```css
/* tokens.css */
color: #18302a;
background: #f7f5ef;
font-family: Inter, ui-sans-serif, system-ui;
--color-brand: #176b52;
--color-brand-dark: #10513e;
--color-surface: #ffffff;
--color-border: #dce4df;
--color-muted: #60746e;
--color-danger: #b42318;
--color-danger-surface: #fff3f1;
--color-success: #176b52;
--shadow-card: 0 18px 50px rgba(24, 48, 42, 0.1);
--page-width: 1200px;
```

The current theme is functional but visually plain. It needs to be replaced with a premium, modern PG accommodation look.

---

## Target visual theme

Replace the current theme with a **clean, premium navy-blue and white** look inspired by modern PG and co-living platforms.

New colour palette:

```css
/* Primary colours */
--color-navy: #0f2044;           /* dark navy — main brand colour */
--color-navy-dark: #09152e;      /* darker navy for hover states */
--color-navy-light: #1a3060;     /* slightly lighter navy for accents */

/* Accent */
--color-gold: #f5a623;           /* warm gold / amber accent */
--color-gold-dark: #d4891a;      /* gold hover */

/* Neutrals */
--color-surface: #ffffff;
--color-bg: #f8f9fc;             /* very light cool-grey page background */
--color-border: #e2e8f0;
--color-muted: #6b7a99;
--color-text: #1a2540;           /* near-black text */

/* Functional */
--color-danger: #dc2626;
--color-danger-surface: #fef2f2;
--color-success: #16a34a;

/* Shadows */
--shadow-sm: 0 1px 3px rgba(15, 32, 68, 0.08);
--shadow-card: 0 4px 24px rgba(15, 32, 68, 0.10);
--shadow-hover: 0 8px 32px rgba(15, 32, 68, 0.16);

/* Sizing */
--page-width: 1200px;
--radius-sm: 0.5rem;
--radius-md: 0.875rem;
--radius-lg: 1.5rem;
```

Typography:

* Keep **Inter** as the primary font.
* Add **'Plus Jakarta Sans'** as an optional heading font (load from Google Fonts if acceptable, otherwise keep Inter).
* Body text: `#1a2540`, line-height 1.6.
* Headings: bold, tight line-height (1.15).

---

## Strict rules

### Change only

* CSS token values (`tokens.css`).
* Global layout and utility styles (`globals.css`).
* Form and button styles (`forms.css`).
* Responsive breakpoint styles (`responsive.css`).
* CSS class names that are purely presentational (e.g. adding new classes like `.card`, `.hero`, `.badge`).
* Inline styles used only for visual decoration.
* The `<footer>` content and markup (it currently just says `© year RoloStay`; expand it visually).
* The `<header>` visual treatment (background colour, sticky behaviour, border).

### Do not change

* Any JavaScript or JSX logic.
* Any event handlers (`onClick`, `onSubmit`, `onChange`).
* Any prop names or component interfaces.
* Any state variables or hooks.
* Any API calls or endpoint strings.
* Any routing (`ROUTES`, `<Route>`, `useNavigate`, `useLocation`).
* Any form field `id`, `name`, or `type` attributes.
* Any `aria-*` attributes already present.
* Any authentication or authorization logic.
* Any environment variables.
* Any backend files.
* The `Button` component logic — only add CSS to the `.button` classes.
* The `Input` component logic — only add CSS to the `.field` classes.

### Do not rename

* CSS class names already used in JSX (`.page`, `.site-header`, `.site-footer`, `.brand`, `.eyebrow`, `.auth-card`, `.account-card`, `.auth-form`, `.auth-page`, `.state-page`, `.spinner`, `.nav-button`, `.error-state`, `.success-message`, `.button`, `.button--primary`, `.button--secondary`, `.button--link`, `.field`, `.field__hint`, `.field__error`, `.form-error`, `.otp-actions`, `.site-shell`).
* Any of those class names may only be restyled, not removed or renamed.

---

## Files to modify

Modify only these files:

```text
roloweb/src/styles/tokens.css
roloweb/src/styles/globals.css
roloweb/src/styles/forms.css
roloweb/src/styles/responsive.css
roloweb/src/common/components/navigation/header.jsx   ← markup only, no logic
roloweb/src/common/components/navigation/footer.jsx   ← markup only, expand visually
```

You may also create one new, additive CSS file:

```text
roloweb/src/styles/theme.css
```

Import it in `main.jsx` after `responsive.css`. Use it for any new purely decorative CSS classes that are not referenced by existing JSX. Do not add a `theme.css` import inside any component file.

Do not modify any other file.

---

## Specific changes required

### 1. tokens.css

Replace all token values with the new palette defined above.

Keep every existing CSS custom property name exactly as it is (e.g. `--color-brand`, `--color-border`, `--shadow-card`, `--page-width`). Do not rename them — components reference them.

Map the new colours onto the existing names:

```css
--color-brand      → #0f2044   (navy replaces green as primary brand)
--color-brand-dark → #09152e
--color-surface    → #ffffff
--color-border     → #e2e8f0
--color-muted      → #6b7a99
--color-danger     → #dc2626
--color-danger-surface → #fef2f2
--color-success    → #16a34a
--shadow-card      → 0 4px 24px rgba(15, 32, 68, 0.10)
--page-width       → 1200px
```

Add new tokens (these are additive — they do not break existing code):

```css
--color-gold: #f5a623;
--color-gold-dark: #d4891a;
--color-navy: #0f2044;
--color-bg: #f8f9fc;
--color-text: #1a2540;
--shadow-sm: 0 1px 3px rgba(15, 32, 68, 0.08);
--shadow-hover: 0 8px 32px rgba(15, 32, 68, 0.16);
--radius-sm: 0.5rem;
--radius-md: 0.875rem;
--radius-lg: 1.5rem;
```

Update the `:root` base styles:

```css
color: var(--color-text);
background: var(--color-bg);
```

### 2. globals.css

Restyle these existing classes. Do not remove them or rename them.

**`.site-shell`** — unchanged structurally.

**`.site-header`**:
* Background: `var(--color-navy)` (dark navy).
* Text and links: white.
* Border-bottom: none (replace with a subtle box-shadow).
* Height: `4rem` minimum.
* Add `position: sticky; top: 0; z-index: 100;` for sticky header.
* Active nav link: `color: var(--color-gold)` (gold accent).

**`.brand`**:
* Color: white.
* Add a small gold square or underline decoration using CSS `::after`.

**`.site-footer`**:
* Background: `var(--color-navy)`.
* Text: white with lower opacity for secondary text.
* More padding (`3rem` top and bottom).

**`.page`**:
* `padding-block: 4rem` on desktop, `2rem` on mobile — unchanged.

**`.auth-card`, `.account-card`**:
* Border-radius: `var(--radius-lg)`.
* Box-shadow: `var(--shadow-card)`.
* Border: `1px solid var(--color-border)`.

**`.auth-page`**:
* Background: `var(--color-bg)` — the whole page background should feel slightly off-white.

**`.eyebrow`**:
* Color: `var(--color-gold)` (change from green to gold).
* Keep all other properties.

**`.spinner`**:
* `border-top-color: var(--color-gold)`.

**`.error-state`**:
* Keep functional classes unchanged — only adjust if border or background token value changes with the new tokens.

### 3. forms.css

**`.button`**:
* `border-radius: var(--radius-sm)`.
* `font-weight: 700`.
* `min-height: 2.75rem`.
* `transition: background 0.15s, box-shadow 0.15s, transform 0.1s`.

**`.button--primary`**:
* Background: `var(--color-navy)`.
* Color: white.
* On hover: `background: var(--color-navy-dark)` (do not break `:disabled` — keep existing disabled rule).

**`.button--secondary`**:
* Border: `2px solid var(--color-navy)`.
* Color: `var(--color-navy)`.
* Background: transparent.

**`.field input`, `.field select`, `.field textarea`**:
* Border-radius: `var(--radius-sm)`.
* Border: `1px solid var(--color-border)`.
* Focus ring: `outline: 3px solid rgba(15, 32, 68, 0.15); border-color: var(--color-navy)`.

### 4. header.jsx (markup only)

The existing header renders:

```jsx
<header className="site-header">
  <Link className="brand" to={ROUTES.home}>RoloStay</Link>
  <nav aria-label="Primary navigation">
    ...nav links
    ...sign in / sign out button
  </nav>
</header>
```

You may:
* Wrap the header contents in an additional `<div className="site-header__inner">` for max-width centering if needed.
* Add a small SVG logo mark or house icon next to the brand name (purely decorative, using a safe Unicode symbol or inline SVG — no external assets).
* Add a `className="site-header--scrolled"` in a `useEffect` on scroll if you want a subtle background-blur effect (optional, add the JS only if it is a pure visual enhancement with no functionality change).

You must not:
* Change the nav links or their text.
* Change the sign-in / sign-out button logic.
* Change `ROUTES` references.
* Change `aria-label`.

### 5. footer.jsx (markup only)

The current footer is a single line. Expand it to a richer visual footer:

Add:
* Copyright line (keep existing `© {year} RoloStay`).
* A short tagline: `Safe, comfortable, community-first PG accommodation.`
* Three small navigation link groups: Company (About, Contact), Residents (Find a PG, Sign In), Legal (Privacy, Terms) — use `<a href="#">` placeholder links for the legal items. All other links must use existing `ROUTES` values.
* Social icon placeholders (SVG icons or Unicode symbols — no images, no external libraries).

Do not add any routing logic. Do not reference any ROUTES that do not already exist.

### 6. responsive.css

Expand the mobile styles:

* Header: on mobile, show brand and a hamburger-style collapsible nav or keep the existing stacked layout — do not change the rendering logic, only the visual treatment.
* Cards: on mobile, ensure padding is comfortable (`1rem` minimum).
* Buttons: on mobile, increase tap target to `min-height: 3rem`.
* Footer: stack the link groups vertically on mobile.

---

## What the redesign must look like

### Header

* Full-width dark navy bar, sticky at the top.
* White "RoloStay" brand name on the left with a small house icon.
* Navigation links in white, active link highlighted in gold.
* "Sign In" rendered as a small outlined white button on the right.

### Auth pages (login, OTP, complete profile)

* Card on a light cool-grey background.
* Rounded card with a subtle shadow.
* Navy primary button for the submit action.
* Gold eyebrow label above the heading.
* Form inputs with a clean navy focus ring.

### Home page

* Currently just a placeholder paragraph. Do not add real content — only ensure the page background and typography match the new theme.

### Footer

* Dark navy background.
* White text.
* Three columns of links on desktop, stacked on mobile.
* Copyright and tagline at the bottom.

### PG listing pages (stubs)

The PG listing components (`pg-list.page.jsx`, `pg-details.page.jsx`, `pg-card.jsx`, etc.) are currently placeholder stubs. Do not implement their functionality. Ensure the CSS classes you add in `theme.css` are ready for them to use when they are built.

Add the following CSS classes to `theme.css` for future use by the PG listing module:

```css
/* Ready-to-use PG listing classes — no JSX uses these yet */
.pg-grid           /* responsive 3→2→1 column card grid */
.pg-card           /* card with hover lift and shadow */
.pg-card__image    /* cover image container */
.pg-card__body     /* card content area */
.pg-card__badge    /* gender policy or status badge */
.pg-card__amenity  /* small amenity pill */
.city-grid         /* grid of city selection cards */
.city-card         /* city selection card */
.hero              /* full-width hero section */
.hero__heading     /* large hero title */
.hero__sub         /* hero subtitle */
.skeleton          /* loading skeleton base */
.skeleton--card    /* skeleton for a PG card */
```

Do not reference these classes inside any existing JSX file — they are preparation for the PG listing feature.

---

## Before editing any file

1. Read every file in the list above.
2. Confirm the current class names used in JSX match this document.
3. Provide a summary of:
   * What you will change in each file.
   * What you will not touch.
   * Any class names or tokens you found that are not listed here.
4. Wait for approval before making any change.

---

## After all changes

1. Run `npm run lint` in the `roloweb` directory.
2. Run `npm run build` in the `roloweb` directory.
3. Run existing tests: `npm test` in the `roloweb` directory.
4. Fix only issues caused by your CSS changes.

---

## Verification checklist

Confirm for every existing page:

- [ ] `/` — Home page renders with new theme.
- [ ] `/login` — Phone login card displays correctly.
- [ ] `/verify-otp` — OTP verification card displays correctly.
- [ ] `/complete-profile` — Profile completion card displays correctly.
- [ ] `/profile` — Profile page displays correctly.
- [ ] `/about` — About page displays correctly.
- [ ] `/contact` — Contact page displays correctly.
- [ ] `/pgs` — PG listing stub page displays without error.
- [ ] `*` — Not-found page displays correctly.

Confirm:

- [ ] Login form submits correctly (no JS change).
- [ ] OTP form submits correctly (no JS change).
- [ ] Profile form submits correctly (no JS change).
- [ ] Navigation links work on desktop and mobile.
- [ ] Sign-out button works.
- [ ] Auth redirect flow works (sign in → OTP → complete profile or home).

---

## Final report

Provide:

* Files modified and what changed in each.
* New CSS classes added in `theme.css`.
* Confirmation that no JavaScript logic, API calls, routing, form handlers, or component interfaces were changed.
* Results of lint, build, and test runs.
* Any existing visual or code issues discovered but intentionally left unchanged.

The result must be a **visual theme only**. Every existing feature must work identically after the redesign.
