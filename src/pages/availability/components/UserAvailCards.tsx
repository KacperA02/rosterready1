import { FC, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { UserAvailability } from "@/types/availability";
import { deleteUserAvailability } from "@/pages/availability/services/userAvailabilities";
import { Badge } from "@/components/ui/badge";

interface Props {
	availability: UserAvailability;
	onDeleted?: () => void;
}

const UserAvailCard: FC<Props> = ({ availability, onDeleted }) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteUserAvailability(availability.id);
			onDeleted?.();
		} catch (err) {
			console.error("Failed to delete availability", err);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Card className="rounded-2xl shadow-sm border border-muted pb-0! p-4 hover:shadow-lg transition-shadow duration-200 ease-in-out">
			<div className="relative flex items-center justify-between">
				{/* Left: Day */}
				<p className="text-md font-semibold text-muted-foreground">
						{availability.day.name}
					</p>

				{/* Center: Status Badge */}
				<div className="absolute left-1/2 transform -translate-x-1/2">
          <div>
            
					{availability.approved ? (
						<Badge className="bg-green-500">Approved</Badge>
					) : (
						<Badge className="bg-red-500">Pending</Badge>
					)}
				</div>
				</div>

				{/* Right: Delete Button */}
				<Button
					variant="destructive"
					size="icon"
					onClick={handleDelete}
					disabled={isDeleting}
				>
					<Trash2 size={18} />
				</Button>
			</div>

			<CardContent className="p-0 m-0" />
		</Card>
	);
};

export default UserAvailCard;
