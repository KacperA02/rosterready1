import { useState, useEffect } from "react";
import {
	fetchShiftById,
	updateShift,
} from "@/pages/shifts/services/ShiftService";
import { ShiftResponse } from "@/types/shift";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface EditShiftProps {
	shiftId: number;
	onShiftUpdated: () => void;
	onClose: () => void;
}

const EditShift: React.FC<EditShiftProps> = ({
	shiftId,
	onShiftUpdated,
	onClose,
}) => {
	const [shift, setShift] = useState<ShiftResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadShift = async () => {
			try {
				setLoading(true);
				const fetchedShift = await fetchShiftById(shiftId);
				setShift(fetchedShift);
			} catch (err) {
				setError("Failed to load shift data.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadShift();
	}, [shiftId]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (shift) {
			setShift({ ...shift, [e.target.name]: e.target.value });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!shift) return;

		try {
			setLoading(true);
			await updateShift(shiftId, shift);
			alert("Shift updated successfully!");
			onShiftUpdated();
			onClose();
		} catch (err) {
			setError("Error updating shift. Please try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <p>Loading shift details...</p>;
	if (error) return <p className="text-red-500">{error}</p>;
	if (!shift) return <p>No shift found.</p>;

	return (
		<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
			<h2 className="text-2xl font-semibold mb-4">Edit Shift</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700"
					>
						Shift Name
					</label>
					<Input
						type="text"
						id="name"
						name="name"
						value={shift.name}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="time_start"
						className="block text-sm font-medium text-gray-700"
					>
						Start Time
					</label>
					<Input
						type="time"
						id="time_start"
						name="time_start"
						value={shift.time_start}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="time_end"
						className="block text-sm font-medium text-gray-700"
					>
						End Time
					</label>
					<Input
						type="time"
						id="time_end"
						name="time_end"
						value={shift.time_end}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="task"
						className="block text-sm font-medium text-gray-700"
					>
						Task (optional)
					</label>
					<Textarea
						id="task"
						name="task"
						value={shift.task || ""}
						onChange={handleChange}
						placeholder="Optional task description"
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="no_of_users"
						className="block text-sm font-medium text-gray-700"
					>
						Number of Users
					</label>
					<Input
						type="number"
						id="no_of_users"
						name="no_of_users"
						value={shift.no_of_users}
						onChange={handleChange}
						min={1}
						max={5}
						required
					/>
				</div>

				<Button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
				>
					{loading ? "Updating..." : "Update Shift"}
				</Button>
			</form>
		</div>
	);
};

export default EditShift;
