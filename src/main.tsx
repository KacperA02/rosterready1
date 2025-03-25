import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";
import { SidebarProvider } from "./components/ui/sidebar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    
    <AuthProvider>
   
      <BrowserRouter>
      <SidebarProvider>
        <App />
      </SidebarProvider>
      </BrowserRouter>
     
    </AuthProvider>
    
  </React.StrictMode>
);
