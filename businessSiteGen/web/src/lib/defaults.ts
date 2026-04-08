import type { SiteData } from "./types";

export const defaultSiteData: SiteData = {
  meta: {
    siteName: "",
    tagline: "",
    domain: "",
    language: "en",
    title: "",
    description: "",
    canonicalUrl: "",
    ogImage: "",
    favicon: "",
  },
  brand: {
    logo: "",
    colors: {
      primary: "#111827",
      secondary: "#94A3B8",
      accent: "#F59E0B",
      background: "#F8FAFC",
      text: "#0F172A",
    },
    fonts: {
      heading: "serif",
      body: "sans-serif",
    },
  },
  hero: {
    headline: "",
    subheadline: "",
    ctaText: "",
    ctaLink: "",
    image: "",
  },
  about: {
    title: "",
    body: "",
    image: "",
  },
  services: [],
  testimonials: [],
  cta: {
    title: "",
    body: "",
    buttonText: "",
    buttonLink: "",
  },
  contact: {
    phone: "",
    email: "",
    address: "",
    hours: "",
    mapEmbed: "",
  },
  locations: [],
  social: [],
};
