import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import UserAvailCard from "./components/UserAvailCards";
import { fetchUserAvailabilities } from "./services/userAvailabilities";
import { UserAvailability } from "@/types/availability";
import CreateAvailabilityForm from "./components/CreateAvilabilityForm";

const ViewUserAvailabilities = () => {
  const [availabilities, setAvailabilities] = useState<UserAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const loadAvailabilities = async () => {
    setLoading(true);
    const data = await fetchUserAvailabilities();
    setAvailabilities(data);
    setLoading(false);
  };

  const handleDeleted = (id: number) => {
    setAvailabilities((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreated = () => {
    loadAvailabilities();
    setSheetOpen(false);
  };

  useEffect(() => {
    loadAvailabilities();
  }, []);

  if (loading) return <div>Loading user availabilities...</div>;

  const orderedDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const sortedAvailabilities = [...availabilities].sort((a, b) => {
    return (
      orderedDays.indexOf(a.day.name) - orderedDays.indexOf(b.day.name)
    );
  });

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-left mb-6">My Availabilities</h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="text-black">Create New Availability</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[500px]">
            <h2 className="text-xl font-medium pt-5 ml-2">New Availability</h2>
            <CreateAvailabilityForm onCreated={handleCreated} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedAvailabilities.map((availability) => (
          <UserAvailCard
            key={availability.id}
            availability={availability}
            onDeleted={() => handleDeleted(availability.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewUserAvailabilities;
