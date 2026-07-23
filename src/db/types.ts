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
      accounts: {
        Row: {
          archived: boolean
          color: string | null
          created_at: string
          currency: string
          icon: string | null
          id: string
          name: string
          sort_order: number
          starting_balance_minor: number
          type: 'cash' | 'bank' | 'card' | 'ewallet'
          user_id: string
        }
        Insert: {
          archived?: boolean
          color?: string | null
          created_at?: string
          currency?: string
          icon?: string | null
          id?: string
          name: string
          sort_order?: number
          starting_balance_minor?: number
          type: 'cash' | 'bank' | 'card' | 'ewallet'
          user_id: string
        }
        Update: {
          archived?: boolean
          color?: string | null
          created_at?: string
          currency?: string
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number
          starting_balance_minor?: number
          type?: 'cash' | 'bank' | 'card' | 'ewallet'
          user_id?: string
        }
      }
      categories: {
        Row: {
          archived: boolean
          color: string | null
          icon: string | null
          id: string
          kind: 'income' | 'expense'
          name: string
          parent_id: string | null
          sort_order: number
          user_id: string
        }
        Insert: {
          archived?: boolean
          color?: string | null
          icon?: string | null
          id?: string
          kind: 'income' | 'expense'
          name: string
          parent_id?: string | null
          sort_order?: number
          user_id: string
        }
        Update: {
          archived?: boolean
          color?: string | null
          icon?: string | null
          id?: string
          kind?: 'income' | 'expense'
          name?: string
          parent_id?: string | null
          sort_order?: number
          user_id?: string
        }
      }
      transactions: {
        Row: {
          account_id: string
          amount_minor: number
          category_id: string | null
          created_at: string
          date: string
          id: string
          kind: 'income' | 'expense' | 'transfer'
          note: string | null
          tags: string[]
          to_account_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          amount_minor: number
          category_id?: string | null
          created_at?: string
          date: string
          id?: string
          kind: 'income' | 'expense' | 'transfer'
          note?: string | null
          tags?: string[]
          to_account_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          amount_minor?: number
          category_id?: string | null
          created_at?: string
          date?: string
          id?: string
          kind?: 'income' | 'expense' | 'transfer'
          note?: string | null
          tags?: string[]
          to_account_id?: string | null
          updated_at?: string
          user_id?: string
        }
      }
      budgets: {
        Row: {
          amount_minor: number
          category_id: string
          id: string
          period: string
          start_month: string
          user_id: string
        }
        Insert: {
          amount_minor: number
          category_id: string
          id?: string
          period?: string
          start_month: string
          user_id: string
        }
        Update: {
          amount_minor?: number
          category_id?: string
          id?: string
          period?: string
          start_month?: string
          user_id?: string
        }
      }
      recurring_bills: {
        Row: {
          id: string
          user_id: string
          account_id: string
          category_id: string | null
          name: string
          amount_minor: number
          kind: 'income' | 'expense' | 'transfer'
          frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
          next_due_date: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          category_id?: string | null
          name: string
          amount_minor: number
          kind: 'income' | 'expense' | 'transfer'
          frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
          next_due_date: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          category_id?: string | null
          name?: string
          amount_minor?: number
          kind?: 'income' | 'expense' | 'transfer'
          frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'
          next_due_date?: string
          is_active?: boolean
          created_at?: string
        }
      }
      settings: {
        Row: {
          currency: string
          first_day_of_week: number
          language: string
          onboarding_complete: boolean
          theme: string
          user_id: string
        }
        Insert: {
          currency?: string
          first_day_of_week?: number
          language?: string
          onboarding_complete?: boolean
          theme?: string
          user_id: string
        }
        Update: {
          currency?: string
          first_day_of_week?: number
          language?: string
          onboarding_complete?: boolean
          theme?: string
          user_id?: string
        }
      }
    }
    Views: {
      account_balances: {
        Row: {
          account_id: string
          user_id: string
          balance_minor: number
        }
      }
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
