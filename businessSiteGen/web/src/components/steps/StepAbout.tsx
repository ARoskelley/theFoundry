"use client";

import { useWizard } from "@/lib/store";

export default function StepAbout() {
  const { state, dispatch } = useWizard();
  const { about } = state.siteData;

  const setField = (path: string, value: string) =>
    dispatch({ type: "SET_FIELD", path, value });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">About Section</h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell visitors what makes your business special.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="wizard-label">Title</label>
          <input
            className="wizard-input"
            placeholder="e.g. A dining room built for lingering"
            value={about.title}
            onChange={(e) => setField("about.title", e.target.value)}
          />
        </div>
        <div>
          <label className="wizard-label">Body</label>
          <textarea
            className="wizard-input min-h-[120px]"
            placeholder="Tell your story..."
            value={about.body}
            onChange={(e) => setField("about.body", e.target.value)}
          />
        </div>
        <div>
          <label className="wizard-label">Image URL</label>
          <input
            className="wizard-input"
            placeholder="e.g. assets/images/about.jpg"
            value={about.image}
            onChange={(e) => setField("about.image", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
