import { useState } from "react";
import { createTeam } from "./services/TeamService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      setError("Team name is required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await createTeam({ name: teamName });

      if (response) {
        alert("Team created successfully!");
        navigate("/teams"); 
      } else {
        setError("Failed to create team. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Team</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Team Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          {loading ? "Creating..." : "Create Team"}
        </Button>
      </form>
    </div>
  );
};

export default CreateTeam;
