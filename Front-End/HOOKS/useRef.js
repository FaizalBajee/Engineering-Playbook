/**
 * File: useRef.js
 *
 * Purpose:
 * Demonstrates how useRef is used to automatically
 * scroll to and focus the first invalid input field
 * when a user misses required fields in a dynamic form.
 *
 * Real Use Case:
 * - Product quotation / order entry screen
 * - Multiple rows with Model No and Quantity inputs
 * - User submits form with missing required values
 * - App auto-scrolls and focuses the first error field
 *
 * Why useRef:
 * - To store DOM element references
 * - To avoid unnecessary re-renders
 * - To control one-time scrolling behavior
 */

import React, { useRef, useEffect } from "react";

function ProductForm({ fieldErrors }) {
  /**
   * Prevents repeated auto-scroll on every render
   * useRef value persists without causing re-render
   */
  const scrolledRef = useRef(false);

  /**
   * Stores references of Model No inputs
   * Structure:
   * {
   *   0: HTMLInputElement,
   *   1: HTMLInputElement
   * }
   */
  const modelNoInputRefs = useRef({});

  /**
   * Stores references of Quantity inputs
   */
  const qtyInputRefs = useRef({});

  /**
   * Scrolls to and focuses the first error field
   * Priority:
   * 1. Model No
   * 2. Quantity
   */
  const scrollToFirstProductError = () => {
    let el = null;

    if (fieldErrors.firstProduct) {
      el = modelNoInputRefs.current[0]; // highest priority
    } else if (fieldErrors.firstProductQty) {
      el = qtyInputRefs.current[0];
    }

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      el.focus();
    }
  };

  /**
   * Triggers auto-scroll when validation errors occur
   * Runs only when error state changes
   */
  useEffect(() => {
    const hasError =
      fieldErrors.firstProduct || fieldErrors.firstProductQty;

    if (hasError && !scrolledRef.current) {
      scrollToFirstProductError();
      scrolledRef.current = true; // mark scroll as done
    }

    // Reset when errors are cleared
    if (!fieldErrors.firstProduct && !fieldErrors.firstProductQty) {
      scrolledRef.current = false;
    }
  }, [fieldErrors.firstProduct, fieldErrors.firstProductQty]);

  return (
    <>
      {/* Example Quantity Field */}
      <TextField
        inputRef={(el) => {
          qtyInputRefs.current[0] = el;
        }}
        error={fieldErrors.firstProductQty}
        helperText={fieldErrors.firstProductQty ? "required" : null}
        type="number"
      />
    </>
  );
}

export default ProductForm;
