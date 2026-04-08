"use client";

import { useMemo, useState } from "react";
import { useWizard } from "@/lib/store";
import { validate } from "@/lib/types";
import { processTemplate } from "@/lib/placeholderEngine";
import { templateHtml } from "@/lib/templateHtml";

export default function StepReview() {
  const { state } = useWizard();
  const errors = useMemo(() => validate(state.siteData), [state.siteData]);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const template = templateHtml[state.selectedTemplate];
    if (!template) return;

    const html = processTemplate(template, state.siteData, true);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.siteData.meta.siteName || "site"}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  const handleExportJson = () => {
    const json = JSON.stringify(state.siteData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.siteData.meta.siteName || "site"}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Review & Generate</h2>
        <p className="mt-1 text-sm text-gray-500">
          Check your info and download your site.
        </p>
      </div>

      {/* Validation */}
      {errors.length > 0 ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            Please fix before generating:
          </h3>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800 font-medium">
            All required fields are filled. Ready to generate!
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="wizard-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Summary</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-gray-500">Business</dt>
          <dd className="text-gray-900 font-medium">{state.siteData.meta.siteName || "—"}</dd>
          <dt className="text-gray-500">Industry</dt>
          <dd className="text-gray-900 font-medium capitalize">{state.industryType || "—"}</dd>
          <dt className="text-gray-500">Template</dt>
          <dd className="text-gray-900 font-medium capitalize">{state.selectedTemplate}</dd>
          <dt className="text-gray-500">Services</dt>
          <dd className="text-gray-900">{state.siteData.services.length} items</dd>
          <dt className="text-gray-500">Testimonials</dt>
          <dd className="text-gray-900">{state.siteData.testimonials.length} items</dd>
        </dl>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={errors.length > 0}
          className="btn-primary"
        >
          {downloaded ? "Downloaded!" : "Download HTML"}
        </button>
        <button type="button" onClick={handleExportJson} className="btn-secondary">
          Export JSON
        </button>
      </div>
    </div>
  );
}
