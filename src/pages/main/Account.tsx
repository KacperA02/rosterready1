import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/pages/teams/services/TeamService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";

interface IUsers {
	first_name: string;
	last_name: string;
	email: string;
	mobile_number: string;
}

const Account = () => {
	const [user, setUser] = useState<IUsers | null>(null);
	const { theme, toggleTheme } = useTheme();

	useEffect(() => {
		const getUserData = async () => {
			const userData = await fetchCurrentUser();
			if (userData) {
				setUser(userData);
			}
		};

		getUserData();
	}, []);

	const handleEditDetails = () => {
		console.log("Edit details clicked.");
	};

	const handleChangePassword = () => {
		console.log("Change password clicked.");
	};

	const handleDeleteAccount = () => {
		if (
			window.confirm(
				"Are you sure you want to delete your account? This action is permanent."
			)
		) {
			console.log("Account deleted.");
		}
	};

	if (!user) return <p>Loading...</p>;

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
				Account Details
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<Card>
					<CardHeader>
						<CardTitle className="text-xl font-semibold text-gray-700">
							Your Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<label className="block text-gray-600">First Name</label>
								<Input
									value={user.first_name}
									readOnly
									className="w-full"
									disabled
								/>
							</div>
							<div>
								<label className="block text-gray-600">Last Name</label>
								<Input
									value={user.last_name}
									readOnly
									className="w-full"
									disabled
								/>
							</div>
							<div>
								<label className="block text-gray-600">Email</label>
								<Input
									value={user.email}
									readOnly
									className="w-full"
									disabled
								/>
							</div>
							<div>
								<label className="block text-gray-600">Mobile Number</label>
								<Input
									value={user.mobile_number}
									readOnly
									className="w-full"
									disabled
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-4">
					<Button
						onClick={handleEditDetails}
						className="w-full bg-blue-500 hover:bg-blue-600"
					>
						Edit Details
					</Button>
					<Button
						onClick={handleChangePassword}
						className="w-full bg-green-500 hover:bg-green-600"
					>
						Change Password
					</Button>
					<Button
						onClick={handleDeleteAccount}
						className="w-full bg-red-500 hover:bg-red-600"
					>
						Delete Account
					</Button>
				</div>
			</div>

			<Button
				onClick={toggleTheme}
				className="w-full bg-gray-500 hover:bg-gray-600 flex items-center justify-center mb-4"
			>
				{theme === "light" ? (
					<FaMoon className="mr-2" />
				) : (
					<FaSun className="mr-2" />
				)}
				Toggle Theme
			</Button>
		</div>
	);
};

export default Account;
