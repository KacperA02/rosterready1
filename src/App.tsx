import { Routes, Route } from "react-router-dom";
import Home from "./pages/main/Home";
import LoginPage from "./pages/auth/LoginPage";
import { useAuth } from "./contexts/AuthContext";
import SidebarComp from "@/pages/main/SidebarComp";
import TeamDetails from "./pages/teams/Show";
import RegisterForm from "./components/forms/RegisterForm";
import NoTeam from "./pages/teams/NoTeam";
import PageNotFound from "@/pages/main/PageNotFound";
import CreateShift from "./pages/shifts/Create";
import CalendarsPage from "./pages/callender/calendarsPage";
import CalendarComponent from "./pages/callender/components/calendarComp";
import CreateTeam from "./pages/teams/Create";
import ShowShift from "./pages/shifts/Show";
import ShowExpertise from "./pages/expertise/Show";

export default function App() {
  const { isAuthenticated } = useAuth();

  let protectedRoutes;
  if (isAuthenticated) {
    protectedRoutes = (
      <>
        <Route path="/teams" element={<TeamDetails />} />
        <Route path="/teams/create" element={<CreateTeam />} />
        <Route path='/teams/shift/create' element={<CreateShift onClose={() => console.log('Close action triggered')} />}/>
        <Route path='/teams/shifts' element={<ShowShift/>}/>
        <Route path='/teams/expertise' element={<ShowExpertise/>}/>
        <Route path="/calendar" element={<CalendarsPage />} />

      </>
    );
  }
  let protectedSide;
  if (isAuthenticated) {
    protectedSide = (
    <SidebarComp />
    )
    
  }

  return (
    <div className="flex bg-background w-full text-foreground min-h-screen">
      {/* Sidebar with a fixed width */}
      {protectedSide}

      {/* Main Content - This will take the remaining space */}
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/no-team" element={<NoTeam />} />
          <Route path="/register" element={<RegisterForm />} />
          {protectedRoutes}
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </div>
    </div>
  );
}
