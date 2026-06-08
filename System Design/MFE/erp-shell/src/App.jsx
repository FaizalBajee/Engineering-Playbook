import React, { Suspense, lazy } from "react";

const Login = lazy(() => import("authApp/Login"));

export default function App() {
  return (
    <div>
      <h1>ERP Shell - Main App</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    </div>
  );
}
