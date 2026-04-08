"use client";

import { useMemo, useState } from "react";
import { useWizard } from "@/lib/store";
import { processTemplate } from "@/lib/placeholderEngine";
import { templateHtml } from "@/lib/templateHtml";

export default function LivePreview() {
  const { state } = useWizard();
  const [scale, setScale] = useState<"desktop" | "mobile">("desktop");

  const html = useMemo(() => {
    const template = templateHtml[state.selectedTemplate];
    if (!template) return "<p>Select a template to preview.</p>";
    return processTemplate(template, state.siteData, true);
  }, [state.siteData, state.selectedTemplate]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Live Preview
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setScale("desktop")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              scale === "desktop"
                ? "bg-brand-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setScale("mobile")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              scale === "mobile"
                ? "bg-brand-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Mobile
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4 flex justify-center">
        <div
          className={`bg-white shadow-lg transition-all duration-300 ${
            scale === "mobile" ? "w-[375px]" : "w-full max-w-[1024px]"
          }`}
          style={{ minHeight: "600px" }}
        >
          <iframe
            srcDoc={html}
            title="Site Preview"
            className="w-full h-full min-h-[600px] border-0"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
