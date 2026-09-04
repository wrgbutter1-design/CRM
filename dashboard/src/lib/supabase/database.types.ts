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
      estimate_documents: {
        Row: {
          estimate_id: string
          id: string
          label: string
          uploaded_at: string
          url: string
        }
        Insert: {
          estimate_id: string
          id?: string
          label: string
          uploaded_at?: string
          url: string
        }
        Update: {
          estimate_id?: string
          id?: string
          label?: string
          uploaded_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "estimate_documents_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimates: {
        Row: {
          created_at: string
          customer_id: string
          estimated_amount: number | null
          id: string
          notes: string | null
          site_address: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          estimated_amount?: number | null
          id?: string
          notes?: string | null
          site_address?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          estimated_amount?: number | null
          id?: string
          notes?: string | null
          site_address?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estimates_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      job_documents: {
        Row: {
          id: string
          job_id: string
          label: string
          uploaded_at: string
          url: string
        }
        Insert: {
          id?: string
          job_id: string
          label: string
          uploaded_at?: string
          url: string
        }
        Update: {
          id?: string
          job_id?: string
          label?: string
          uploaded_at?: string
          url?: string
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
      job_expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          description: string
          id: string
          job_id: string
          receipt_url: string | null
          spent_on: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description: string
          id?: string
          job_id: string
          receipt_url?: string | null
          spent_on?: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description?: string
          id?: string
          job_id?: string
          receipt_url?: string | null
          spent_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_expenses_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_leaders: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
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
          job_leader_id: string | null
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
          job_leader_id?: string | null
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
          job_leader_id?: string | null
          quoted_amount?: number | null
          scheduled_date?: string | null
          site_address?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_job_leader_id_fkey"
            columns: ["job_leader_id"]
            isOneToOne: false
            referencedRelation: "job_leaders"
            referencedColumns: ["id"]
          },
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
      expense_category: "materials" | "labor"
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
