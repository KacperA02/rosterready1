import { UserAvailability } from "@/types/availability";
import { toggleAvailabilityApproval } from "../services/AvailbilityReq";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInboxCount } from "@/contexts/InboxCountContext"; 

interface AvailableCompProps {
  availability: UserAvailability;
  onApprovalToggle: (id: number) => void;
}

const AvailableComp: React.FC<AvailableCompProps> = ({ availability, onApprovalToggle }) => {
  const { setTotalInboxCount } = useInboxCount();  

  const handleToggle = async () => {
    const updated = await toggleAvailabilityApproval(availability.id);
    if (updated) {
      onApprovalToggle(availability.id); 
      setTotalInboxCount((prev) => prev - 1); 
    }
  };

  return (
    <Card className="w-full  mx-auto shadow-lg">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="font-medium">
            {availability.user.first_name} {availability.user.last_name}
          </p>
          <p className="text-sm text-muted-foreground">{availability.day.name}</p>
        </div>
        <Button
          variant="secondary"
          className={`px-4 py-2 text-black rounded-md ${availability.approved ? "bg-primary" : "bg-primary"}`}
          onClick={handleToggle}
        >
          {availability.approved ? "Approved" : "Approve"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AvailableComp;
