import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShiftResponse } from "@/types/shift";
import { IShift } from "@/types/expertise";
import { fetchShifts } from "@/pages/shifts/services/ShiftService";
import {
	assignExpertiseToShift,
	removeExpertiseFromShift,
} from "../services/ExpertiseService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ShiftsSheetProps {
	expertiseId: number;
	assignedShifts: IShift[];
	onClose: () => void;
	setRefreshShifts: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AttachShiftSheet: React.FC<ShiftsSheetProps> = ({
	expertiseId,
	assignedShifts,
	setRefreshShifts,
}) => {
	const [allShifts, setAllShifts] = useState<ShiftResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);
	const [alertError, setAlertError] = useState<boolean>(false);

	useEffect(() => {
		const loadShifts = async () => {
			const fetchedShifts = await fetchShifts();
			setAllShifts(fetchedShifts);
			setLoading(false);
		};

		loadShifts();
	}, []);

	const handleToggleShiftAssignment = async (
		shift: ShiftResponse,
		isAssigned: boolean
	) => {
		let result = null;

		if (isAssigned) {
			result = await removeExpertiseFromShift(expertiseId, shift.id);
			if (result) {
				setAlertMessage("Shift removed from expertise.");
				setAlertError(false);
			} else {
				setAlertMessage("Error removing shift.");
				setAlertError(true);
			}
		} else {
			result = await assignExpertiseToShift(expertiseId, shift.id);
			if (result) {
				setAlertMessage("Shift assigned successfully!");
				setAlertError(false);
			} else {
				setAlertMessage("Error assigning shift.");
				setAlertError(true);
			}
		}

		if (result) {
			setRefreshShifts(true);
		}
	};

	if (loading) {
		return <div>Loading shifts...</div>;
	}

	return (
		<div>
			<div className="bg-white p-6">
				<h2 className="text-xl font-semibold mb-4">Manage Shift Expertise</h2>

				{alertMessage && (
					<Alert
						variant={alertError ? "destructive" : "default"}
						className="mb-4"
					>
						<AlertTitle>{alertError ? "Error" : "Success"}</AlertTitle>
						<AlertDescription>{alertMessage}</AlertDescription>
					</Alert>
				)}

				{allShifts.length > 0 ? (
					<ul className="space-y-2 max-h-80 overflow-y-auto">
						{allShifts.map((shift) => {
							const isAssigned = assignedShifts.some((s) => s.id === shift.id);

							return (
								<li
									key={shift.id}
									className="p-2 cursor-pointer rounded-lg hover:bg-gray-200"
								>
									<div className="flex items-center justify-between">
										<span>{shift.name}</span>
										<Button
											variant={isAssigned ? "destructive" : "outline"}
											onClick={() =>
												handleToggleShiftAssignment(shift, isAssigned)
											}
										>
											{isAssigned ? "Remove" : "Assign"}
										</Button>
									</div>
								</li>
							);
						})}
					</ul>
				) : (
					<p className="text-gray-500">No shifts available</p>
				)}

			</div>
		</div>
	);
};
