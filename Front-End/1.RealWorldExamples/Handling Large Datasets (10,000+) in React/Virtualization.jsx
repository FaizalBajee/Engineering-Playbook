import React from "react";
import { FixedSizeList as List } from "react-window";

const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `User ${i + 1}`,
}));

const Row = ({ index, style }) => {
  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #eee",
      }}
    >
      {items[index].name}
    </div>
  );
};

export default function App() {
  return (
    <div>
      <h2>Virtualized List Example</h2>

      <List
        height={500}      // visible screen height
        itemCount={items.length}
        itemSize={50}     // row height
        width={300}
      >
        {Row}
      </List>
    </div>
  );
}