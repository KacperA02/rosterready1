import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toggleAssignmentLock } from "../services/AssignmentService";
import { Users } from "lucide-react";
import { View } from "react-big-calendar";
import { useRoles } from "@/hooks/useRoles";

interface EventProps {
	event: {
		title: string;
		id: number;
		assignment_id?: number;
		no_of_users?: number;
		users?: { first_name: string; last_name: string }[];
		locked?: boolean;
		trueEnd?: Date;
		start?: Date;
		status?: string;
	};
	view?: View;
}

const EventComponent: React.FC<EventProps> = ({ event, view = "week" }) => {
	const [isLocked, setIsLocked] = useState(event?.locked || false);

	const handleLockToggle = async () => {
		if (!event?.assignment_id) {
			console.warn("Cannot toggle lock: No assignment_id.");
			return;
		}

		const success = await toggleAssignmentLock(event.assignment_id);

		if (success) {
			setIsLocked((prev) => !prev);
			console.log("Toggled lock for assignment_id:", event.assignment_id);
		} else {
			console.error(
				"Failed to toggle lock for assignment_id:",
				event.assignment_id
			);
		}
	};
	const { isEmployer } = useRoles();

	const cardClass = isLocked ? "bg-red-300 border-red-500" : "bg-primary ";

	if (view === "month") {
		return (
			<div className="text-xs font-medium text-white px-2 py-1 truncate">
				{event.title}
			</div>
		);
	}

	const formattedTime =
		event.start && event.trueEnd
			? `${event.start.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
			  })} - ${event.trueEnd.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
			  })}`
			: null;

	return (
		<Card
			className={`w-full h-full mt-2 p-4 mb-2 bg-primary flex flex-col border-none rounded-none ${cardClass}`}
		>
			{/* Top: Title and Time */}
			<div className="space-y-1 mb-2">
				<CardHeader className="p-0">
					<CardTitle className="font-semibold capitalize text-black ">
						{event.title}
					</CardTitle>
				</CardHeader>
				{formattedTime && (
					<p className="text-xs text-gray-600">{formattedTime}</p>
				)}
			</div>

			{/* Middle: Employees Section */}
			<div className="flex-1 flex flex-col items-center justify-center space-y-2 text-center">
				<div className="flex items-center gap-1 font-semibold text-black">
					<Users className="w-4 h-4" />
					<span className="text-sm">Employees</span>
				</div>

				{event?.users && event.users.length > 0 ? (
					<div className="space-y-1">
						{event.users.map((user, idx) => (
							<p key={idx} className="text-black ">
								{user.first_name} {user.last_name}
							</p>
						))}
					</div>
				) : (
					<p className="text-black truncate">Not Generated</p>
				)}

				{(!event?.users || event.users.length === 0) &&
					event.no_of_users !== undefined && (
						<Badge variant="outline">
							{event.no_of_users} required
						</Badge>
					)}
			</div>

			{/* Bottom: Button */}
			{event.users !== undefined &&
				event.status !== "ACTIVE" &&
				isEmployer() && (
					<div className="pt-2 mt-2">
						<Button
							variant="secondary"
							onClick={handleLockToggle}
							className="w-full"
						>
							{isLocked ? "🔒 Locked" : "🔓 Unlocked"}
						</Button>
					</div>
				)}
		</Card>
	);
};

export default EventComponent;
