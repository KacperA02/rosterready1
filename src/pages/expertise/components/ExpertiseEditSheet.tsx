import { useState, useEffect } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IExpertise, ExpertiseCreate } from "@/types/expertise";
import { updateExpertise } from "@/pages/expertise/services/ExpertiseService";

interface ExpertiseEditSheetProps {
	expertise: IExpertise;
	setRefreshExpertises: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpertiseEditSheet: React.FC<ExpertiseEditSheetProps> = ({
	expertise,
	setRefreshExpertises,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState(expertise.name);

	useEffect(() => {
		setName(expertise.name);
	}, [expertise.name]);

	const handleUpdate = async () => {
		if (!name.trim()) return;
		const updatedExpertise = await updateExpertise(expertise.id, {
			name,
		} as ExpertiseCreate);
		if (updatedExpertise) {
			setRefreshExpertises(true);
			setIsOpen(false);
		}
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button className="mt-2" variant="outline">
					Edit
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit Expertise</SheetTitle>
				</SheetHeader>
				<div className="space-y-4 mt-4">
					<Label htmlFor="name">Expertise Name</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Button onClick={handleUpdate} className="w-full mt-2">
						Save Changes
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default ExpertiseEditSheet;
