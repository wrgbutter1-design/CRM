export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          billing_address: string | null
          company_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          billing_address?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          billing_address?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_documents: {
        Row: {
          drive_url: string
          id: string
          job_id: string
          label: string
          uploaded_at: string
        }
        Insert: {
          drive_url: string
          id?: string
          job_id: string
          label: string
          uploaded_at?: string
        }
        Update: {
          drive_url?: string
          id?: string
          job_id?: string
          label?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_documents_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_notes: {
        Row: {
          author: string
          created_at: string
          id: string
          job_id: string
          note: string
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          job_id: string
          note: string
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          job_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_notes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          completed_date: string | null
          created_at: string
          customer_id: string
          description: string | null
          final_amount: number | null
          id: string
          quoted_amount: number | null
          scheduled_date: string | null
          site_address: string | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          customer_id: string
          description?: string | null
          final_amount?: number | null
          id?: string
          quoted_amount?: number | null
          scheduled_date?: string | null
          site_address?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          customer_id?: string
          description?: string | null
          final_amount?: number | null
          id?: string
          quoted_amount?: number | null
          scheduled_date?: string | null
          site_address?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
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
      job_status:
        | "quoted"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]

export type Enums<T extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][T]
