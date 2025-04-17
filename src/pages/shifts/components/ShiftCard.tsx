import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShiftResponse } from "@/types/shift";

interface ShiftCardProps {
	shift: ShiftResponse;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
	const { name, time_start, time_end, task, no_of_users, days } = shift;

	return (
		<Card className="p-4 shadow-lg rounded-lg border">
			<CardHeader className="flex justify-center">
				<CardTitle className="text-xl capitalize font-bold">{name}</CardTitle>
			</CardHeader>
			<CardContent className="flex space-x-8">
				{/* Left Content: Time, Users, Days */}
				<div className="space-y-2 flex-1">
					<p>
						<strong>Time:</strong> {time_start} - {time_end}
					</p>
					<p>
						<strong>Users Required:</strong> {no_of_users}
					</p>
					<p>
						<strong>Days:</strong>
						<div className="flex flex-wrap gap-2">
							{days.map((day) => (
								<div key={day.id} className="relative group">
									<div
										className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm cursor-pointer"
										title={day.name}
									>
										{day.name.slice(0, 2).toUpperCase()}
									</div>
									<div className="absolute left-0 bottom-0 bg-black text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
										{day.name}
									</div>
								</div>
							))}
						</div>
					</p>
				</div>

				{/* Right Content: Task and Buttons */}
				<div className="flex flex-col justify-between items-end w-48">
					<div className="text-right">
						<p>
							<strong>Task:</strong> {task ?? "No task assigned"}
						</p>
					</div>
					{/* Flex container for buttons on bottom right */}
					<div className="mt-4 flex space-x-2 justify-end">
						<Button variant="outline">Edit Repeated Days</Button>
						<Button variant="outline">Edit Shift Details</Button>
						<Button variant="outline">Delete Shift</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ShiftCard;
