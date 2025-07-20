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
      menu_items: {
        Row: {
          category: string
          created_at: string | null
          id: number
          is_veg: boolean | null
          name: string
          offer_price: number | null
          orders_placed: number | null
          price: number
          quantity: string
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: number
          is_veg?: boolean | null
          name: string
          offer_price?: number | null
          orders_placed?: number | null
          price: number
          quantity: string
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: number
          is_veg?: boolean | null
          name?: string
          offer_price?: number | null
          orders_placed?: number | null
          price?: number
          quantity?: string
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reservation_items: {
        Row: {
          created_at: string | null
          id: string
          menu_item_id: number | null
          price: number
          quantity: number
          reservation_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          menu_item_id?: number | null
          price: number
          quantity?: number
          reservation_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          menu_item_id?: number | null
          price?: number
          quantity?: number
          reservation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_items_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          arrival_date: string
          arrival_time: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          num_people: number
          order_type: string | null
          phone: string
          purpose: string
          status: string | null
          table_capacity: number | null
          table_number: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          arrival_date: string
          arrival_time: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          num_people: number
          order_type?: string | null
          phone: string
          purpose: string
          status?: string | null
          table_capacity?: number | null
          table_number?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          arrival_date?: string
          arrival_time?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          num_people?: number
          order_type?: string | null
          phone?: string
          purpose?: string
          status?: string | null
          table_capacity?: number | null
          table_number?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      restaurant_tables: {
        Row: {
          created_at: string | null
          id: number
          is_available: boolean | null
          seating_capacity: number
          section: string
          table_number: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_available?: boolean | null
          seating_capacity: number
          section: string
          table_number: string
        }
        Update: {
          created_at?: string | null
          id?: number
          is_available?: boolean | null
          seating_capacity?: number
          section?: string
          table_number?: string
        }
        Relationships: []
      }
      todays_specials: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          menu_item_id: number | null
          special_description: string | null
          special_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          menu_item_id?: number | null
          special_description?: string | null
          special_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          menu_item_id?: number | null
          special_description?: string | null
          special_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "todays_specials_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
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
