"use client";

import { useWizard } from "@/lib/store";

const presets = [
  { name: "Ocean", primary: "#0E3B43", secondary: "#A2C9B9", accent: "#F0B429", background: "#FBF7F2", text: "#1F2A2E" },
  { name: "Slate", primary: "#111827", secondary: "#94A3B8", accent: "#F59E0B", background: "#F8FAFC", text: "#0F172A" },
  { name: "Forest", primary: "#14532D", secondary: "#86EFAC", accent: "#FBBF24", background: "#F0FDF4", text: "#052E16" },
  { name: "Crimson", primary: "#7F1D1D", secondary: "#FCA5A5", accent: "#F59E0B", background: "#FEF2F2", text: "#450A0A" },
  { name: "Royal", primary: "#1E3A5F", secondary: "#93C5FD", accent: "#F97316", background: "#EFF6FF", text: "#0C1929" },
  { name: "Plum", primary: "#581C87", secondary: "#D8B4FE", accent: "#F59E0B", background: "#FAF5FF", text: "#3B0764" },
];

const fontPairs = [
  { heading: "Georgia, serif", body: "system-ui, sans-serif", label: "Classic" },
  { heading: "Fraunces, serif", body: "Work Sans, sans-serif", label: "Modern Serif" },
  { heading: "Inter, sans-serif", body: "Inter, sans-serif", label: "Clean" },
  { heading: "Playfair Display, serif", body: "Source Sans 3, sans-serif", label: "Elegant" },
  { heading: "Montserrat, sans-serif", body: "Open Sans, sans-serif", label: "Professional" },
];

export default function StepBrand() {
  const { state, dispatch } = useWizard();
  const { colors, fonts } = state.siteData.brand;

  const setField = (path: string, value: string) =>
    dispatch({ type: "SET_FIELD", path, value });

  const applyPreset = (preset: typeof presets[0]) => {
    setField("brand.colors.primary", preset.primary);
    setField("brand.colors.secondary", preset.secondary);
    setField("brand.colors.accent", preset.accent);
    setField("brand.colors.background", preset.background);
    setField("brand.colors.text", preset.text);
  };

  const applyFonts = (pair: typeof fontPairs[0]) => {
    setField("brand.fonts.heading", pair.heading);
    setField("brand.fonts.body", pair.body);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Branding</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose colors and fonts that match your brand identity.
        </p>
      </div>

      {/* Color presets */}
      <div>
        <label className="wizard-label">Color Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-left hover:border-gray-300 transition-colors"
            >
              <div className="flex -space-x-1">
                <div className="h-5 w-5 rounded-full border border-white" style={{ backgroundColor: p.primary }} />
                <div className="h-5 w-5 rounded-full border border-white" style={{ backgroundColor: p.secondary }} />
                <div className="h-5 w-5 rounded-full border border-white" style={{ backgroundColor: p.accent }} />
              </div>
              <span className="text-xs font-medium text-gray-700">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual color pickers */}
      <div>
        <label className="wizard-label">Custom Colors</label>
        <div className="grid grid-cols-5 gap-3">
          {(
            [
              ["Primary", "brand.colors.primary", colors.primary],
              ["Secondary", "brand.colors.secondary", colors.secondary],
              ["Accent", "brand.colors.accent", colors.accent],
              ["Background", "brand.colors.background", colors.background],
              ["Text", "brand.colors.text", colors.text],
            ] as const
          ).map(([label, path, value]) => (
            <div key={path} className="text-center">
              <input
                type="color"
                value={value}
                onChange={(e) => setField(path, e.target.value)}
                className="mx-auto h-10 w-10 cursor-pointer rounded-lg border border-gray-200"
              />
              <div className="mt-1 text-[10px] font-medium text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Font pairs */}
      <div>
        <label className="wizard-label">Font Pairing</label>
        <div className="grid gap-2">
          {fontPairs.map((pair) => (
            <button
              key={pair.label}
              type="button"
              onClick={() => applyFonts(pair)}
              className={`rounded-lg border-2 p-3 text-left transition-all ${
                fonts.heading === pair.heading
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span
                className="block text-base font-semibold text-gray-900"
                style={{ fontFamily: pair.heading }}
              >
                {pair.label}
              </span>
              <span
                className="text-xs text-gray-500"
                style={{ fontFamily: pair.body }}
              >
                Heading: {pair.heading.split(",")[0]} / Body: {pair.body.split(",")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Logo URL */}
      <div>
        <label className="wizard-label">Logo URL (optional)</label>
        <input
          className="wizard-input"
          placeholder="https://example.com/logo.png or assets/logo.svg"
          value={state.siteData.brand.logo}
          onChange={(e) => setField("brand.logo", e.target.value)}
        />
        <p className="mt-1 text-xs text-gray-400">
          Leave blank to auto-generate initials from your business name.
        </p>
      </div>
    </div>
  );
}
