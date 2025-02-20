
export interface Space {
  id: number;
  name: string;
  location: string;
  square_feet: number;
  monthly_cost: number | null;
  company_id: number | null;
  created_at: string;
  updated_at: string;
}
