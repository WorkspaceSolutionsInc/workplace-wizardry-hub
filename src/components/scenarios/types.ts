
export type ScenarioStatus = 'draft' | 'in_progress' | 'completed';

export type ScenarioObjective = 
  | 'cost_optimization'
  | 'workforce_retention'
  | 'brand_enhancement'
  | 'innovation_and_creativity'
  | 'environmental_sustainability'
  | 'employee_wellbeing'
  | 'operational_efficiency'
  | 'market_expansion'
  | 'talent_attraction'
  | 'digital_transformation';

export interface Scenario {
  id: number;
  name: string;
  objective: ScenarioObjective;
  status: ScenarioStatus;
  description?: string;
  created_at: string;
  updated_at: string;
  company_id?: number;
}

export interface ScenarioLOB {
  id: number;
  scenario_id: number;
  lob_id: number;
  created_at: string;
}

export interface ScenarioSpace {
  id: number;
  scenario_id: number;
  space_id: number;
  created_at: string;
}

export interface ScenarioAttributeRating {
  id: number;
  scenario_id: number;
  attribute_id: number;
  lob_id: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface ScenarioFinancial {
  id: number;
  scenario_id: number;
  space_id: number;
  monthly_cost?: number;
  lease_term_months?: number;
  start_date?: string;
  created_at: string;
  updated_at: string;
}
