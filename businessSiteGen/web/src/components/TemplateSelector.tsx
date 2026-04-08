"use client";

import { useWizard } from "@/lib/store";
import { templates } from "@/lib/templates";

export default function TemplateSelector() {
  const { state, dispatch } = useWizard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Choose a Template</h2>
        <p className="mt-1 text-sm text-gray-500">
          Pick a layout that fits your business. The template is auto-matched to
          your industry, but you can override it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => dispatch({ type: "SET_TEMPLATE", template: tmpl.id })}
            className={`rounded-xl border-2 p-5 text-left transition-all ${
              state.selectedTemplate === tmpl.id
                ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="text-base font-semibold text-gray-900">
              {tmpl.name}
            </div>
            <p className="mt-1 text-sm text-gray-500">{tmpl.description}</p>
            <div className="mt-3 flex gap-2">
              {tmpl.navLinks.map((link) => (
                <span
                  key={link.label}
                  className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-600"
                >
                  {link.label}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
