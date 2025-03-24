import { Routes, Route } from "react-router-dom";
import Home from "./pages/main/Home";
import LoginPage from "./pages/auth/LoginPage";
import { useAuth } from "./contexts/AuthContext"
// import About from "./pages/About";
// import NotFound from "./pages/NotFound";
import NavBar from "./pages/main/Navbar";
import TeamDetails from "./pages/teams/Show";
import RegisterForm from "./components/forms/RegisterForm";
import NoTeam from "./pages/teams/NoTeam";

export default function App() {
  const { isAuthenticated } = useAuth();
  let protectedRoutes;
  if(isAuthenticated){
    protectedRoutes = (
      <>
      <Route path='/teams' element={<TeamDetails />}/>
      </>
    );
  }
	return (
    
		<div className="bg-background full-width text-foreground">
      <NavBar/>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<LoginPage />} />
        <Route path="/no-team" element={<NoTeam />} />
        <Route path="/register" element={<RegisterForm />} />
				{protectedRoutes}
        
			</Routes>
		</div>
	);
}
