import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRoles } from "../../hooks/useRoles";
import { createShift } from "@/pages/shifts/services/ShiftService";
import { ShiftCreate } from "@/types/shift";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface CreateShiftProps {
	selectedDate: Date | null;
	onShiftCreated: (shiftId: number) => Promise<void>;
	onClose: () => void;
}

const CreateShift: React.FC<CreateShiftProps> = ({
	selectedDate,
	onShiftCreated,
	onClose,
}) => {
	const { isAuthenticated } = useAuth();
	const { isEmployer, isAdmin } = useRoles();

	const [shift, setShift] = useState<ShiftCreate>({
		name: "",
		time_start: "",
		time_end: "",
		task: "",
		no_of_users: 1,
	});

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!isEmployer() && !isAdmin()) {
			alert("Unauthorized access.");
			onClose();
		}
	}, [isEmployer, isAdmin, onClose]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setShift({
			...shift,
			[e.target.name]: e.target.value,
		});
	};

	const handleNoOfUsersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value ? parseInt(e.target.value) : 1;
		setShift({
			...shift,
			no_of_users: value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isAuthenticated) {
			setError("You must be logged in to create a shift.");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			console.log("Form Data (Shift):", shift);

			const response = await createShift(shift);

			if (response && selectedDate) {
				alert("Shift created successfully!");
				await onShiftCreated(response.id);
				onClose();
			} else {
				setError("Error creating shift. Please try again.");
			}
		} catch (err) {
			setError("Error creating shift. Please try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
			<h2 className="text-2xl font-semibold mb-4">Create New Shift</h2>

			{error && <div className="text-red-500 mb-4">{error}</div>}

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
						value={shift.task}
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
						onChange={handleNoOfUsersChange}
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
					{loading ? "Creating..." : "Create Shift"}
				</Button>
			</form>
		</div>
	);
};

export default CreateShift;
