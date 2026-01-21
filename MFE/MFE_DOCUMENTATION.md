# Micro Frontend (MFE) Setup with Webpack Module Federation

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Project Structure](#project-structure)
5. [Step-by-Step Setup](#step-by-step-setup)
6. [Configuration Details](#configuration-details)
7. [Running the Application](#running-the-application)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Topics](#advanced-topics)

---

## Introduction

### What is Micro Frontend (MFE)?

Micro Frontends extend the concepts of microservices to the frontend world. It's an architectural style where a frontend app is decomposed into smaller, semi-independent "micro applications" that work together.

**Key Benefits:**
- **Scalability**: Teams can work independently on different modules
- **Technology Flexibility**: Each micro app can use different frameworks/versions
- **Independent Deployment**: Deploy features without affecting entire app
- **Code Isolation**: No direct dependencies between micro apps
- **Performance**: Load only necessary code

### What is Webpack Module Federation?

Module Federation is a Webpack 5 feature that allows developers to:
- Share code between bundles at runtime
- Dynamically load code from remote containers
- Create reusable component libraries

---

## Architecture

### Overview Diagram

```
┌─────────────────────────────────────────┐
│         ERP Shell (Host App)            │
│  - Runs on localhost:3000               │
│  - Acts as the main container           │
│  - Loads remote components dynamically  │
└──────────────┬──────────────────────────┘
               │
               │ Consumes
               │
┌──────────────▼──────────────────────────┐
│    ERP Client (Remote/Auth App)         │
│  - Runs on localhost:3001               │
│  - Exposes Login component              │
│  - Manages authentication module        │
└─────────────────────────────────────────┘
```

### Communication Flow

1. **Shell App starts** → Initializes shared dependencies (React, React-DOM)
2. **Shell loads Bootstrap** → Sets up root element and renders App
3. **Shell App mounts** → Renders dynamic remote Login component
4. **Remote module loads** → At runtime, Login component is fetched from localhost:3001
5. **Shared dependencies resolved** → Prevents duplicate React instances

---

## Prerequisites

### Required Technologies

- **Node.js** >= 14.0
- **npm** >= 6.0
- **Webpack** >= 5.0 (includes Module Federation)
- **React** >= 16.8 (with Hooks)
- **Babel** for JSX transpilation

### Development Tools

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev @babel/core @babel/preset-react @babel/preset-env babel-loader
npm install --save-dev html-webpack-plugin
npm install --save-dev style-loader css-loader
```

---

## Project Structure

```
MFE/
├── erp-shell/                    # Host/Container App
│   ├── src/
│   │   ├── main.jsx             # Entry point (dynamic import)
│   │   ├── bootstrap.jsx        # Actual app initialization
│   │   ├── App.jsx              # Root component (loads remotes)
│   │   ├── components/          # Shared components
│   │   ├── hooks/               # Custom hooks
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   └── store/               # State management
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── webpack.config.js        # Webpack configuration
│   └── package.json
│
├── erp-client/                   # Remote/Exposed Module
│   ├── src/
│   │   ├── main.jsx             # Entry point (dynamic import)
│   │   ├── bootstrap.jsx        # Actual app initialization
│   │   ├── App.jsx              # Root component
│   │   ├── Login.jsx            # Exposed component ⭐
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   ├── public/
│   │   └── index.html
│   ├── webpack.config.js        # Module Federation config
│   └── package.json
```

---

## Step-by-Step Setup

### Step 1: Create Project Structure

```bash
mkdir -p MFE/erp-shell/{src/{components,hooks,pages,services,store},public}
mkdir -p MFE/erp-client/{src/{components,hooks,pages,services,store},public}
```

### Step 2: Initialize package.json

**erp-shell/package.json:**
```json
{
  "name": "erp-shell",
  "version": "1.0.0",
  "scripts": {
    "start": "webpack serve --mode development --open",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.28.6",
    "@babel/preset-env": "^7.28.6",
    "@babel/preset-react": "^7.28.5",
    "babel-loader": "^10.0.0",
    "css-loader": "^7.1.2",
    "html-webpack-plugin": "^5.6.6",
    "style-loader": "^4.0.0",
    "webpack": "^5.104.1",
    "webpack-cli": "^6.0.1",
    "webpack-dev-server": "^5.2.3"
  }
}
```

**erp-client/package.json:** (Same as above, different name)

### Step 3: Install Dependencies

```bash
cd erp-shell && npm install
cd ../erp-client && npm install
```

### Step 4: Create HTML Templates

**erp-shell/public/index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ERP Shell - Main Application</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

**erp-client/public/index.html:** (Same)

### Step 5: Create Babel Configuration

**.babelrc** (in both erp-shell and erp-client):
```json
{
  "presets": [
    ["@babel/preset-env", { "targets": { "browsers": ["last 2 versions"] } }],
    "@babel/preset-react"
  ]
}
```

### Step 6: Create Entry Files

**erp-shell/src/main.jsx:**
```jsx
import("./bootstrap");
```

**erp-shell/src/bootstrap.jsx:**
```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

**erp-shell/src/App.jsx:**
```jsx
import React, { Suspense, lazy } from "react";

const Login = lazy(() => import("authApp/Login"));

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>ERP Shell - Main Application</h1>
      <p>This is the host/container application</p>
      <hr />
      <h2>Remote Module (Auth App):</h2>
      <Suspense fallback={<div>Loading Login component...</div>}>
        <Login />
      </Suspense>
    </div>
  );
}
```

**erp-client/src/main.jsx:**
```jsx
import("./bootstrap");
```

**erp-client/src/bootstrap.jsx:**
```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

**erp-client/src/App.jsx:**
```jsx
import React from "react";

export default function App() {
  return (
    <div>
      <h1>ERP Client - Auth Module</h1>
      <p>React + Webpack Module Federation</p>
    </div>
  );
}
```

**erp-client/src/Login.jsx:**
```jsx
import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password });
    alert("Login successful!");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", maxWidth: "300px" }}>
      <h3>Login Form</h3>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
```

---

## Configuration Details

### Webpack Configuration - Remote Module (erp-client)

**webpack.config.js:**
```javascript
const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/main.jsx",
  output: {
    publicPath: "auto",
  },
  devServer: {
    port: 3001,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "authApp",                          // ⭐ Remote module name
      filename: "remoteEntry.js",               // ⭐ Entry point file
      exposes: {
        "./Login": "./src/Login.jsx",           // ⭐ Exposed component
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
          strictVersion: false,
          eager: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false,
          strictVersion: false,
          eager: false,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```

### Webpack Configuration - Host Module (erp-shell)

**webpack.config.js:**
```javascript
const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/main.jsx",
  output: {
    publicPath: "auto",
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "erpShell",
      remotes: {
        authApp: "authApp@http://localhost:3001/remoteEntry.js", // ⭐ Load remote
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
          strictVersion: false,
          eager: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false,
          strictVersion: false,
          eager: false,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```

### Key Configuration Options

| Option | Purpose |
|--------|---------|
| `name` | Unique identifier for the module |
| `filename` | Output file name for the module entry |
| `exposes` | Components/modules to expose to other apps |
| `remotes` | Remote modules to consume |
| `shared` | Shared dependencies between modules |
| `singleton: true` | Only one instance across all apps |
| `eager: false` | Wait for module initialization |
| `strictVersion: false` | Allow version mismatches |

---

## Running the Application

### Terminal 1: Start Remote Module (Auth App)

```bash
cd erp-client
npm start
# Runs on http://localhost:3001
```

### Terminal 2: Start Host Module (Shell App)

```bash
cd erp-shell
npm start
# Runs on http://localhost:3000
```

### Expected Output

```
[webpack-dev-server] Server started: Hot Module Replacement enabled, Live Reloading enabled
[webpack-dev-server] http://localhost:3000
```

### Access the Application

Open browser and go to: **http://localhost:3000**

You should see:
- ERP Shell heading
- Remote Login form loaded from erp-client module

---

## Best Practices

### 1. **Bootstrap Pattern** ✅

Always use dynamic imports to defer module loading:

```jsx
// main.jsx - CORRECT
import("./bootstrap");

// bootstrap.jsx - CORRECT
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

**Why?** Ensures shared modules are initialized before importing React.

### 2. **Shared Dependencies**

Always declare shared libraries in Module Federation config:

```javascript
shared: {
  react: {
    singleton: true,           // Single instance
    requiredVersion: false,     // Flexible versions
    strictVersion: false,       // Allow mismatches
    eager: false,              // Deferred loading
  },
  "react-dom": { /* ... */ },
  // Add other shared libs
}
```

### 3. **Lazy Loading**

Use React Suspense for remote components:

```jsx
const Login = lazy(() => import("authApp/Login"));

<Suspense fallback={<div>Loading...</div>}>
  <Login />
</Suspense>
```

### 4. **Error Boundaries**

Wrap remote components with error handling:

```jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error loading component</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 5. **Version Management**

Keep dependencies synchronized:

```bash
# In both apps
npm install react@18.2.0 react-dom@18.2.0
```

### 6. **Port Management**

- Host: 3000
- Remote 1: 3001
- Remote 2: 3002
- etc.

Document all ports in a config file:

```javascript
// config.js
export const PORTS = {
  SHELL: 3000,
  AUTH_APP: 3001,
  INVENTORY_APP: 3002,
};
```

### 7. **Code Splitting**

Only expose necessary components:

```javascript
exposes: {
  "./Login": "./src/Login.jsx",        // ✅ Expose
  "./config": "./src/config.jsx",      // ✅ Expose
  // Don't expose internals
}
```

---

## Troubleshooting

### Issue 1: "Shared module is not available for eager consumption"

**Error:**
```
Shared module is not available for eager consumption: webpack/sharing/consume/default/react/react
```

**Solution:**
Use bootstrap pattern (dynamic imports) ✅

```jsx
// main.jsx
import("./bootstrap");
```

---

### Issue 2: "Module not found: Can't resolve './App'"

**Error:**
```
Module not found: Error: Can't resolve './App' in 'F:\path\to\src'
```

**Solution:**
Ensure files are in correct directory:
- Check file exists: `src/App.jsx`
- Check spelling matches
- Clear webpack cache: `rm -rf node_modules/.cache`

---

### Issue 3: "Can't connect to remote module"

**Error:**
```
Failed to load remoteEntry.js from http://localhost:3001
```

**Solution:**
1. Ensure remote app is running on correct port
2. Check CORS headers in devServer config:
   ```javascript
   devServer: {
     headers: {
       "Access-Control-Allow-Origin": "*",
     },
   }
   ```
3. Verify remote URL in webpack config

---

### Issue 4: "React is not defined" or "React version mismatch"

**Error:**
```
React is not defined / Different versions of React loaded
```

**Solution:**
Ensure shared config includes React:

```javascript
shared: {
  react: {
    singleton: true,
    requiredVersion: false,
  },
  "react-dom": {
    singleton: true,
    requiredVersion: false,
  },
}
```

---

### Issue 5: Hot Module Replacement (HMR) not working

**Solution:**
Enable HMR in devServer:

```javascript
devServer: {
  hot: true,
  historyApiFallback: true,
}
```

---

## Advanced Topics

### 1. Multiple Remote Modules

**webpack.config.js (Shell):**
```javascript
remotes: {
  authApp: "authApp@http://localhost:3001/remoteEntry.js",
  inventoryApp: "inventoryApp@http://localhost:3002/remoteEntry.js",
  dashboardApp: "dashboardApp@http://localhost:3003/remoteEntry.js",
}
```

**App.jsx:**
```jsx
const Login = lazy(() => import("authApp/Login"));
const Inventory = lazy(() => import("inventoryApp/Inventory"));
const Dashboard = lazy(() => import("dashboardApp/Dashboard"));
```

### 2. Bidirectional Sharing

Apps can both expose and consume:

```javascript
new ModuleFederationPlugin({
  name: "sharedApp",
  exposes: {
    "./utils": "./src/utils.js",
  },
  remotes: {
    otherApp: "otherApp@http://localhost:3002/remoteEntry.js",
  },
  shared: { react: { singleton: true } },
})
```

### 3. Production Build

```bash
npm run build
# Creates dist/ folder with optimized bundle
```

Deploy to CDN and update remote URLs:

```javascript
remotes: {
  authApp: "authApp@https://cdn.example.com/auth/remoteEntry.js",
}
```

### 4. Monorepo Structure

```
mono-repo/
├── packages/
│   ├── shell/
│   ├── auth-app/
│   ├── inventory-app/
│   └── shared/
├── lerna.json
├── package.json
└── .gitignore
```

### 5. Environment-based Configuration

```javascript
// webpack.config.js
const env = process.env.NODE_ENV;
const remoteUrl = env === "production" 
  ? "https://cdn.example.com/auth/remoteEntry.js"
  : "http://localhost:3001/remoteEntry.js";

new ModuleFederationPlugin({
  remotes: {
    authApp: `authApp@${remoteUrl}`,
  },
})
```

---

## Checklist for Production Deployment

- [ ] Version all dependencies
- [ ] Test all remote modules independently
- [ ] Set up error boundaries
- [ ] Configure environment-based remotes
- [ ] Enable code splitting
- [ ] Minify and optimize bundles
- [ ] Set CORS headers correctly
- [ ] Monitor remote module availability
- [ ] Implement fallback UI
- [ ] Document all exposed modules
- [ ] Version the API between modules
- [ ] Set up monitoring and logging
- [ ] Create deployment guide for team

---

## Quick Reference Commands

```bash
# Start development
npm start

# Production build
npm run build

# Clean cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check webpack configuration
npx webpack --version
```

---

## Resources & Further Reading

- [Webpack Module Federation Docs](https://webpack.js.org/concepts/module-federation/)
- [React Lazy & Suspense](https://react.dev/reference/react/lazy)
- [Micro Frontends Architecture](https://martinfowler.com/articles/micro-frontends.html)
- [Webpack 5 Docs](https://webpack.js.org/blog/webpack-5-release/)

---

## Support & Debugging

### Enable Debug Logging

```javascript
// webpack.config.js
module.exports = {
  infrastructureLogging: {
    level: 'info',
  },
  // ...
};
```

### Browser Console Debugging

```javascript
// Check loaded modules
console.log(window);

// Check shared containers
Object.keys(window.__webpack_share_scopes__)
```

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Production Ready ✅
