import React, { useState, useCallback } from "react";
import axios from "axios";
import useInfiniteScroll from "./useInfiniteScroll";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchCustomers = useCallback(async (page) => {
    try {
      const res = await axios.get("/api/customers", {
        params: { page, limit: 20 }
      });

      setCustomers((prev) => [...prev, ...res.data.data]);
      setHasMore(res.data.hasMore);

    } catch (error) {
      console.error(error);
    }
  }, []);

  const { lastElementRef, loading } = useInfiniteScroll(
    fetchCustomers,
    hasMore
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customers</h2>

      {customers.map((customer, index) => {
        if (customers.length === index + 1) { //Checks if current item is the last item in the list
          return (
            <div
              ref={lastElementRef}
              key={customer._id}
              style={{
                padding: "15px",
                border: "1px solid #ddd",
                marginBottom: "10px"
              }}
            >
              {customer.name}
            </div>
          );
        }

        return (
          <div
            key={customer._id}
            style={{
              padding: "15px",
              border: "1px solid #ddd",
              marginBottom: "10px"
            }}
          >
            {customer.name}
          </div>
        );
      })}

      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more customers</p>}
    </div>
  );
};

export default Customers;
