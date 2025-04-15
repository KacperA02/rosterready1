import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { GlobalRefreshProvider } from "./contexts/GlobalRefreshContext";
import { InboxCountProvider } from "./contexts/InboxCountContext";
import App from "./App";
import "./index.css";
import { SidebarProvider } from "./components/ui/sidebar";

// Properly nesting the context providers
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <InboxCountProvider> 
        <GlobalRefreshProvider>
          <AuthProvider>
            <SidebarProvider>
              <App />
            </SidebarProvider>
          </AuthProvider>
        </GlobalRefreshProvider>
      </InboxCountProvider>
    </BrowserRouter>
  </React.StrictMode>
);
