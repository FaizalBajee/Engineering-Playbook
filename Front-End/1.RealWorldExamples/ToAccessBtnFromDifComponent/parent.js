// Parent Component

import React, { useRef } from "react";
import Button from "@mui/material/Button";
import ChildComponent from "./ChildComponent";

function ParentComponent() {
  const createSaleOrderBtnRef = useRef();

  const handleCreateSaleOrder = (forceApproval = false) => {
    console.log("Create Sale Order triggered", forceApproval);

    // your existing full logic here
  };

  const state = {
    isLoading: false,
    calculatedProducts: [1, 2], // sample data
  };

  return (
    <>
      {/* Original Button in Parent */}
      <Button
        ref={createSaleOrderBtnRef}
        variant="contained"
        disabled={
          state.isLoading || state.calculatedProducts.length === 0
        }
        onClick={() => handleCreateSaleOrder(false)}
      >
        {state.isLoading
          ? "Creating Sale Order..."
          : "Create Sale Order"}
      </Button>

      {/* Child Component */}
      <ChildComponent buttonRef={createSaleOrderBtnRef} />
    </>
  );
}

export default ParentComponent;
