
export type Industry = 
  | "Technology"
  | "Finance"
  | "Healthcare"
  | "Retail"
  | "Manufacturing"
  | "Professional Services"
  | "Education"
  | "Government"
  | "Other";

export interface CompanyProfile {
  id: number;
  name: string;
  industry: Industry;
  company_size: number;
  number_of_sites: number;
}

export interface WorkspaceAttribute {
  id: number;
  name: string;
  importance: number;
  order_index: number;
}

export interface CompanyGoal {
  id: number;
  name: string;
  company_id: number;
}

export interface IndustryWeighting {
  id: number;
  attribute_name: string;
  default_weight: number;
}
