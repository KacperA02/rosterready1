import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvailability } from "@/types/availability";
import { toggleApproval } from "../services/teamAvailabilities";

interface Props {
  availability: UserAvailability;
  onToggled?: () => void;
}

const TeamAvailCard: FC<Props> = ({ availability, onToggled }) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await toggleApproval(availability.id);
      onToggled?.();
    } catch (err) {
      console.error("Failed to toggle approval", err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="shadow-lg rounded-xl p-6 ">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800 text-capitalize text-center">
          {availability.user?.first_name} {availability.user?.last_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="">
            <span className="font-medium">Day:</span> {availability.day.name}
          </div>
          <div className="">
            <span className="font-medium">Recurring:</span> Yes
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="">
            <span className="font-medium">Reason:</span> {availability.reason}
          </div>
          <div className="">
            <span className="font-medium">Approved:</span>{" "}
            {availability.approved ? (
              <span className="text-green-600">Yes</span>
            ) : (
              <span className="text-red-600">No</span>
            )}
          </div>
        </div>
        <div className="flex justify-end">
        <Button
          variant={availability.approved ? "destructive" : "default"}
          disabled={isToggling}
          onClick={handleToggle}
        >
          {availability.approved ? "Reject" : "Approve"}
        </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamAvailCard;
