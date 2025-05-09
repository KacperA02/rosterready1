import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { GlobalRefreshProvider } from "./contexts/GlobalRefreshContext";
import { InboxCountProvider } from "./contexts/InboxCountContext";
import App from "./App";
import "./index.css";
import { SidebarProvider } from "./components/ui/sidebar";
import { ThemeProvider } from "./contexts/ThemeContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
    <ThemeProvider>
    <GlobalRefreshProvider>
      <InboxCountProvider> 
          <AuthProvider>
            <SidebarProvider>
              <App />
            </SidebarProvider>
          </AuthProvider>
      </InboxCountProvider>
      </GlobalRefreshProvider>
      </ThemeProvider>
    </BrowserRouter>
);
