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
      generations: {
        Row: {
          created_at: string
          error_message: string | null
          generation_type: string
          id: string
          model_url: string | null
          prompt: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          generation_type: string
          id?: string
          model_url?: string | null
          prompt: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          generation_type?: string
          id?: string
          model_url?: string | null
          prompt?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      help_messages: {
        Row: {
          ai_response: string
          created_at: string
          message_id: string
          user_id: string | null
          user_message: string
        }
        Insert: {
          ai_response: string
          created_at?: string
          message_id?: string
          user_id?: string | null
          user_message: string
        }
        Update: {
          ai_response?: string
          created_at?: string
          message_id?: string
          user_id?: string | null
          user_message?: string
        }
        Relationships: []
      }
      market_insights: {
        Row: {
          confidence_score: number | null
          created_at: string
          insight_content: string
          insight_id: string
          insight_type: string
          model_used: string | null
          product_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          insight_content: string
          insight_id?: string
          insight_type: string
          model_used?: string | null
          product_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          insight_content?: string
          insight_id?: string
          insight_type?: string
          model_used?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_insights_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      marketing_strategies: {
        Row: {
          created_at: string
          estimated_cost: number | null
          estimated_roi: number | null
          platform: string | null
          product_id: string | null
          strategy_description: string
          strategy_id: string
          strategy_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          estimated_cost?: number | null
          estimated_roi?: number | null
          platform?: string | null
          product_id?: string | null
          strategy_description: string
          strategy_id?: string
          strategy_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          estimated_cost?: number | null
          estimated_roi?: number | null
          platform?: string | null
          product_id?: string | null
          strategy_description?: string
          strategy_id?: string
          strategy_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_strategies_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      products: {
        Row: {
          average_rating: number | null
          category: string | null
          competition_level: string | null
          created_at: string
          is_trending: boolean | null
          product_description: string | null
          product_id: string
          product_image_url: string | null
          product_name: string
          recommended_selling_price: number | null
          review_count: number | null
          supplier_id: string | null
          supplier_price: number
          trending_tags: string | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          category?: string | null
          competition_level?: string | null
          created_at?: string
          is_trending?: boolean | null
          product_description?: string | null
          product_id?: string
          product_image_url?: string | null
          product_name: string
          recommended_selling_price?: number | null
          review_count?: number | null
          supplier_id?: string | null
          supplier_price: number
          trending_tags?: string | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          category?: string | null
          competition_level?: string | null
          created_at?: string
          is_trending?: boolean | null
          product_description?: string | null
          product_id?: string
          product_image_url?: string | null
          product_name?: string
          recommended_selling_price?: number | null
          review_count?: number | null
          supplier_id?: string | null
          supplier_price?: number
          trending_tags?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["supplier_id"]
          },
        ]
      }
      prompts: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_featured: boolean | null
          text: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean | null
          text: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean | null
          text?: string
        }
        Relationships: []
      }
      prusa: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      sales: {
        Row: {
          cost_per_unit: number
          created_at: string
          customer_id: string | null
          order_id: string | null
          platform: string | null
          product_id: string | null
          profit: number
          quantity_sold: number
          sale_date: string | null
          sale_id: string
          selling_price_per_unit: number
          shipping_status: string | null
          total_cost: number
          total_revenue: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          cost_per_unit: number
          created_at?: string
          customer_id?: string | null
          order_id?: string | null
          platform?: string | null
          product_id?: string | null
          profit: number
          quantity_sold?: number
          sale_date?: string | null
          sale_id?: string
          selling_price_per_unit: number
          shipping_status?: string | null
          total_cost: number
          total_revenue: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          cost_per_unit?: number
          created_at?: string
          customer_id?: string | null
          order_id?: string | null
          platform?: string | null
          product_id?: string | null
          profit?: number
          quantity_sold?: number
          sale_date?: string | null
          sale_id?: string
          selling_price_per_unit?: number
          shipping_status?: string | null
          total_cost?: number
          total_revenue?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      suppliers: {
        Row: {
          created_at: string
          estimated_shipping_time: string | null
          notes: string | null
          supplier_id: string
          supplier_location: string | null
          supplier_name: string
          supplier_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          estimated_shipping_time?: string | null
          notes?: string | null
          supplier_id?: string
          supplier_location?: string | null
          supplier_name: string
          supplier_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          estimated_shipping_time?: string | null
          notes?: string | null
          supplier_id?: string
          supplier_location?: string | null
          supplier_name?: string
          supplier_url?: string | null
          updated_at?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
