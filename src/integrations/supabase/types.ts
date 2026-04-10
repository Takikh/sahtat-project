export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      construction_progress: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          progress_percent: number | null
          purchased_property_id: string
          title: string
          update_date: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          progress_percent?: number | null
          purchased_property_id: string
          title: string
          update_date?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          progress_percent?: number | null
          purchased_property_id?: string
          title?: string
          update_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "construction_progress_purchased_property_id_fkey"
            columns: ["purchased_property_id"]
            isOneToOne: false
            referencedRelation: "purchased_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          submitted_at: string
        }
        Insert: {
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          submitted_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          submitted_at?: string
        }
        Relationships: []
      }
      land_offers: {
        Row: {
          area_m2: number | null
          asking_price: number | null
          city: string
          description: string | null
          district: string | null
          email: string | null
          full_name: string
          id: string
          is_read: boolean
          ownership_type: string | null
          phone: string
          status: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          area_m2?: number | null
          asking_price?: number | null
          city: string
          description?: string | null
          district?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_read?: boolean
          ownership_type?: string | null
          phone: string
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          area_m2?: number | null
          asking_price?: number | null
          city?: string
          description?: string | null
          district?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_read?: boolean
          ownership_type?: string | null
          phone?: string
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          content_ar: string | null
          content_en: string | null
          content_fr: string | null
          created_at: string
          excerpt_ar: string | null
          excerpt_en: string | null
          excerpt_fr: string | null
          id: string
          image_url: string | null
          published_at: string
          seo_description_ar: string | null
          seo_description_en: string | null
          seo_description_fr: string | null
          seo_title_ar: string | null
          seo_title_en: string | null
          seo_title_fr: string | null
          slug: string
          title_ar: string | null
          title_en: string
          title_fr: string | null
          updated_at: string
        }
        Insert: {
          content_ar?: string | null
          content_en?: string | null
          content_fr?: string | null
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          excerpt_fr?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          seo_description_ar?: string | null
          seo_description_en?: string | null
          seo_description_fr?: string | null
          seo_title_ar?: string | null
          seo_title_en?: string | null
          seo_title_fr?: string | null
          slug: string
          title_ar?: string | null
          title_en: string
          title_fr?: string | null
          updated_at?: string
        }
        Update: {
          content_ar?: string | null
          content_en?: string | null
          content_fr?: string | null
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          excerpt_fr?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          seo_description_ar?: string | null
          seo_description_en?: string | null
          seo_description_fr?: string | null
          seo_title_ar?: string | null
          seo_title_en?: string | null
          seo_title_fr?: string | null
          slug?: string
          title_ar?: string | null
          title_en?: string
          title_fr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          page_path: string
          referrer: string | null
          user_agent: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_path: string
          referrer?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_views: {
        Row: {
          created_at: string
          id: string
          project_id: string
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_views_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          area_max_m2: number | null
          area_min_m2: number | null
          city: string
          construction_timeline: Json
          created_at: string
          delivery_date: string | null
          description_ar: string | null
          description_en: string | null
          description_fr: string | null
          features: Json | null
          floor_plan_urls: Json
          for_whom_ar: string | null
          for_whom_en: string | null
          for_whom_fr: string | null
          gallery_urls: Json
          guarantee_ar: string | null
          guarantee_en: string | null
          guarantee_fr: string | null
          id: string
          image_url: string | null
          included_ar: string | null
          included_en: string | null
          included_fr: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
          payment_plan_ar: string | null
          payment_plan_en: string | null
          payment_plan_fr: string | null
          price_max_dzd: number | null
          price_min_dzd: number | null
          seo_description_ar: string | null
          seo_description_en: string | null
          seo_description_fr: string | null
          seo_title_ar: string | null
          seo_title_en: string | null
          seo_title_fr: string | null
          short_video_url: string | null
          slug: string
          status: string
          total_units: number | null
          type: string
          units_left: number | null
          updated_at: string
          what_ar: string | null
          what_en: string | null
          what_fr: string | null
          why_now_ar: string | null
          why_now_en: string | null
          why_now_fr: string | null
        }
        Insert: {
          area_max_m2?: number | null
          area_min_m2?: number | null
          city: string
          construction_timeline?: Json
          created_at?: string
          delivery_date?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          features?: Json | null
          floor_plan_urls?: Json
          for_whom_ar?: string | null
          for_whom_en?: string | null
          for_whom_fr?: string | null
          gallery_urls?: Json
          guarantee_ar?: string | null
          guarantee_en?: string | null
          guarantee_fr?: string | null
          id?: string
          image_url?: string | null
          included_ar?: string | null
          included_en?: string | null
          included_fr?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name: string
          payment_plan_ar?: string | null
          payment_plan_en?: string | null
          payment_plan_fr?: string | null
          price_max_dzd?: number | null
          price_min_dzd?: number | null
          seo_description_ar?: string | null
          seo_description_en?: string | null
          seo_description_fr?: string | null
          seo_title_ar?: string | null
          seo_title_en?: string | null
          seo_title_fr?: string | null
          short_video_url?: string | null
          slug: string
          status: string
          total_units?: number | null
          type: string
          units_left?: number | null
          updated_at?: string
          what_ar?: string | null
          what_en?: string | null
          what_fr?: string | null
          why_now_ar?: string | null
          why_now_en?: string | null
          why_now_fr?: string | null
        }
        Update: {
          area_max_m2?: number | null
          area_min_m2?: number | null
          city?: string
          construction_timeline?: Json
          created_at?: string
          delivery_date?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          features?: Json | null
          floor_plan_urls?: Json
          for_whom_ar?: string | null
          for_whom_en?: string | null
          for_whom_fr?: string | null
          gallery_urls?: Json
          guarantee_ar?: string | null
          guarantee_en?: string | null
          guarantee_fr?: string | null
          id?: string
          image_url?: string | null
          included_ar?: string | null
          included_en?: string | null
          included_fr?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string
          payment_plan_ar?: string | null
          payment_plan_en?: string | null
          payment_plan_fr?: string | null
          price_max_dzd?: number | null
          price_min_dzd?: number | null
          seo_description_ar?: string | null
          seo_description_en?: string | null
          seo_description_fr?: string | null
          seo_title_ar?: string | null
          seo_title_en?: string | null
          seo_title_fr?: string | null
          short_video_url?: string | null
          slug?: string
          status?: string
          total_units?: number | null
          type?: string
          units_left?: number | null
          updated_at?: string
          what_ar?: string | null
          what_en?: string | null
          what_fr?: string | null
          why_now_ar?: string | null
          why_now_en?: string | null
          why_now_fr?: string | null
        }
        Relationships: []
      }
      purchased_properties: {
        Row: {
          created_at: string
          id: string
          progress_percent: number | null
          project_id: string
          purchase_date: string | null
          status: string | null
          unit_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          progress_percent?: number | null
          project_id: string
          purchase_date?: string | null
          status?: string | null
          unit_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          progress_percent?: number | null
          project_id?: string
          purchase_date?: string | null
          status?: string | null
          unit_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchased_properties_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          is_approved: boolean | null
          rating: number | null
          reviewer_name: string
          reviewer_role_ar: string | null
          reviewer_role_en: string | null
          reviewer_role_fr: string | null
          text_ar: string | null
          text_en: string
          text_fr: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_approved?: boolean | null
          rating?: number | null
          reviewer_name: string
          reviewer_role_ar?: string | null
          reviewer_role_en?: string | null
          reviewer_role_fr?: string | null
          text_ar?: string | null
          text_en: string
          text_fr?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_approved?: boolean | null
          rating?: number | null
          reviewer_name?: string
          reviewer_role_ar?: string | null
          reviewer_role_en?: string | null
          reviewer_role_fr?: string | null
          text_ar?: string | null
          text_en?: string
          text_fr?: string | null
        }
        Relationships: []
      }
      site_faqs: {
        Row: {
          answer_ar: string | null
          answer_en: string
          answer_fr: string | null
          created_at: string
          id: string
          is_active: boolean
          page: string
          question_ar: string | null
          question_en: string
          question_fr: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer_ar?: string | null
          answer_en: string
          answer_fr?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          page: string
          question_ar?: string | null
          question_en: string
          question_fr?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer_ar?: string | null
          answer_en?: string
          answer_fr?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          page?: string
          question_ar?: string | null
          question_en?: string
          question_fr?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      has_any_role: {
        Args: {
          _user_id: string
          _roles: Database["public"]["Enums"]["app_role"][]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      app_role: "admin" | "client" | "secretary" | "super_admin"
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
    Enums: {
      app_role: ["admin", "client", "secretary", "super_admin"],
    },
  },
} as const
