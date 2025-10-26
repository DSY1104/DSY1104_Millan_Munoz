import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "/src/styles/main.css";
import App from "./App.jsx";
import "./utils/userSwitcher"; // Enable user switching in console
import "./utils/userMockupInfo"; // Display user info in console

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
