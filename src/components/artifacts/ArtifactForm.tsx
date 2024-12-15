import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type ArtifactInsert = Database['public']['Tables']['artifact']['Insert'];

export const ArtifactForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("working");

  const handleAdd = async () => {
    try {
      if (!newName.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Name is required",
        });
        return;
      }

      console.log("Adding new artifact:", { name: newName, status: newStatus });
      
      const { error } = await supabase
        .from("artifact")
        .insert({
          name: newName,
          status: newStatus,
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Artifact added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["artifacts"] });
      setNewName("");
      setNewStatus("working");
    } catch (error) {
      console.error("Error adding artifact:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add artifact",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        placeholder="New artifact name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="rounded-md border px-3 py-2"
      />
      <select
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
        className="rounded-md border px-3 py-2"
      >
        <option value="working">Working</option>
        <option value="missing">Missing</option>
        <option value="defective">Defective</option>
      </select>
      <Button onClick={handleAdd} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Artifact
      </Button>
    </div>
  );
};