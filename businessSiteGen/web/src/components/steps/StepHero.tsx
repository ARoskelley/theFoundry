"use client";

import { useWizard } from "@/lib/store";

export default function StepHero() {
  const { state, dispatch } = useWizard();
  const { hero } = state.siteData;

  const setField = (path: string, value: string) =>
    dispatch({ type: "SET_FIELD", path, value });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
        <p className="mt-1 text-sm text-gray-500">
          The first thing visitors see. Make it count.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="wizard-label">Headline *</label>
          <input
            className="wizard-input text-lg"
            placeholder="e.g. Fresh coastal flavors, simply served."
            value={hero.headline}
            onChange={(e) => setField("hero.headline", e.target.value)}
          />
        </div>
        <div>
          <label className="wizard-label">Subheadline</label>
          <textarea
            className="wizard-input min-h-[70px]"
            placeholder="e.g. Chef-driven plates, house-made pastas, and a curated wine list."
            value={hero.subheadline}
            onChange={(e) => setField("hero.subheadline", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="wizard-label">Button Text</label>
            <input
              className="wizard-input"
              placeholder="e.g. Reserve a Table"
              value={hero.ctaText}
              onChange={(e) => setField("hero.ctaText", e.target.value)}
            />
          </div>
          <div>
            <label className="wizard-label">Button Link</label>
            <input
              className="wizard-input"
              placeholder="e.g. #contact or https://..."
              value={hero.ctaLink}
              onChange={(e) => setField("hero.ctaLink", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="wizard-label">Hero Image URL</label>
          <input
            className="wizard-input"
            placeholder="e.g. assets/images/hero.jpg"
            value={hero.image}
            onChange={(e) => setField("hero.image", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
