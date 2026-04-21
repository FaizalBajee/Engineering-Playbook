import React from "react";
import { useAuth } from "./useContext";

function Dashboard() {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>

      {user ? (
        <>
          <p>Welcome {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button
          onClick={() =>
            login({ name: "Faizal", role: "Admin" })
          }
        >
          Login
        </button>
      )}
    </div>
  );
}

export default Dashboard;
