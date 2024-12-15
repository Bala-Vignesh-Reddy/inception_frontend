import { Database } from "./database";

export type MaintenanceRecord = Database["public"]["Tables"]["predictive_maintenance"]["Row"] & {
  artifact?: {
    name: string;
  };
};

export type MaintenanceInsert = Database["public"]["Tables"]["predictive_maintenance"]["Insert"];
export type MaintenanceUpdate = Database["public"]["Tables"]["predictive_maintenance"]["Update"];