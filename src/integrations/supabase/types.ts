export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artifact: {
        Row: {
          description: string | null
          id: number
          image_path: string | null
          maintenance_threshold: number | null
          name: string
          status: string | null
          video_path: string | null
          visitor_count: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          image_path?: string | null
          maintenance_threshold?: number | null
          name: string
          status?: string | null
          video_path?: string | null
          visitor_count?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          image_path?: string | null
          maintenance_threshold?: number | null
          name?: string
          status?: string | null
          video_path?: string | null
          visitor_count?: number | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          description: string | null
          fault_type: string
          id: number
          mobile_number: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fault_type: string
          id?: number
          mobile_number: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fault_type?: string
          id?: number
          mobile_number?: string
          name?: string
        }
        Relationships: []
      }
      predictive_maintenance: {
        Row: {
          artifact_id: number | null
          assigned_to: string | null
          completed_date: string | null
          description: string | null
          id: number
          maintenance_date: string | null
          priority: string | null
          status: string | null
        }
        Insert: {
          artifact_id?: number | null
          assigned_to?: string | null
          completed_date?: string | null
          description?: string | null
          id?: number
          maintenance_date?: string | null
          priority?: string | null
          status?: string | null
        }
        Update: {
          artifact_id?: number | null
          assigned_to?: string | null
          completed_date?: string | null
          description?: string | null
          id?: number
          maintenance_date?: string | null
          priority?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_artifact"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "artifact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictive_maintenance_artifact_id_fkey"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "artifact"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_data: {
        Row: {
          humidity: number
          id: number
          temperature: number
          timestamp: string | null
          visitors: number
        }
        Insert: {
          humidity: number
          id?: number
          temperature: number
          timestamp?: string | null
          visitors: number
        }
        Update: {
          humidity?: number
          id?: number
          temperature?: number
          timestamp?: string | null
          visitors?: number
        }
        Relationships: []
      }
      temperature_alerts: {
        Row: {
          id: number
          message: string
          status: string | null
          temperature: number
          timestamp: string | null
        }
        Insert: {
          id?: number
          message: string
          status?: string | null
          temperature: number
          timestamp?: string | null
        }
        Update: {
          id?: number
          message?: string
          status?: string | null
          temperature?: number
          timestamp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
