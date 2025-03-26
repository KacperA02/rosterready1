import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IExpertise } from "@/types/expertise";

interface ExpertiseCardProps {
    expertise: IExpertise; 
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ expertise }) => {
  const { name } = expertise;

  return (
    <Card className="p-4 shadow-lg rounded-lg border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Users Assigned </strong></p>
        <p><strong>Shifts Assigned </strong></p>
        <Button variant="outline" className="mt-2">Edit</Button>
      </CardContent>
    </Card>
  );
};

export default ExpertiseCard;
