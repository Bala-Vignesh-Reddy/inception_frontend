import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArtifactRow } from "./artifacts/ArtifactRow";
import { ArtifactForm } from "./artifacts/ArtifactForm";

type Artifact = {
  id: number;
  name: string;
  status: string;
  visitor_count: number;
  maintenance_threshold: number;
};

const ArtifactTable = () => {
  const { data: artifacts, isLoading } = useQuery({
    queryKey: ["artifacts"],
    queryFn: async () => {
      console.log("Fetching artifacts from Supabase");
      const { data, error } = await supabase
        .from("artifact")
        .select("id, name, status, visitor_count, maintenance_threshold");
      if (error) {
        console.error("Error fetching artifacts:", error);
        throw error;
      }
      console.log("Fetched artifacts:", data);
      return data as Artifact[];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Artifacts Status</h2>
      </div>

      <ArtifactForm />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artifacts?.map((artifact) => (
            <ArtifactRow key={artifact.id} artifact={artifact} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArtifactTable;