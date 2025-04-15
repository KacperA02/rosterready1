import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { UserAvailability } from "@/types/availability";
import { deleteUserAvailability } from "@/pages/availability/services/userAvailabilities";

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
      onDeleted?.(); // notify parent 
    } catch (err) {
      console.error("Failed to delete availability", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="shadow-md rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Availability</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          <Trash2 className="text-red-500 hover:text-red-700" size={18} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <span className="font-semibold">Day:</span> {availability.day.name}
        </div>
        <div>
          <span className="font-semibold">Approved:</span>{" "}
          {availability.approved ? (
            <span className="text-green-600">Yes</span>
          ) : (
            <span className="text-red-600">No</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAvailCard;
