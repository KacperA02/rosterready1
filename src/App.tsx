import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import LoginPage from "./pages/auth/LoginPage";

// import About from "./pages/About";
// import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element= {<LoginPage/>}/>
        {/* <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}
