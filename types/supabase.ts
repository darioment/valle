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
      zones: {
        Row: {
          id: string
          name: string
          type: 'restaurant' | 'bar' | 'ticket_office'
          status: 'open' | 'closed'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'restaurant' | 'bar' | 'ticket_office'
          status?: 'open' | 'closed'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'restaurant' | 'bar' | 'ticket_office'
          status?: 'open' | 'closed'
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'waiter' | 'cook' | 'cashier'
          zone_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role: 'admin' | 'waiter' | 'cook' | 'cashier'
          zone_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'waiter' | 'cook' | 'cashier'
          zone_id?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: 'food' | 'drink' | 'ticket' | 'promotion'
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: 'food' | 'drink' | 'ticket' | 'promotion'
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: 'food' | 'drink' | 'ticket' | 'promotion'
          image_url?: string | null
          created_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          zone_id: string
          product_id: string
          quantity: number
          min_stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          zone_id: string
          product_id: string
          quantity?: number
          min_stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          zone_id?: string
          product_id?: string
          quantity?: number
          min_stock?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          zone_id: string
          table_number: number | null
          status: 'pending' | 'preparing' | 'completed' | 'cancelled'
          total_amount: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          zone_id: string
          table_number?: number | null
          status?: 'pending' | 'preparing' | 'completed' | 'cancelled'
          total_amount?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          zone_id?: string
          table_number?: number | null
          status?: 'pending' | 'preparing' | 'completed' | 'cancelled'
          total_amount?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          notes: string | null
          status: 'pending' | 'preparing' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          notes?: string | null
          status?: 'pending' | 'preparing' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          notes?: string | null
          status?: 'pending' | 'preparing' | 'completed'
          created_at?: string
        }
      }
    }
  }
}