import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "../../components/forms/LoginForm";
import { Home } from "lucide-react";
import HomeImage from "../../assets/images/HomeImage.jpg";
// framer motion is a popular library for animations in react
import { motion } from "framer-motion";

const LoginPage = () => {
	const navigate = useNavigate();
	const { isAuthenticated, loading } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	if (loading) return <p className="text-center">Loading...</p>;

	return (
		<div className="flex justify-center items-center">
			{/* Home Icon */}
			<div
				onClick={() => navigate("/")}
				className="absolute top-4 left-4 z-50 flex items-center space-x-2 cursor-pointer"
			>
				<Home size={24} className="text-gray-500 hover:text-gray-700" />
				<span className="text-gray-500 hover:text-gray-700">Home</span>
			</div>

			{/* Main Container */}
			<div className="w-full max-w-screen-xl flex flex-col md:flex-row h-screen relative pt-4">
				{/* Left Section */}
				<div className="w-full md:w-1/2 relative h-64 md:h-full">
					<img
						src={HomeImage}
						alt="Background"
						className="absolute inset-0 object-cover w-full h-full"
					/>

					{/* (desktop) */}
					<motion.div
						initial={{ x: -100, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 1 }}
						className="hidden md:block absolute top-10 right-0 pr-4 text-6xl font-bold drop-shadow-lg"
					>
						Roster
					</motion.div>
				</div>

				{/* Right Section */}
				<div className="w-full md:w-1/2 flex flex-col justify-start items-center p-4 md:p-8 relative">
					{/* (desktop) */}
					<motion.div
						initial={{ x: 100, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 1 }}
						className="hidden md:block text-6xl absolute top-10 left-0 pl-4 leading-none font-extrabold text-green-500 drop-shadow-xl"
					>
						Ready
					</motion.div>

					{/* Static on small screens */}
					<div className="flex md:hidden justify-center w-full  text-2xl font-bold space-x-2">
						<span className="text-gray-800">Roster</span>
						<span className="text-green-600">Ready</span>
					</div>

					{/* Login Form */}
					<div className="mt-36 md:mt-32 w-full flex justify-center">
						<LoginForm />
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
