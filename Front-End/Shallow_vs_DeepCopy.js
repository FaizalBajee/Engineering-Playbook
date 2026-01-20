
// Original Object: { user: { name: "John", address: { city: "NYC" } } }


// SHALLOW COPY:          DEEP COPY:
// {                      {
//   user: ◀──────┐         user: {
//     name: "John"  │         name: "John"
//     address: { }◀┼────┐    address: {
//       city: "NYC"│    │      city: "NYC"
//     }            │    │    }
//   }              │    │  }
// }                │    │
//                  │    │
//           References  Full Copies
//          same memory  new memory


// Shallow Copy creates a new object but shares nested objects with the original.
// Deep Copy creates a completely independent copy at all levels.




// Original menu with nested items
const originalMenu = {
  restaurant: "Joe's Diner",
  items: {
    pizza: { price: 12, toppings: ["cheese", "pepperoni"] },
    burger: { price: 10, sides: ["fries", "salad"] }
  }
};

// SHALLOW COPY - Changing pizza price affects BOTH menus
const dailySpecial = { ...originalMenu };
dailySpecial.items.pizza.price = 8;  // ❌ Changes originalMenu too!

// DEEP COPY - Each menu is completely independent  
const cateringMenu = JSON.parse(JSON.stringify(originalMenu));
cateringMenu.items.pizza.price = 15; // ✅ Only changes catering menu