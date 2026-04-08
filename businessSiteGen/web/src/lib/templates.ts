export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  industry: string;
  navLinks: { label: string; href: string }[];
}

export const templates: TemplateInfo[] = [
  {
    id: "restaurant",
    name: "Restaurant",
    description: "Elegant layout for dining establishments with menu, gallery, and reservations.",
    industry: "restaurant",
    navLinks: [
      { label: "Menu", href: "#menu" },
      { label: "Reservations", href: "#reservations" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    id: "contractor",
    name: "Contractor",
    description: "Bold industrial layout for construction & trades with before/after showcase.",
    industry: "contractor",
    navLinks: [
      { label: "Work", href: "#work" },
      { label: "Process", href: "#process" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    id: "realestate",
    name: "Real Estate",
    description: "Professional layout for agents & brokers with listings and team profiles.",
    industry: "realEstate",
    navLinks: [
      { label: "Listings", href: "#listings" },
      { label: "Agents", href: "#agents" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    id: "service",
    name: "Service Business",
    description: "Clean layout for service businesses with pricing tiers, FAQs, and coverage areas.",
    industry: "service",
    navLinks: [
      { label: "Pricing", href: "#pricing" },
      { label: "FAQs", href: "#faqs" },
      { label: "Contact", href: "#contact" },
    ],
  },
];
