// Child Component

import React from "react";
import Button from "@mui/material/Button";

function ChildComponent({ buttonRef }) {
  const triggerParentButton = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  return (
    <Button
      variant="outlined"
      onClick={triggerParentButton}
      style={{ marginLeft: "10px" }}
    >
      Trigger Parent Create Sale Order Button
    </Button>
  );
}

export default ChildComponent;
