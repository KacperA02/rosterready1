import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateShift } from "./services/ShiftService";
import { ShiftResponse, ShiftCreate } from "@/types/shift";

interface EditShiftProps {
	shift: ShiftResponse;
	onClose: () => void;
	onUpdate: () => void;
}

const EditShift: React.FC<EditShiftProps> = ({ shift, onClose, onUpdate }) => {
	const [formData, setFormData] = useState<ShiftCreate>({
		name: shift.name,
		time_start: shift.time_start,
		time_end: shift.time_end,
		task: shift.task || "",
		no_of_users: shift.no_of_users,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const updatedShift = await updateShift(shift.id, formData);

		if (updatedShift) {
			onUpdate();
			onClose();
		} else {
			alert("Failed to update the shift.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 bg-white p-6 rounded-lg shadow-lg"
		>
			<div>
				<Label htmlFor="name">Shift Name</Label>
				<Input
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="Shift Name"
				/>
			</div>

			<div>
				<Label htmlFor="time_start">Start Time</Label>
				<Input
					id="time_start"
					name="time_start"
					type="time"
					value={formData.time_start}
					onChange={handleChange}
				/>
			</div>

			<div>
				<Label htmlFor="time_end">End Time</Label>
				<Input
					id="time_end"
					name="time_end"
					type="time"
					value={formData.time_end}
					onChange={handleChange}
				/>
			</div>

			<div>
				<Label htmlFor="task">Task (Optional)</Label>
				<Input
					id="task"
					name="task"
					value={formData.task}
					onChange={handleChange}
					placeholder="Task description (optional)"
				/>
			</div>

			<div>
				<Label htmlFor="no_of_users">Users Required</Label>
				<Input
					id="no_of_users"
					name="no_of_users"
					type="number"
					value={formData.no_of_users}
					onChange={handleChange}
					placeholder="Number of users"
				/>
			</div>

			<div className="mt-4 flex space-x-2 justify-end">
				<Button variant="outline" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="outline" type="submit">
					Save Changes
				</Button>
			</div>
		</form>
	);
};

export default EditShift;
