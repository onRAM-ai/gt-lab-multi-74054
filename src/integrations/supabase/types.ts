export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          project_id: number | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          project_id?: number | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          project_id?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_approvals: {
        Row: {
          approval_token: string | null
          approval_type: string
          approved_at: string | null
          client_comments: string | null
          client_email: string | null
          created_at: string
          id: string
          project_id: number | null
          status: string
        }
        Insert: {
          approval_token?: string | null
          approval_type?: string
          approved_at?: string | null
          client_comments?: string | null
          client_email?: string | null
          created_at?: string
          id?: string
          project_id?: number | null
          status?: string
        }
        Update: {
          approval_token?: string | null
          approval_type?: string
          approved_at?: string | null
          client_comments?: string | null
          client_email?: string | null
          created_at?: string
          id?: string
          project_id?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_approvals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          company: string
          created_at: string | null
          email: string
          id: number
          industry: string | null
          itin: string | null
          last_contact: string | null
          name: string
          phone: string | null
          projects: number | null
          status: string | null
          total_value: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          company: string
          created_at?: string | null
          email: string
          id?: number
          industry?: string | null
          itin?: string | null
          last_contact?: string | null
          name: string
          phone?: string | null
          projects?: number | null
          status?: string | null
          total_value?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          company?: string
          created_at?: string | null
          email?: string
          id?: number
          industry?: string | null
          itin?: string | null
          last_contact?: string | null
          name?: string
          phone?: string | null
          projects?: number | null
          status?: string | null
          total_value?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      interviews: {
        Row: {
          admin_available_slots: Json
          admin_notes: string | null
          application_id: string
          candidate_selected_slot: Json | null
          created_at: string
          id: string
          interview_token: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_available_slots: Json
          admin_notes?: string | null
          application_id: string
          candidate_selected_slot?: Json | null
          created_at?: string
          id?: string
          interview_token?: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_available_slots?: Json
          admin_notes?: string | null
          application_id?: string
          candidate_selected_slot?: Json | null
          created_at?: string
          id?: string
          interview_token?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          city: string
          created_at: string
          date: string
          disability_status: string | null
          email: string
          first_name: string
          gender: string
          id: string
          last_name: string
          linkedin: string | null
          phone: string
          privacy_policy_accepted: boolean
          race_ethnicity: string
          resume_filename: string | null
          resume_url: string | null
          signature: string
          speaks_languages: string | null
          status: string | null
          updated_at: string
          veteran_status: string | null
          visa_sponsorship: string
          work_authorized: string
        }
        Insert: {
          city: string
          created_at?: string
          date: string
          disability_status?: string | null
          email: string
          first_name: string
          gender: string
          id?: string
          last_name: string
          linkedin?: string | null
          phone: string
          privacy_policy_accepted?: boolean
          race_ethnicity: string
          resume_filename?: string | null
          resume_url?: string | null
          signature: string
          speaks_languages?: string | null
          status?: string | null
          updated_at?: string
          veteran_status?: string | null
          visa_sponsorship: string
          work_authorized: string
        }
        Update: {
          city?: string
          created_at?: string
          date?: string
          disability_status?: string | null
          email?: string
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          linkedin?: string | null
          phone?: string
          privacy_policy_accepted?: boolean
          race_ethnicity?: string
          resume_filename?: string | null
          resume_url?: string | null
          signature?: string
          speaks_languages?: string | null
          status?: string | null
          updated_at?: string
          veteran_status?: string | null
          visa_sponsorship?: string
          work_authorized?: string
        }
        Relationships: []
      }
      jotform_integrations: {
        Row: {
          auto_assign_user: string | null
          client_name: string
          created_at: string
          form_id: string
          id: string
          is_active: boolean | null
          project_template: Json | null
        }
        Insert: {
          auto_assign_user?: string | null
          client_name: string
          created_at?: string
          form_id: string
          id?: string
          is_active?: boolean | null
          project_template?: Json | null
        }
        Update: {
          auto_assign_user?: string | null
          client_name?: string
          created_at?: string
          form_id?: string
          id?: string
          is_active?: boolean | null
          project_template?: Json | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: number
          message: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: number
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: number
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      production_tracking: {
        Row: {
          actual_delivery: string | null
          created_at: string
          estimated_delivery: string | null
          id: string
          notes: string | null
          project_id: number | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_delivery?: string | null
          created_at?: string
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          project_id?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_delivery?: string | null
          created_at?: string
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          project_id?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          assigned_to: string | null
          client: string
          created_at: string | null
          description: string | null
          due_date: string | null
          id: number
          name: string
          progress: number | null
          status: string | null
          updated_at: string | null
          value: string | null
        }
        Insert: {
          assigned_to?: string | null
          client: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          name: string
          progress?: number | null
          status?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          assigned_to?: string | null
          client?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          name?: string
          progress?: number | null
          status?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: number
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          status?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          name: string
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          name: string
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      website_quotes: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          status: string | null
          updated_at: string
          websites: Json
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          websites: Json
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          websites?: Json
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
