"use client";

import { useWizard } from "@/lib/store";
import type { Testimonial } from "@/lib/types";

const emptyTestimonial: Testimonial = { name: "", quote: "", role: "", image: "" };

export default function StepTestimonials() {
  const { state, dispatch } = useWizard();
  const testimonials = state.siteData.testimonials;

  const add = () =>
    dispatch({ type: "ADD_LIST_ITEM", path: "testimonials", item: { ...emptyTestimonial } });

  const remove = (i: number) =>
    dispatch({ type: "REMOVE_LIST_ITEM", path: "testimonials", index: i });

  const update = (i: number, field: keyof Testimonial, value: string) =>
    dispatch({
      type: "UPDATE_LIST_ITEM",
      path: "testimonials",
      index: i,
      value: { ...testimonials[i], [field]: value },
    });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Testimonials</h2>
          <p className="mt-1 text-sm text-gray-500">
            Social proof builds trust. Add customer quotes.
          </p>
        </div>
        <button type="button" onClick={add} className="btn-primary text-xs">
          + Add
        </button>
      </div>

      {testimonials.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">No testimonials yet.</p>
          <button type="button" onClick={add} className="mt-3 btn-secondary text-xs">
            Add your first testimonial
          </button>
        </div>
      )}

      <div className="space-y-4">
        {testimonials.map((t, i) => (
          <div key={i} className="wizard-card relative">
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg leading-none"
            >
              &times;
            </button>
            <div className="grid gap-3 sm:grid-cols-2 pr-6">
              <div>
                <label className="wizard-label">Name</label>
                <input className="wizard-input" placeholder="e.g. Jane D." value={t.name} onChange={(e) => update(i, "name", e.target.value)} />
              </div>
              <div>
                <label className="wizard-label">Role / Title</label>
                <input className="wizard-input" placeholder="e.g. Local Guide" value={t.role} onChange={(e) => update(i, "role", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="wizard-label">Quote</label>
                <textarea className="wizard-input min-h-[60px]" placeholder="What did they say?" value={t.quote} onChange={(e) => update(i, "quote", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="wizard-label">Photo URL</label>
                <input className="wizard-input" placeholder="Optional" value={t.image} onChange={(e) => update(i, "image", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
