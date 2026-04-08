"use client";

import { useState } from "react";
import Link from "next/link";
import { WizardProvider } from "@/lib/store";
import Wizard from "@/components/Wizard";
import LivePreview from "@/components/LivePreview";

export default function EditorPage() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <WizardProvider>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white z-10">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <div className="h-7 w-7 rounded-md bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                  SF
                </div>
                <span className="text-sm font-semibold hidden sm:inline">
                  SiteFoundry
                </span>
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary text-xs sm:hidden"
            >
              {showPreview ? "Editor" : "Preview"}
            </button>
          </div>
        </header>

        {/* Body — split pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Wizard panel */}
          <div
            className={`w-full sm:w-[480px] sm:min-w-[400px] sm:max-w-[520px] border-r border-gray-200 flex-shrink-0 ${
              showPreview ? "hidden sm:flex" : "flex"
            } flex-col`}
          >
            <Wizard />
          </div>

          {/* Preview panel */}
          <div
            className={`flex-1 ${
              showPreview ? "flex" : "hidden sm:flex"
            } flex-col bg-gray-100`}
          >
            <LivePreview />
          </div>
        </div>
      </div>
    </WizardProvider>
  );
}
