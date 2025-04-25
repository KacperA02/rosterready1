import { Routes, Route } from "react-router-dom";
import Home from "./pages/main/Home";
import LoginPage from "./pages/auth/LoginPage";
import { useAuth } from "./contexts/AuthContext";
import SidebarComp from "@/pages/main/SidebarComp";
import TeamDetails from "./pages/teams/Show";
import RegisterForm from "./components/forms/RegisterForm";
import NoTeam from "./pages/teams/NoTeam";
import PageNotFound from "@/pages/main/PageNotFound";
// import CreateShift from "./pages/shifts/Create";
import CalendarsPage from "./pages/callender/calendarsPage";
import CreateTeam from "./pages/teams/Create";
import ShowShift from "./pages/shifts/Show";
import ShowExpertise from "./pages/expertise/Show";
import NotificationListener from "@/components/NotificationListerner";
import InboxPage from "./pages/Inbox/Inbox";
import ViewTeamAvailabilities from "./pages/availability/viewTeamAvailabilities";
import ViewUserAvailabilities from "./pages/availability/viewUserAvailabilities";
import ViewUsers from "./pages/teams/viewUsers";
import { useRoles } from "./hooks/useRoles";
export default function App() {
  const { isAuthenticated } = useAuth();
  const { isEmployer } = useRoles(); 
  let protectedRoutes;
  if (isAuthenticated) {
    protectedRoutes = (
      <>
        <Route path="/teams" element={<TeamDetails />} />
        <Route path="/teams/create" element={<CreateTeam />} />
        <Route path="/calendar" element={<CalendarsPage />} />
        <Route path="/myAvailability" element={<ViewUserAvailabilities />} />
        {isEmployer() && (
          <>
          <Route path="/employees" element={<ViewUsers />} />
          <Route path="/teamAvailabilities" element={<ViewTeamAvailabilities />} />
          <Route path='/teams/shifts' element={<ShowShift/>}/>
          <Route path='/teams/expertise' element={<ShowExpertise/>}/>
          </>
        )}
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
      <NotificationListener />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/inbox" element={<InboxPage />} />
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
