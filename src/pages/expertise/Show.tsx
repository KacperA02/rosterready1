import React, { useEffect, useState } from "react";
import { IExpertise } from "@/types/expertise";
import { fetchAllExpertise } from "@/pages/expertise/services/ExpertiseService";
import ExpertiseCard from "./components/ExpertiseCard";
import ExpertiseCreateSheet from "./components/ExpertiseSheet";

const ShowExpertise: React.FC = () => {
	const [expertises, setExpertises] = useState<IExpertise[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [refreshShifts, setRefreshShifts] = useState(false);
	const [refreshUsers, setRefreshUsers] = useState(false);
	const [refreshExpertises, setRefreshExpertises] = useState(false);

	// Loading expertises when dependencies change
	useEffect(() => {
		const loadExpertises = async () => {
			try {
				const data = await fetchAllExpertise();
				setExpertises(data);
			} catch (error) {
				console.error("Failed to load expertises:", error);
			} finally {
				setLoading(false);
			}
		};

		loadExpertises();
	}, [refreshShifts, refreshUsers, refreshExpertises]);

	// Handling expertise creation
	const handleExpertiseCreated = (newExpertise: IExpertise) => {
		setExpertises((prev) => [...prev, newExpertise]);
	};

	// Loading state while fetching data
	if (loading) {
		return <div>Loading expertises...</div>;
	}

	return (
		<div className="space-y-4">
			{/* Header Section with Title and Create Expertise Button */}
			<div className="flex justify-between items-center">
				<h1 className="text-xl font-bold text-black">Expertises</h1>

				{/* Create New Expertise Button */}
				<div>
					<ExpertiseCreateSheet onExpertiseCreated={handleExpertiseCreated} />
				</div>
			</div>

			{/* Expertise List Section */}
			{expertises.length === 0 ? (
				<div className="text-gray-500">
					<h1>No expertises available</h1>
				</div>
			) : (
				expertises.map((expertise) => (
					<ExpertiseCard
						key={expertise.id}
						expertise={expertise}
						setRefreshShifts={setRefreshShifts}
						setRefreshUsers={setRefreshUsers}
						setRefreshExpertises={setRefreshExpertises}
					/>
				))
			)}
		</div>
	);
};

export default ShowExpertise;
