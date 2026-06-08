# React Portal: Different DOM Container, Same React Tree

## Does React Portal Create a Separate DOM?

No.

React Portal **does not create a separate DOM**.

It uses the **same HTML document**, but renders a component into a **different DOM container (node)**.

---

## Normal React Rendering

### HTML

```html
<body>
  <div id="root"></div>
</body>
```

### React

```jsx
<App />
```

### DOM Structure

```text
body
└── root
     └── App
          └── Modal
```

Everything is rendered inside the `root` element.

---

## React Portal Rendering

### HTML

```html
<body>
  <div id="root"></div>
  <div id="modal-root"></div>
</body>
```

### React

```jsx
createPortal(
  <Modal />,
  document.getElementById("modal-root")
)
```

### DOM Structure

```text
body
├── root
│    └── App
│
└── modal-root
     └── Modal
```

### Key Observation

* Same HTML document
* Same DOM
* Different DOM container

The modal is rendered into `modal-root` instead of `root`.

---

## Visual Analogy

Think of the DOM as a house.

```text
House (DOM)
│
├── Living Room (root)
│     └── App
│
└── Bedroom (modal-root)
      └── Modal
```

The modal is moved to another room in the same house.

It is **not a new house**.

---

## Why Use React Portal?

Consider the following CSS:

```css
.parent {
  overflow: hidden;
}
```

### Without Portal

```text
root
 └── parent
      └── modal
```

Result:

* Modal is inside the parent container.
* Parent styles affect the modal.
* Modal may be clipped due to `overflow: hidden`.

---

### With Portal

```text
root
 └── parent

modal-root
 └── modal
```

Result:

* Modal is no longer inside the parent container.
* Parent styles do not restrict the modal.
* Modal can appear above other content.

---

## Common Use Cases

### Modals

```jsx
<Modal />
```

Examples:

* Login dialog
* Confirmation popup
* Delete warning

---

### Tooltips

```jsx
<Tooltip />
```

Used when content must appear above other elements.

---

### Dropdowns

```jsx
<Select />
```

Prevents dropdown menus from being clipped by parent containers.

---

### Drawers / Side Panels

```jsx
<Drawer />
```

Common in mobile navigation and dashboards.

---

## Important Interview Point

Even though the DOM location changes:

```jsx
<App>
  <Modal />
</App>
```

React still treats `Modal` as a child of `App`.

Therefore:

### Context Works

```jsx
<UserContext.Provider>
  <Modal />
</UserContext.Provider>
```

The modal can access context values.

### Event Bubbling Works

```jsx
<div onClick={handleClick}>
  <Modal />
</div>
```

Events continue to bubble through the React component tree.

---

## Interview Answer

> React Portal allows a component to be rendered into a different DOM container while remaining part of the same React component tree. It does not create a separate DOM. It is commonly used for modals, tooltips, dropdowns, and drawers to avoid issues with overflow, z-index, and positioning.
