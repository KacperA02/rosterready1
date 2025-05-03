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
      <SheetContent side="right" className="w-full sm:max-w-md px-4">
        <SheetHeader>
          <SheetTitle className="text-xl mt-2">Create New Skill</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateExpertise();
          }}
          className="mt-6 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="expertise">Skill Name</Label>
            <Input
              id="expertise"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              placeholder="Enter skill name"
            />
          </div>

          <Button type="submit" className="w-full mt-2">
            Create
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ExpertiseCreateSheet;
