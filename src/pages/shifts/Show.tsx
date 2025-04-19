import { useEffect, useState } from "react";
import { ShiftResponse } from "@/types/shift";
import { fetchShifts } from "./services/ShiftService";
import ShiftCard from "./components/ShiftCard";
import { Button } from "@/components/ui/button";
import CreateShiftSheet from "./Create";

const ShowShift: React.FC = () => {
	const [shifts, setShifts] = useState<ShiftResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

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

	if (loading) {
		return <div>Loading shifts...</div>;
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-xl font-bold text-black">Shifts</h1>
				<Button
					variant="outline"
					className="text-black border border-black"
					onClick={() => setIsSheetOpen(true)}
				>
					Create Shift
				</Button>
			</div>

			{shifts.length === 0 ? (
				<div className="text-amber-600">
					<h3>No Shifts. Create one!</h3>
				</div>
			) : (
				shifts.map((shift) => (
					<ShiftCard key={shift.id} shift={shift} onUpdate={loadShifts} />
				))
			)}

			{isSheetOpen && (
				<CreateShiftSheet onClose={() => setIsSheetOpen(false)} />
			)}
		</div>
	);
};

export default ShowShift;
