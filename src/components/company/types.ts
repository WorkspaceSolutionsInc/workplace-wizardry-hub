
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
  name: PredefinedAttribute;
  importance: number;
  company_id?: number;
  order_index: number;
}

export interface CompanyGoal {
  id: number;
  name: PredefinedGoal;
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

export type PredefinedAttribute = typeof PREDEFINED_ATTRIBUTES[number];

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

export type PredefinedGoal = typeof PREDEFINED_GOALS[number];

export const ATTRIBUTE_DESCRIPTIONS: Record<PredefinedAttribute, string> = {
  "Collaboration": "Spaces that encourage team interaction and communication",
  "Cost Efficiency": "Optimal use of space and resources to minimize operational costs",
  "Employee Wellness": "Features promoting physical and mental health",
  "Location Convenience": "Accessibility for employees and clients",
  "Brand Image / Aesthetics": "Visual appeal and alignment with company brand",
  "Quiet Spaces / Focus Areas": "Dedicated areas for concentrated work",
  "Technology Infrastructure": "IT systems and digital workspace capabilities",
  "Flexibility / Agile Spaces": "Adaptable spaces for different needs",
  "Sustainability / Green Initiatives": "Environmental impact and energy efficiency",
  "Security / Access Control": "Physical security and access management",
  "Amenities (Cafeteria, Gym)": "On-site facilities for employee convenience",
  "Parking / Transportation": "Access to parking and transit options",
  "Team Adjacencies": "Strategic placement of teams",
  "Openness / Layout Flow": "Space planning that promotes movement",
  "Daylight / Natural Lighting": "Access to natural light and views",
  "Safety (Fire, Earthquake readiness)": "Emergency preparedness features",
  "Workspace Density": "Appropriate space allocation per person",
  "Privacy / Soundproofing": "Acoustic and visual privacy measures",
  "Executive / Client Impressiveness": "Areas designed to impress visitors",
  "Furniture Ergonomics": "Comfortable, adjustable furniture"
};

export const GOAL_DESCRIPTIONS: Record<PredefinedGoal, string> = {
  "Cost Optimization": "Strategies to reduce operational expenses",
  "Workforce Retention": "Initiatives to maintain valuable employees",
  "Brand Enhancement": "Efforts to strengthen market position",
  "Innovation & Creativity": "Fostering new ideas and solutions",
  "Environmental Sustainability": "Reducing environmental impact",
  "Employee Well-being": "Programs for health and satisfaction",
  "Operational Efficiency": "Streamlining processes and productivity",
  "Market Expansion": "Growing into new markets",
  "Talent Attraction": "Recruiting top talent",
  "Digital Transformation": "Adopting new technologies"
};
