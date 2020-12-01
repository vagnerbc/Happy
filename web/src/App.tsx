import React from "react";
import Routes from "./routes";

import { AuthProvider } from "./contexts/auth";

import dotEnv from "dotenv";

import "./styles/global.css";
import "leaflet/dist/leaflet.css";

dotEnv.config();

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
