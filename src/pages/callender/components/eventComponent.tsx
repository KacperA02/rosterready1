import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { View } from "react-big-calendar";

interface EventProps {
	event: {
		title: string;
		no_of_users?: number;
		users?: { first_name: string; last_name: string }[];
		locked?: boolean;
		trueEnd?: Date;
		start?: Date;
	};
	view?: View;
}

const EventComponent: React.FC<EventProps> = ({ event, view = "week" }) => {
	const [isLocked, setIsLocked] = useState(event?.locked || false);

	const handleLockToggle = () => {
		setIsLocked(!isLocked);
		// need to add call to actually lock/unlock the event in the backend
	};

	const cardClass = isLocked
		? "bg-red-100 border-red-500 text-red-800"
		: "bg-white border-gray-300 text-black";
	const buttonClass = "bg-transparent text-black border-2";

	if (view === "month") {
		return (
			<div className="text-xs font-medium text-white px-2 py-1 truncate">
				{event.title}
			</div>
		);
	}

	const formattedTime = event.start && event.trueEnd
		? `${event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${event.trueEnd.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
		: null;


	return (
		<Card className={`w-full border rounded-lg shadow-sm p-2 mb-2 ${cardClass}`}>
			<CardHeader className="p-1">
				<CardTitle className="font-semibold text-black truncate">
					{event.title}
					{formattedTime && (
					<p className="text-xs text-gray-600">
						🕒 {formattedTime} 
					</p>
				)}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-1 space-y-1">
				<div className="space-y-1">
					{event?.users && event.users.length > 0 ? (
						event.users.map((user, idx) => (
							<p key={idx} className="text-black">
								👥 {user.first_name} {user.last_name}
								<br />
							</p>
						))
					) : (
						<p className="text-black">👥 Not Generated</p>
					)}
				</div>

				{event.no_of_users !== undefined && (
					<Badge variant="outline" className="text-black border-gray-400">
						🧑‍💻 {event.no_of_users} required
					</Badge>
				)}

				

				{event.users !== undefined && (
					<div className="pt-1">
						<Button
							variant="outline"
							onClick={handleLockToggle}
							className={`h-7 px-3 text-xs ${buttonClass}`}
						>
							{isLocked ? "🔒 Locked" : "🔓 Unlocked"}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default EventComponent;
