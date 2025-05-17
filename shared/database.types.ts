export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      batteries: {
        Row: {
          id: number
          name: string
          serial_number: string
          initial_capacity: number
          current_capacity: number
          health_percentage: number
          cycle_count: number
          expected_cycles: number
          status: string
          initial_date: string
          last_updated: string
          degradation_rate: number
          user_id: number | null
        }
        Insert: {
          id?: number
          name: string
          serial_number: string
          initial_capacity: number
          current_capacity: number
          health_percentage: number
          cycle_count: number
          expected_cycles: number
          status: string
          initial_date: string
          last_updated: string
          degradation_rate: number
          user_id?: number | null
        }
        Update: {
          id?: number
          name?: string
          serial_number?: string
          initial_capacity?: number
          current_capacity?: number
          health_percentage?: number
          cycle_count?: number
          expected_cycles?: number
          status?: string
          initial_date?: string
          last_updated?: string
          degradation_rate?: number
          user_id?: number | null
        }
      }
      battery_history: {
        Row: {
          id: number
          battery_id: number
          date: string
          capacity: number
          health_percentage: number
          cycle_count: number
        }
        Insert: {
          id?: number
          battery_id: number
          date: string
          capacity: number
          health_percentage: number
          cycle_count: number
        }
        Update: {
          id?: number
          battery_id?: number
          date?: string
          capacity?: number
          health_percentage?: number
          cycle_count?: number
        }
      }
      usage_patterns: {
        Row: {
          id: number
          battery_id: number
          charging_frequency: number
          discharge_depth: number
          charge_duration: number
          operating_temperature: number
          last_updated: string
        }
        Insert: {
          id?: number
          battery_id: number
          charging_frequency: number
          discharge_depth: number
          charge_duration: number
          operating_temperature: number
          last_updated: string
        }
        Update: {
          id?: number
          battery_id?: number
          charging_frequency?: number
          discharge_depth?: number
          charge_duration?: number
          operating_temperature?: number
          last_updated?: string
        }
      }
      recommendations: {
        Row: {
          id: number
          battery_id: number
          type: string
          message: string
          created_at: string
          resolved: boolean
        }
        Insert: {
          id?: number
          battery_id: number
          type: string
          message: string
          created_at: string
          resolved?: boolean
        }
        Update: {
          id?: number
          battery_id?: number
          type?: string
          message?: string
          created_at?: string
          resolved?: boolean
        }
      }
      users: {
        Row: {
          id: number
          username: string
          password: string
        }
        Insert: {
          id?: number
          username: string
          password: string
        }
        Update: {
          id?: number
          username?: string
          password?: string
        }
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