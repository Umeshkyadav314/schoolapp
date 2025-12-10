import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export interface School {
  id: number
  name: string
  address: string
  city: string
  state: string
  contact: string
  image: string | null
  email_id: string
  user_id: number | null
  created_at: Date
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  country_code: string
  password_hash: string
  created_at: Date
}
