import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExpertiseCreate, IExpertise } from "@/types/expertise";
import { createExpertise } from "@/pages/expertise/services/ExpertiseService";

interface ExpertiseCreateSheetProps {
  onExpertiseCreated: (newExpertise: IExpertise) => void;
}

const ExpertiseCreateSheet: React.FC<ExpertiseCreateSheetProps> = ({ onExpertiseCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newExpertise, setNewExpertise] = useState("");


  const handleCreateExpertise = async () => {
    if (!newExpertise.trim()) return;

    const expertiseData: ExpertiseCreate = { name: newExpertise };
    const createdExpertise = await createExpertise(expertiseData);

    if (createdExpertise) {
      onExpertiseCreated(createdExpertise); 
      setNewExpertise(""); 
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="text-black" variant="default">Create New Skill</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Skill</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <Label htmlFor="expertise">Skill Name</Label>
          <Input
            id="expertise"
            value={newExpertise}
            onChange={(e) => setNewExpertise(e.target.value)}
            placeholder="Enter expertise name"
          />
          <Button onClick={handleCreateExpertise} className="w-full mt-2">
            Submit
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExpertiseCreateSheet;
