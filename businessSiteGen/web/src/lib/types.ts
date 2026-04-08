export interface SiteData {
  meta: Meta;
  brand: Brand;
  hero: Hero;
  about: About;
  services: ServiceItem[];
  testimonials: Testimonial[];
  cta: Cta;
  contact: Contact;
  locations: Location[];
  social: SocialLink[];
  restaurant?: RestaurantData;
  contractor?: ContractorData;
  realEstate?: RealEstateData;
  service?: ServiceBusinessData;
}

export interface Meta {
  siteName: string;
  tagline: string;
  domain: string;
  language: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  favicon: string;
}

export interface Brand {
  logo: string;
  colors: BrandColors;
  fonts: BrandFonts;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BrandFonts {
  heading: string;
  body: string;
}

export interface Hero {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface About {
  title: string;
  body: string;
  image: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  quote: string;
  role: string;
  image: string;
}

export interface Cta {
  title: string;
  body: string;
  buttonText: string;
  buttonLink: string;
}

export interface Contact {
  phone: string;
  email: string;
  address: string;
  hours: string;
  mapEmbed: string;
}

export interface Location {
  label: string;
  address: string;
  phone: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

// --- Industry-specific ---

export interface RestaurantData {
  menuSections: MenuSection[];
  reservations?: Reservation;
  gallery: ImageItem[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
}

export interface Reservation {
  ctaText: string;
  ctaLink: string;
}

export interface ImageItem {
  image: string;
  alt: string;
}

export interface ContractorData {
  beforeAfter: BeforeAfter[];
  process: ProcessStep[];
  certifications: Certification[];
}

export interface BeforeAfter {
  beforeImage: string;
  afterImage: string;
  caption: string;
}

export interface ProcessStep {
  step: string;
  detail: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface RealEstateData {
  featuredListings: Listing[];
  agents: Agent[];
  neighborhoods: Neighborhood[];
}

export interface Listing {
  title: string;
  price: string;
  address: string;
  beds: string;
  baths: string;
  sqft: string;
  image: string;
}

export interface Agent {
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
}

export interface Neighborhood {
  name: string;
  summary: string;
}

export interface ServiceBusinessData {
  pricing: PricingPlan[];
  faqs: FaqItem[];
  coverage: Coverage;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Coverage {
  areas: string[];
  notes: string;
}

export type IndustryType = "restaurant" | "contractor" | "realEstate" | "service";

export function validate(site: SiteData): string[] {
  const errors: string[] = [];
  if (!site.meta.siteName.trim()) errors.push("Business name is required.");
  if (!site.meta.title.trim()) errors.push("Page title is required.");
  if (!site.meta.description.trim()) errors.push("Description is required.");
  if (!site.hero.headline.trim()) errors.push("Hero headline is required.");
  if (!site.cta.buttonText.trim()) errors.push("CTA button text is required.");
  if (!site.contact.email.trim() && !site.contact.phone.trim())
    errors.push("At least a phone or email is required.");
  return errors;
}
