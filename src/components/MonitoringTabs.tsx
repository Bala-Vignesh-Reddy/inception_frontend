import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, AlignHorizontalDistributeCenter, RotateCcw, Clock, RadioTower, CheckCircle, XCircle, Home } from "lucide-react";
import VideoFeed from "./VideoFeed";
import LiveFeed from "./LiveFeed";
import ArtifactTable from "./ArtifactTable";
import SensorDataChart from "./SensorDataChart";
import ArtifactsMaintenanceTable from "./maintenance/ArtifactsMaintenanceTable";

const MonitoringTabs = () => {
  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="home" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </TabsTrigger>
        <TabsTrigger value="fault" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>Fault Detection</span>
          <span className="ml-auto">
          </span>
        </TabsTrigger>
        <TabsTrigger value="misalignment" className="flex items-center gap-2">
          <AlignHorizontalDistributeCenter className="h-4 w-4" />
          <span>Misalignment</span>
          <span className="ml-auto">
          </span>
        </TabsTrigger>
        <TabsTrigger value="motion" className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          <span>Motion Defect</span>
          <span className="ml-auto">
          </span>
        </TabsTrigger>
        <TabsTrigger value="predictive" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Predictive</span>
          <span className="ml-auto">
          </span>
        </TabsTrigger>
        <TabsTrigger value="proximity" className="flex items-center gap-2">
          <RadioTower className="h-4 w-4" />
          <span>Proximity</span>
          <span className="ml-auto">
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="home" className="mt-4">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <VideoFeed />
            <LiveFeed />
          </div>
          <div className="space-y-8">
            <ArtifactTable />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="fault" className="mt-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <VideoFeed tab="fault" />
          <LiveFeed />
        </div>
      </TabsContent>

      <TabsContent value="misalignment" className="mt-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <VideoFeed tab="misalignment" />
          <LiveFeed />
        </div>
      </TabsContent>

      <TabsContent value="motion" className="mt-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <VideoFeed tab="motion" showMotionBoundingBox={true} />
          <LiveFeed />
        </div>
      </TabsContent>

      <TabsContent value="predictive" className="mt-4">
        <div className="space-y-6">
          <SensorDataChart />
          <LiveFeed />
        </div>
      </TabsContent>

      <TabsContent value="proximity" className="mt-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <VideoFeed tab="proximity" />
          <LiveFeed />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MonitoringTabs;
