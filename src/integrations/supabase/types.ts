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
      api_metrics: {
        Row: {
          created_at: string | null
          id: string
          integration_id: string | null
          metric_name: string
          metric_type: string
          timestamp: string | null
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          integration_id?: string | null
          metric_name: string
          metric_type: string
          timestamp?: string | null
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          integration_id?: string | null
          metric_name?: string
          metric_type?: string
          timestamp?: string | null
          updated_at?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "api_metrics_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      discovered_pages: {
        Row: {
          created_at: string | null
          id: string
          last_seen_at: string | null
          title: string | null
          updated_at: string | null
          url: string
          website_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          title?: string | null
          updated_at?: string | null
          url: string
          website_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_seen_at?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discovered_pages_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      form_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          form_id: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          form_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          form_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_alerts_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_conversions: {
        Row: {
          conversion_timestamp: string | null
          error_message: string | null
          form_id: string | null
          id: string
          is_successful: boolean | null
        }
        Insert: {
          conversion_timestamp?: string | null
          error_message?: string | null
          form_id?: string | null
          id?: string
          is_successful?: boolean | null
        }
        Update: {
          conversion_timestamp?: string | null
          error_message?: string | null
          form_id?: string | null
          id?: string
          is_successful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "form_conversions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_monitoring_settings: {
        Row: {
          conversion_threshold: number | null
          created_at: string | null
          error_rate_threshold: number | null
          form_id: string | null
          id: string
          inactivity_threshold: unknown | null
          updated_at: string | null
        }
        Insert: {
          conversion_threshold?: number | null
          created_at?: string | null
          error_rate_threshold?: number | null
          form_id?: string | null
          id?: string
          inactivity_threshold?: unknown | null
          updated_at?: string | null
        }
        Update: {
          conversion_threshold?: number | null
          created_at?: string | null
          error_rate_threshold?: number | null
          form_id?: string | null
          id?: string
          inactivity_threshold?: unknown | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_monitoring_settings_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          action: string | null
          created_at: string | null
          fields_count: number | null
          form_inputs: Json | null
          form_type: string
          id: string
          is_multi_step: boolean | null
          method: string | null
          page_id: string | null
          steps_count: number | null
          submit_button: Json | null
          success_page: string | null
          updated_at: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          fields_count?: number | null
          form_inputs?: Json | null
          form_type: string
          id?: string
          is_multi_step?: boolean | null
          method?: string | null
          page_id?: string | null
          steps_count?: number | null
          submit_button?: Json | null
          success_page?: string | null
          updated_at?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          fields_count?: number | null
          form_inputs?: Json | null
          form_type?: string
          id?: string
          is_multi_step?: boolean | null
          method?: string | null
          page_id?: string | null
          steps_count?: number | null
          submit_button?: Json | null
          success_page?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forms_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "discovered_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      ga4_metrics: {
        Row: {
          created_at: string | null
          date_hour: string
          id: string
          metric_name: string
          metric_value: number
          page_path: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_hour: string
          id?: string
          metric_name: string
          metric_value: number
          page_path: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_hour?: string
          id?: string
          metric_name?: string
          metric_value?: number
          page_path?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          created_at: string | null
          credentials: Json
          id: string
          integration_type: string | null
          is_active: boolean | null
          last_sync_at: string | null
          metadata: Json | null
          settings: Json | null
          status: string | null
          type: Database["public"]["Enums"]["integration_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          credentials?: Json
          id?: string
          integration_type?: string | null
          is_active?: boolean | null
          last_sync_at?: string | null
          metadata?: Json | null
          settings?: Json | null
          status?: string | null
          type: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          credentials?: Json
          id?: string
          integration_type?: string | null
          is_active?: boolean | null
          last_sync_at?: string | null
          metadata?: Json | null
          settings?: Json | null
          status?: string | null
          type?: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          content: string
          created_at: string | null
          id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      oauth_config: {
        Row: {
          created_at: string | null
          google_client_id: string | null
          google_client_secret: string | null
          id: string
          meta_client_id: string | null
          meta_client_secret: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          google_client_id?: string | null
          google_client_secret?: string | null
          id?: string
          meta_client_id?: string | null
          meta_client_secret?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          google_client_id?: string | null
          google_client_secret?: string | null
          id?: string
          meta_client_id?: string | null
          meta_client_secret?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      tech_documentation: {
        Row: {
          category: string
          content: Json
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: Json
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: Json
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      websites: {
        Row: {
          created_at: string | null
          id: string
          last_scan_at: string | null
          scan_frequency: unknown | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_scan_at?: string | null
          scan_frequency?: unknown | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_scan_at?: string | null
          scan_frequency?: unknown | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_tech_documentation: {
        Args: {
          p_category: string
          p_title: string
          p_content: Json
        }
        Returns: string
      }
    }
    Enums: {
      integration_type:
        | "google_analytics"
        | "google_ads"
        | "meta_ads"
        | "linkedin_ads"
        | "tiktok_ads"
        | "meta_business"
        | "linkedin_company"
        | "youtube_studio"
        | "tiktok_business"
      user_role: "admin" | "editor" | "user"
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
