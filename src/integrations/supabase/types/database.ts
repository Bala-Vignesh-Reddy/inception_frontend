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
          }
        ]
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