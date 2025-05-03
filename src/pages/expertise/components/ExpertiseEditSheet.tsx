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
				<Button className="mt-2" variant="default">
					Edit Skill Name
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:max-w-md px-4">
				<SheetHeader>
					<SheetTitle className="text-xl mt-2">Edit Skill</SheetTitle>
				</SheetHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleUpdate();
					}}
					className=" space-y-4"
				>
					<div className="space-y-2">
						<Label htmlFor="name">Skill Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter skill name"
						/>
					</div>

					<Button type="submit" className="w-full mt-2">
						Save Changes
					</Button>
				</form>
			</SheetContent>
		</Sheet>
	);
};

export default ExpertiseEditSheet;
