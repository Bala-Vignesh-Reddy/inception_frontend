import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface ArtifactRowProps {
  artifact: {
    id: number;
    name: string;
    status: string;
  };
}

export const ArtifactRow = ({ artifact }: ArtifactRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(artifact.status);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusUpdate = async () => {
    try {
      const { error } = await supabase
        .from("artifact")
        .update({ status })
        .eq("id", artifact.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Artifact status updated successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["artifacts"] });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating artifact status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update artifact status",
      });
    }
  };

  const handleDelete = async () => {
    try {
      console.log("Deleting maintenance records for artifact:", artifact.id);
      // First, delete related maintenance records
      const { error: maintenanceError } = await supabase
        .from("predictive_maintenance")
        .delete()
        .eq("artifact_id", artifact.id);

      if (maintenanceError) throw maintenanceError;

      console.log("Maintenance records deleted, now deleting artifact:", artifact.id);
      // Then delete the artifact
      const { error: artifactError } = await supabase
        .from("artifact")
        .delete()
        .eq("id", artifact.id);

      if (artifactError) throw artifactError;

      toast({
        title: "Success",
        description: "Artifact and related records deleted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["artifacts"] });
    } catch (error) {
      console.error("Error deleting artifact:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete artifact",
      });
    }
  };

  return (
    <TableRow>
      <TableCell>{artifact.id}</TableCell>
      <TableCell>{artifact.name}</TableCell>
      <TableCell>
        {isEditing ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border px-3 py-1 text-sm"
          >
            <option value="working">Working</option>
            <option value="missing">Missing</option>
            <option value="defective">Defective</option>
          </select>
        ) : (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
              artifact.status === "working"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {artifact.status}
          </span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={handleStatusUpdate}
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatus(artifact.status);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Status
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};