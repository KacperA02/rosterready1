import React, { useState, useEffect } from "react";
import { ShiftResponse } from "@/types/shift";
import { fetchShifts } from "./services/ShiftService";
import ShiftCard from "./components/ShiftCard";
import { Button } from "@/components/ui/button";
import CreateShiftSheet from "./Create";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ShowShift: React.FC = () => {
	const [shifts, setShifts] = useState<ShiftResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);
	const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

	const loadShifts = async () => {
		try {
			const data = await fetchShifts();
			setShifts(data);
		} catch (error) {
			console.error("Failed to load shifts:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadShifts();
	}, []);

	const handleAlert = (message: string, type: "success" | "error") => {
		setAlertMessage(message);
		setAlertType(type);
		setTimeout(() => {
			setAlertMessage(null);
		}, 3000);
	};

	if (loading) {
		return <div>Loading shifts...</div>;
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-4xl font-bold text-left mb-6">Shifts</h1>
				<Button
					variant="default"
					className="border border-black"
					onClick={() => setIsSheetOpen(true)}
				>
					Create Shift
				</Button>
			</div>

			{alertMessage && (
				<Alert
					className={`mt-4 ${
						alertType === "success"
							? "bg-green-100 text-green-800"
							: "bg-red-100 text-red-800"
					}`}
					variant="default"
				>
					<AlertTitle>
						{alertType === "success" ? "Success" : "Error"}
					</AlertTitle>
					<AlertDescription>{alertMessage}</AlertDescription>
				</Alert>
			)}

			{shifts.length === 0 ? (
				<div className="text-amber-600">
					<h4>No Shifts. Create one!</h4>
				</div>
			) : (
				shifts.map((shift) => (
					<ShiftCard key={shift.id} shift={shift} onUpdate={loadShifts} />
				))
			)}

			<CreateShiftSheet
				open={isSheetOpen}
				onOpenChange={setIsSheetOpen}
				onUpdate={loadShifts}
				setAlert={handleAlert}
			/>
		</div>
	);
};

export default ShowShift;
