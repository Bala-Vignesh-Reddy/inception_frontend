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
import { MessageSquare, Phone, AlertTriangle, FileText } from "lucide-react";
import { Feedback } from "@/integrations/supabase/types/feedback";

const FeedbackTable = () => {
  const { data: feedbackData, isLoading } = useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      console.log("Fetching feedback data from Supabase");
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching feedback:", error);
        throw error;
      }
      console.log("Fetched feedback data:", data);
      return data as Feedback[];
    },
  });

  if (isLoading) return <div>Loading feedback data...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Feedback Records</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Name</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Mobile Number</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Type of Fault</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Description</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbackData?.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell>{feedback.name}</TableCell>
              <TableCell>{feedback.mobile_number}</TableCell>
              <TableCell>{feedback.fault_type}</TableCell>
              <TableCell>{feedback.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeedbackTable;