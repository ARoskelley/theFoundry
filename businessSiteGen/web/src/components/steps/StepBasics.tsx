"use client";

import { useWizard } from "@/lib/store";
import type { IndustryType } from "@/lib/types";

const industries: { id: IndustryType; label: string; description: string }[] = [
  { id: "restaurant", label: "Restaurant", description: "Dining, cafes, bars, food trucks" },
  { id: "contractor", label: "Contractor", description: "Construction, trades, remodeling" },
  { id: "realEstate", label: "Real Estate", description: "Agents, brokers, property management" },
  { id: "service", label: "Service Business", description: "HVAC, plumbing, cleaning, consulting" },
];

export default function StepBasics() {
  const { state, dispatch } = useWizard();
  const { siteData, industryType } = state;

  const setField = (path: string, value: string) =>
    dispatch({ type: "SET_FIELD", path, value });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Business Basics</h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell us about your business. This information appears throughout your site.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="wizard-label">Business Name *</label>
          <input
            className="wizard-input"
            placeholder="e.g. Cedar & Salt"
            value={siteData.meta.siteName}
            onChange={(e) => setField("meta.siteName", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="wizard-label">Tagline</label>
          <input
            className="wizard-input"
            placeholder="e.g. Coastal cuisine in the heart of downtown"
            value={siteData.meta.tagline}
            onChange={(e) => setField("meta.tagline", e.target.value)}
          />
        </div>
        <div>
          <label className="wizard-label">Page Title *</label>
          <input
            className="wizard-input"
            placeholder="e.g. Cedar & Salt | Fresh Coastal Cuisine"
            value={siteData.meta.title}
            onChange={(e) => setField("meta.title", e.target.value)}
          />
        </div>
        <div>
          <label className="wizard-label">Domain</label>
          <input
            className="wizard-input"
            placeholder="e.g. cedarandsalt.com"
            value={siteData.meta.domain}
            onChange={(e) => setField("meta.domain", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="wizard-label">Description *</label>
          <textarea
            className="wizard-input min-h-[80px]"
            placeholder="A short description for search engines and social sharing"
            value={siteData.meta.description}
            onChange={(e) => setField("meta.description", e.target.value)}
          />
        </div>
      </div>

      {/* Industry selector */}
      <div>
        <label className="wizard-label">Industry Type *</label>
        <p className="mb-3 text-xs text-gray-500">
          This determines which template sections and fields are available.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {industries.map((ind) => (
            <button
              key={ind.id}
              type="button"
              onClick={() => dispatch({ type: "SET_INDUSTRY", industry: ind.id })}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                industryType === ind.id
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-gray-900">{ind.label}</div>
              <div className="mt-0.5 text-xs text-gray-500">{ind.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
