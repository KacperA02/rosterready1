import { useState } from "react";
import {
	attachDaysToShift,
	removeDaysFromShift,
} from "./services/ShiftService";
import { DayResponse } from "@/types/shift";
import { Button } from "@/components/ui/button";

interface DaysAttachProps {
	shiftId: number;
	currentDays: DayResponse[];
	onClose: () => void;
	onUpdate: () => void;
}

const dayMapping = [
	{ id: 1, name: "Monday" },
	{ id: 2, name: "Tuesday" },
	{ id: 3, name: "Wednesday" },
	{ id: 4, name: "Thursday" },
	{ id: 5, name: "Friday" },
	{ id: 6, name: "Saturday" },
	{ id: 7, name: "Sunday" },
];

const DaysAttach: React.FC<DaysAttachProps> = ({
	shiftId,
	currentDays,
	onClose,
	onUpdate,
}) => {
	const originalDayIds = currentDays.map((day) => day.id);
	const [selectedDayIds, setSelectedDayIds] = useState<number[]>([
		...originalDayIds,
	]);

	const toggleDay = (id: number) => {
		setSelectedDayIds((prev) =>
			prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
		);
	};

	const handleSubmit = async () => {
		const toAttach = selectedDayIds.filter(
			(id) => !originalDayIds.includes(id)
		);
		const toRemove = originalDayIds.filter(
			(id) => !selectedDayIds.includes(id)
		);

		try {
			if (toAttach.length > 0) {
				await attachDaysToShift(shiftId, { day_ids: toAttach });
			}
			if (toRemove.length > 0) {
				await removeDaysFromShift(shiftId, { day_ids: toRemove });
			}
			onUpdate();
			onClose();
		} catch (error) {
			console.error("Error updating days:", error);
		}
	};

	return (
		<div>
			<h2 className="text-lg font-semibold">Edit Days for Shift</h2>
			<div className="grid grid-cols-2 gap-3">
				{dayMapping.map((day) => (
					<label key={day.id} className="flex items-center space-x-2">
						<input
							type="checkbox"
							checked={selectedDayIds.includes(day.id)}
							onChange={() => toggleDay(day.id)}
						/>
						<span>{day.name}</span>
					</label>
				))}
			</div>
			<div className="flex justify-end space-x-2">
				<Button variant="outline" onClick={onClose}>
					Cancel
				</Button>
				<Button onClick={handleSubmit}>Save</Button>
			</div>
		</div>
	);
};

export default DaysAttach;
