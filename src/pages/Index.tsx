import ArtifactTable from "@/components/ArtifactTable";
import ArtifactsMaintenanceTable from "@/components/maintenance/ArtifactsMaintenanceTable";
import MonitoringTabs from "@/components/MonitoringTabs";
import FeedbackTable from "@/components/FeedbackTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Wrench } from "lucide-react";
import { format } from "date-fns";

const Index = () => {
  const { data: artifactsCount } = useQuery({
    queryKey: ["artifactsCount"],
    queryFn: async () => {
      console.log("Fetching artifacts count");
      const { count, error } = await supabase
        .from("artifact")
        .select("*", { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: maintenanceCount } = useQuery({
    queryKey: ["maintenanceCount"],
    queryFn: async () => {
      console.log("Fetching pending maintenance count");
      const { count, error } = await supabase
        .from("predictive_maintenance")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: visitorStats } = useQuery({
    queryKey: ["visitorStats"],
    queryFn: async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      today.setHours(0, 0, 0, 0);
      yesterday.setHours(0, 0, 0, 0);
      
      // Get today's visitors
      const { data: todayData, error: todayError } = await supabase
        .from("sensor_data")
        .select("visitors")
        .gte("timestamp", today.toISOString())
        .order("timestamp", { ascending: false })
        .limit(1);
      
      if (todayError) throw todayError;

      // Get yesterday's visitors
      const { data: yesterdayData, error: yesterdayError } = await supabase
        .from("sensor_data")
        .select("visitors")
        .gte("timestamp", yesterday.toISOString())
        .lt("timestamp", today.toISOString())
        .order("timestamp", { ascending: false })
        .limit(1);
      
      if (yesterdayError) throw yesterdayError;

      const todayVisitors = todayData?.[0]?.visitors || 0;
      const yesterdayVisitors = yesterdayData?.[0]?.visitors || 0;
      
      // Calculate percentage change
      let percentageChange = 0;
      if (yesterdayVisitors > 0) {
        percentageChange = ((todayVisitors - yesterdayVisitors) / yesterdayVisitors) * 100;
      }

      return {
        today: todayVisitors,
        percentageChange
      };
    },
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Maintenance Dashboard</h1>
            <p className="text-gray-600">Welcome to Inception's dashboard</p>
          </div>
          <div className="text-right text-gray-600">
            <p className="text-lg">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
            <p>{format(new Date(), 'h:mm a')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Artifacts</p>
                  <h3 className="text-2xl font-bold">{artifactsCount || 0}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Maintenance</p>
                  <h3 className="text-2xl font-bold">{maintenanceCount || 0}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Today's Visitors</p>
                  <h3 className="text-2xl font-bold">{visitorStats?.today || 0}</h3>
                  {visitorStats?.percentageChange !== 0 && (
                    <p className={`text-sm ${visitorStats?.percentageChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {visitorStats?.percentageChange > 0 ? '↑' : '↓'} 
                      {Math.abs(visitorStats?.percentageChange || 0).toFixed(1)}% vs yesterday
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Alerts</p>
                  <h3 className="text-2xl font-bold">2</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MonitoringTabs />
      
      <div className="space-y-8">
        <ArtifactsMaintenanceTable />
        <FeedbackTable />
      </div>
    </div>
  );
};

export default Index;
