"use client";

import { useWizard } from "@/lib/store";

export default function StepCta() {
  const { state, dispatch } = useWizard();
  const { cta } = state.siteData;

  const setField = (path: string, value: string) =>
    dispatch({ type: "SET_FIELD", path, value });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Call to Action</h2>
        <p className="mt-1 text-sm text-gray-500">
          A bold section that nudges visitors to take the next step.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="wizard-label">Title</label>
          <input
            className="wizard-input"
            placeholder="e.g. Ready for dinner?"
            value={cta.title}
            onChange={(e) => setField("cta.title", e.target.value)}
          />
        </div>
        <div>
          <label className="wizard-label">Body</label>
          <textarea
            className="wizard-input min-h-[70px]"
            placeholder="e.g. Reserve your table or join us at the bar."
            value={cta.body}
            onChange={(e) => setField("cta.body", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="wizard-label">Button Text *</label>
            <input
              className="wizard-input"
              placeholder="e.g. Book Now"
              value={cta.buttonText}
              onChange={(e) => setField("cta.buttonText", e.target.value)}
            />
          </div>
          <div>
            <label className="wizard-label">Button Link</label>
            <input
              className="wizard-input"
              placeholder="e.g. #contact"
              value={cta.buttonLink}
              onChange={(e) => setField("cta.buttonLink", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
