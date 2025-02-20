
export interface LineOfBusiness {
  id: number;
  name: string;
  type: 'Research' | 'Marketing' | 'Sales' | 'Operations' | 'Engineering' | 'Finance' | 'Human Resources' | 'Legal' | 'IT' | 'Customer Service';
  headcount: number;
  company_id: number | null;
  created_at: string;
  updated_at: string;
}
