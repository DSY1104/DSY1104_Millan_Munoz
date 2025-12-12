import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "sweetalert2/dist/sweetalert2.min.css";
import "/src/styles/main.css";
import App from "./App.jsx";
// import "./utils/userSwitcher"; // DISABLED: Incompatible with JWT authentication
import "./utils/userMockupInfo"; // Display user info in console

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
