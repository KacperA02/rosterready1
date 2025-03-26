import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShiftResponse } from "@/types/shift"; 

interface ShiftCardProps {
  shift: ShiftResponse; 
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  const { name, time_start, time_end, task, no_of_users, days } = shift;

  return (
    <Card className="p-4 shadow-lg rounded-lg border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Task:</strong> {task ?? "No task assigned"}</p>
        <p><strong>Time:</strong> {time_start} - {time_end}</p>
        <p><strong>Users Required:</strong> {no_of_users}</p>
        <p><strong>Days:</strong> {days.map(day => day.name).join(", ")}</p>
        <Button variant="outline" className="mt-2">Edit</Button>
      </CardContent>
    </Card>
  );
};

export default ShiftCard;
