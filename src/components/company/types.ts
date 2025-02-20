
export interface CompanyProfile {
  id: number;
  name: string;
  industry: Industry;
  company_size: number;
  number_of_sites: number;
}

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

export interface WorkspaceAttribute {
  id: number;
  name: string;
  importance: number;
  company_id?: number;
  order_index: number;
}

export interface CompanyGoal {
  id: number;
  name: string;
  company_id?: number;
  importance: number;
  is_primary: boolean;
}

export interface IndustryWeighting {
  id: number;
  industry: string;
  attribute_name: string;
  default_weight: number;
}

export const PREDEFINED_ATTRIBUTES = [
  "Collaboration",
  "Cost Efficiency",
  "Employee Wellness",
  "Location Convenience",
  "Brand Image / Aesthetics",
  "Quiet Spaces / Focus Areas",
  "Technology Infrastructure",
  "Flexibility / Agile Spaces",
  "Sustainability / Green Initiatives",
  "Security / Access Control",
  "Amenities (Cafeteria, Gym)",
  "Parking / Transportation",
  "Team Adjacencies",
  "Openness / Layout Flow",
  "Daylight / Natural Lighting",
  "Safety (Fire, Earthquake readiness)",
  "Workspace Density",
  "Privacy / Soundproofing",
  "Executive / Client Impressiveness",
  "Furniture Ergonomics"
] as const;

export const PREDEFINED_GOALS = [
  "Cost Optimization",
  "Workforce Retention",
  "Brand Enhancement",
  "Innovation & Creativity",
  "Environmental Sustainability",
  "Employee Well-being",
  "Operational Efficiency",
  "Market Expansion",
  "Talent Attraction",
  "Digital Transformation"
] as const;
