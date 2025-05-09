import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShiftResponse } from "@/types/shift";
import { useState } from "react";
import DaysAttach from "../DaysAttach";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditShift from "../Edit";
import { deleteShift } from "../services/ShiftService";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { PlusIcon } from "lucide-react";

interface ShiftCardProps {
	shift: ShiftResponse;
	onUpdate: () => void;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, onUpdate }) => {
	const [open, setOpen] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);

	const handleDelete = async () => {
		const success = await deleteShift(shift.id);
		if (success) {
			onUpdate();
			setOpenDeleteDialog(false);
		}
	};

	return (
		<>
			<Card className="p-4 shadow-lg rounded-lg border">
				<CardHeader className="flex justify-center">
					<CardTitle className="text-xl capitalize font-bold">
						{shift.name}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col ">
					{/* Left Content */}
					<div className="space-y-2">
						<p>
							<strong>Time:</strong> {shift.time_start} - {shift.time_end}
						</p>
						<p>
							<strong>Users Required:</strong> {shift.no_of_users}
						</p>
						<p className="flex items-center">
							<strong>Days Assigned:</strong>
							<TooltipProvider>
								<div className="flex gap-2 ml-2 items-center">
									{shift.days.length > 0 ? (
										shift.days.map((day) => (
											<Tooltip key={day.id}>
												<TooltipTrigger asChild>
													<div className="w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-default">
														{day.name.slice(0, 2).toUpperCase()}
													</div>
												</TooltipTrigger>
												<TooltipContent side="bottom">
													<p>{day.name}</p>
												</TooltipContent>
											</Tooltip>
										))
									) : (
										<span className="text-muted-foreground">No days attached</span>
									)}

									{/* Always show the Plus Icon */}
									<Tooltip>
										<TooltipTrigger asChild>
											<div
												className="w-8 h-8 flex items-center justify-center text-white rounded-full bg-stone-500 text-sm cursor-pointer"
												onClick={() => setOpen(true)}
											>
												<PlusIcon className="w-4 h-4" />
											</div>
										</TooltipTrigger>
										<TooltipContent side="bottom">
											Add or remove a day
										</TooltipContent>
									</Tooltip>
								</div>
							</TooltipProvider>
						</p>
					</div>
				</CardContent>

				{/* Bottom-right buttons */}
				<div className="flex justify-end space-x-2 pr-4">
					<Button variant="default" onClick={() => setOpenEditDialog(true)}>
						Edit Shift Details
					</Button>
					<AlertDialog
						open={openDeleteDialog}
						onOpenChange={setOpenDeleteDialog}
					>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">Delete Shift</Button>
						</AlertDialogTrigger>
						<AlertDialogContent className="bg-white">
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							</AlertDialogHeader>
							<div>This shift will be permanently deleted.</div>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									style={{ backgroundColor: "red", color: "white" }}
									onClick={handleDelete}
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</Card>

			{/* Modal for Days Attach */}
			{open && (
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent >
						<DaysAttach
							shiftId={shift.id}
							currentDays={shift.days}
							onClose={() => setOpen(false)}
							onUpdate={onUpdate}
						/>
					</DialogContent>
				</Dialog>
			)}

			{/* Modal for Editing Shift */}
			<EditShift
				shift={shift}
				open={openEditDialog}
				onClose={() => setOpenEditDialog(false)}
				onUpdate={onUpdate}
			/>
		</>
	);
};

export default ShiftCard;
