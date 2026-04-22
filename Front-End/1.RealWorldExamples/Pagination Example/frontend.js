import React, { useEffect, useState, useCallback } from "react";
import { getCustomers } from "./customer.service";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 20;

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getCustomers(page, limit);

      setCustomers(res.data);
      setPagination(res.pagination);

    } catch (err) {
      console.error(err);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customers</h2>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && customers.length === 0 && (
        <p>No customers found</p>
      )}

      {/* Customer List */}
      {customers.map((customer) => (
        <div
          key={customer._id}
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            marginBottom: "10px",
            borderRadius: "5px"
          }}
        >
          {customer.name}
        </div>
      ))}

      {/* Pagination */}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={!pagination.hasPrevPage}
          onClick={() => setPage(prev => prev - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {pagination.page || 1} of {pagination.totalPages || 1}
        </span>

        <button
          disabled={!pagination.hasNextPage}
          onClick={() => setPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Customers;
