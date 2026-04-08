"use client";

import { useWizard } from "@/lib/store";
import type { SocialLink } from "@/lib/types";

const commonPlatforms = ["Facebook", "Instagram", "X / Twitter", "LinkedIn", "YouTube", "TikTok", "Yelp", "Google Business"];

export default function StepSocial() {
  const { state, dispatch } = useWizard();
  const social = state.siteData.social;

  const add = (label = "") =>
    dispatch({
      type: "ADD_LIST_ITEM",
      path: "social",
      item: { label, url: "" } as SocialLink,
    });

  const remove = (i: number) =>
    dispatch({ type: "REMOVE_LIST_ITEM", path: "social", index: i });

  const update = (i: number, field: keyof SocialLink, value: string) =>
    dispatch({
      type: "UPDATE_LIST_ITEM",
      path: "social",
      index: i,
      value: { ...social[i], [field]: value },
    });

  const activeLabels = new Set(social.map((s) => s.label));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add links to your social media profiles.
        </p>
      </div>

      {/* Quick-add buttons */}
      <div>
        <label className="wizard-label">Quick Add</label>
        <div className="flex flex-wrap gap-2">
          {commonPlatforms.filter((p) => !activeLabels.has(p)).map((platform) => (
            <button
              key={platform}
              type="button"
              onClick={() => add(platform)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:border-brand-500 hover:text-brand-600 transition-colors"
            >
              + {platform}
            </button>
          ))}
        </div>
      </div>

      {social.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">No social links yet. Click a platform above or add a custom one.</p>
          <button type="button" onClick={() => add("")} className="mt-3 btn-secondary text-xs">
            Add custom link
          </button>
        </div>
      )}

      <div className="space-y-2">
        {social.map((link, i) => (
          <div key={i} className="grid grid-cols-[140px_1fr_24px] gap-2 items-end">
            <input
              className="wizard-input text-xs"
              placeholder="Label"
              value={link.label}
              onChange={(e) => update(i, "label", e.target.value)}
            />
            <input
              className="wizard-input text-xs"
              placeholder="https://..."
              value={link.url}
              onChange={(e) => update(i, "url", e.target.value)}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-gray-400 hover:text-red-500 text-sm"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
