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
      cities: {
        Row: {
          city: string
          country: string
          created_at: string
          id: number
          is_major: boolean | null
          state: string
          updated_at: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          id?: number
          is_major?: boolean | null
          state: string
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: number
          is_major?: boolean | null
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      city_benchmarks: {
        Row: {
          avg_opex_psf: number | null
          avg_rent_psf: number | null
          city_id: number | null
          created_at: string
          id: number
          occupancy_rate: number | null
          quarter: number
          updated_at: string
          vacancy_rate: number | null
          year: number
        }
        Insert: {
          avg_opex_psf?: number | null
          avg_rent_psf?: number | null
          city_id?: number | null
          created_at?: string
          id?: number
          occupancy_rate?: number | null
          quarter: number
          updated_at?: string
          vacancy_rate?: number | null
          year: number
        }
        Update: {
          avg_opex_psf?: number | null
          avg_rent_psf?: number | null
          city_id?: number | null
          created_at?: string
          id?: number
          occupancy_rate?: number | null
          quarter?: number
          updated_at?: string
          vacancy_rate?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "city_benchmarks_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profiles: {
        Row: {
          company_size: number
          created_at: string
          id: number
          industry: Database["public"]["Enums"]["industry_type"]
          name: string
          number_of_sites: number | null
          updated_at: string
        }
        Insert: {
          company_size: number
          created_at?: string
          id?: number
          industry: Database["public"]["Enums"]["industry_type"]
          name: string
          number_of_sites?: number | null
          updated_at?: string
        }
        Update: {
          company_size?: number
          created_at?: string
          id?: number
          industry?: Database["public"]["Enums"]["industry_type"]
          name?: string
          number_of_sites?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      module_statuses: {
        Row: {
          created_at: string
          id: number
          module_type: string
          status: string
          updated_at: string
          warning_count: number | null
          warning_message: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          module_type: string
          status: string
          updated_at?: string
          warning_count?: number | null
          warning_message?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          module_type?: string
          status?: string
          updated_at?: string
          warning_count?: number | null
          warning_message?: string | null
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      workspace_attributes: {
        Row: {
          company_id: number | null
          created_at: string
          id: number
          importance: number | null
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          company_id?: number | null
          created_at?: string
          id?: number
          importance?: number | null
          name: string
          order_index: number
          updated_at?: string
        }
        Update: {
          company_id?: number | null
          created_at?: string
          id?: number
          importance?: number | null
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_attributes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
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
      industry_type:
        | "Technology"
        | "Finance"
        | "Healthcare"
        | "Retail"
        | "Manufacturing"
        | "Professional Services"
        | "Education"
        | "Government"
        | "Other"
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
