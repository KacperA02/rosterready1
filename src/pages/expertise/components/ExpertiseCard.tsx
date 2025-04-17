import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IExpertise } from "@/types/expertise";
import { AttachShiftSheet } from "./AttachShiftsSheet";
import { AttachUserSheet } from "./AttachUsersSheet";
import ExpertiseEditSheet from "./ExpertiseEditSheet";

interface ExpertiseCardProps {
	expertise: IExpertise;
	setRefreshShifts: React.Dispatch<React.SetStateAction<boolean>>;
	setRefreshUsers: React.Dispatch<React.SetStateAction<boolean>>;
	setRefreshExpertises: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({
	expertise,
	setRefreshShifts,
	setRefreshUsers,
	setRefreshExpertises,
}) => {
	const { name, users, shifts, id, team_id } = expertise;

	const [isShiftsSheetOpen, setIsShiftsSheetOpen] = useState(false);
	const [isUsersSheetOpen, setIsUsersSheetOpen] = useState(false);

	const handleAttachUsersClick = () => {
		setIsUsersSheetOpen(true);
	};

	const handleCloseUsersSheet = () => {
		setIsUsersSheetOpen(false);
	};

	const handleAttachShiftsClick = () => {
		setIsShiftsSheetOpen(true);
	};

	const handleCloseShiftsSheet = () => {
		setIsShiftsSheetOpen(false);
	};

	// gets the intials of the user
	const getUserInitials = (user: { first_name: string; last_name: string }) => {
		// first letters of the first and last name
		return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
	};

	// gets the intials of the shift
	const getShiftInitials = (shiftName: string) => {
		// first two letters of the shift name
		return shiftName.slice(0, 2).toUpperCase();
	};

	return (
		<>
			<Card className="p-4 shadow-lg rounded-lg border">
				<CardHeader className="text-center">
					<CardTitle className="text-xl font-bold capitalize">
						{name}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<p className="font-semibold">Users Assigned:</p>
					{users.length > 0 ? (
						<div className="flex flex-wrap space-x-2">
							{users.map((user) => (
								<div key={user.id} className="relative group">
									<div
										// tags
										className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-sm cursor-pointer"
										title={`${user.first_name} ${user.last_name}`}
									>
										{getUserInitials(user)}
									</div>
									{/* hover css */}
									<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
										<span className="bg-black text-white text-xs py-1 px-2 rounded-md">{`${user.first_name} ${user.last_name}`}</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500">No users assigned</p>
					)}

					<p className="font-semibold">Shifts Assigned:</p>
					{shifts.length > 0 ? (
						<div className="flex flex-wrap space-x-2">
							{shifts.map((shift) => (
								<div key={shift.id} className="relative group">
									<div
										// tags
										className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-sm cursor-pointer"
										title={shift.name}
									>
										{getShiftInitials(shift.name)}
									</div>
									{/* hover css */}
									<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
										<span className="bg-black text-white text-xs py-1 px-2 rounded-md">
											{shift.name}
										</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500">No shifts assigned</p>
					)}

					{/* Action Buttons */}
					<div className="mt-6 flex justify-end flex-wrap gap-2">
						<ExpertiseEditSheet
							expertise={expertise}
							onUpdate={() => setRefreshExpertises(true)}
						/>
						<Button
							variant="outline"
							className="mt-2"
							onClick={handleAttachShiftsClick}
						>
							Attach Shifts
						</Button>
						<Button
							variant="outline"
							className="mt-2"
							onClick={handleAttachUsersClick}
						>
							Attach Users
						</Button>
						<Button variant="outline" className="mt-2">
							Delete
						</Button>
					</div>
				</CardContent>
			</Card>

			{isShiftsSheetOpen && (
				<AttachShiftSheet
					expertiseId={id}
					assignedShifts={shifts}
					onClose={handleCloseShiftsSheet}
					setRefreshShifts={setRefreshShifts}
				/>
			)}
			{isUsersSheetOpen && (
				<AttachUserSheet
					expertiseId={id}
					assignedUsers={users}
					onClose={handleCloseUsersSheet}
					setRefreshUsers={setRefreshUsers}
					teamId={team_id}
				/>
			)}
		</>
	);
};

export default ExpertiseCard;
