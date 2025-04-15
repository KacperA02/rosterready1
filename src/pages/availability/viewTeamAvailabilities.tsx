import { useEffect, useState } from "react";
import TeamAvailCard from "./components/TeamAvailCard";
import { fetchTeamAvailabilities } from "./services/teamAvailabilities";
import { UserAvailability } from "@/types/availability";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const weekdayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ViewTeamAvailabilities = () => {
  const [availabilities, setAvailabilities] = useState<UserAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  const [dayFilter, setDayFilter] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [userFilter, setUserFilter] = useState<{
    id: number;
    first_name: string;
    last_name: string;
  } | null>(null);
  const [approvalFilter, setApprovalFilter] = useState<boolean | null>(null);

  const loadAvailabilities = async () => {
    setLoading(true);
    const data = await fetchTeamAvailabilities();
    setAvailabilities(data);
    setLoading(false);
  };

  const handleToggled = (id: number) => {
    setAvailabilities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, approved: !a.approved } : a))
    );
  };

  useEffect(() => {
    loadAvailabilities();
  }, []);

  const filteredAvailabilities = availabilities.filter((a) => {
    const matchDay = dayFilter ? a.day?.id === dayFilter.id : true;
    const matchUser = userFilter ? a.user?.id === userFilter.id : true;
    const matchApproval =
      approvalFilter !== null ? a.approved === approvalFilter : true;
    return matchDay && matchUser && matchApproval;
  });

  const uniqueUsers = Array.from(
    new Map(availabilities.map((a) => [a.user?.id, a.user])).values()
  );

  const uniqueDays = Array.from(
    new Map(availabilities.map((a) => [a.day?.id, a.day])).values()
  ).sort((a, b) => {
    return weekdayOrder.indexOf(a.name) - weekdayOrder.indexOf(b.name);
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold text-left mb-6">Team Availabilities</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Day Filter */}
        <Select
          onValueChange={(val) => {
            const selectedDay = uniqueDays.find((day) => day.name === val);
            setDayFilter(selectedDay || null);
          }}
          value={dayFilter ? dayFilter.name : "all"} 
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Days</SelectItem> 
            {uniqueDays.map((day) =>
              day ? (
                <SelectItem key={day.id} value={day.name}>
                  {day.name}
                </SelectItem>
              ) : null
            )}
          </SelectContent>
        </Select>

        {/* User Filter */}
        <Select
          onValueChange={(val) => {
            const selectedUser = uniqueUsers.find(
              (user) => `${user.id}` === val
            );
            setUserFilter(selectedUser || null);
          }}
          value={userFilter ? `${userFilter.id}` : "all"} 
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem> 
            {uniqueUsers.map((user) =>
              user ? (
                <SelectItem key={user.id} value={`${user.id}`}>
                  {user.first_name} {user.last_name}
                </SelectItem>
              ) : null
            )}
          </SelectContent>
        </Select>

        {/* Approval Filter */}
        <Select
          onValueChange={(val) =>
            setApprovalFilter(
              val === "true" ? true : val === "false" ? false : null
            )
          }
          value={approvalFilter !== null ? (approvalFilter ? "true" : "false") : "all"} // Use "all" instead of ""
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Approval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem> 
            <SelectItem value="true">Approved</SelectItem>
            <SelectItem value="false">Not Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAvailabilities.map((availability) => (
          <TeamAvailCard
            key={availability.id}
            availability={availability}
            onToggled={() => handleToggled(availability.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewTeamAvailabilities;
