import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

type MaintenanceRecord = {
  id: number;
  artifact_id: number;
  maintenance_date: string;
  status: string;
  description: string;
  priority: string;
  assigned_to: string;
  completed_date: string | null;
  artifact: {
    name: string;
  };
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500";
    case "in_progress":
      return "bg-yellow-500";
    case "pending":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const ArtifactsMaintenanceTable = () => {
  const { data: maintenanceRecords, isLoading } = useQuery({
    queryKey: ["maintenance"],
    queryFn: async () => {
      console.log("Fetching maintenance records from Supabase");
      const { data, error } = await supabase
        .from("predictive_maintenance")
        .select(`
          *,
          artifact!fk_artifact (
            name
          )
        `);
      if (error) {
        console.error("Error fetching maintenance records:", error);
        throw error;
      }
      console.log("Fetched maintenance records:", data);
      return data as MaintenanceRecord[];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Maintenance Schedule
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Artifact</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Maintenance Date</TableHead>
            <TableHead>Completed Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenanceRecords?.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.artifact?.name}</TableCell>
              <TableCell>{record.description}</TableCell>
              <TableCell>
                <Badge className={getPriorityColor(record.priority)}>
                  {record.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(record.status)}>
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell>{record.assigned_to}</TableCell>
              <TableCell>
                {record.maintenance_date
                  ? format(new Date(record.maintenance_date), "PPP")
                  : "N/A"}
              </TableCell>
              <TableCell>
                {record.completed_date
                  ? format(new Date(record.completed_date), "PPP")
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArtifactsMaintenanceTable;
