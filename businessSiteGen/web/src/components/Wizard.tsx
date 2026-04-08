"use client";

import { useWizard } from "@/lib/store";
import StepBasics from "./steps/StepBasics";
import StepBrand from "./steps/StepBrand";
import StepHero from "./steps/StepHero";
import StepAbout from "./steps/StepAbout";
import StepServices from "./steps/StepServices";
import StepIndustry from "./steps/StepIndustry";
import StepTestimonials from "./steps/StepTestimonials";
import StepCta from "./steps/StepCta";
import StepContact from "./steps/StepContact";
import StepSocial from "./steps/StepSocial";
import TemplateSelector from "./TemplateSelector";
import StepReview from "./steps/StepReview";

const steps = [
  { label: "Basics", component: StepBasics },
  { label: "Brand", component: StepBrand },
  { label: "Hero", component: StepHero },
  { label: "About", component: StepAbout },
  { label: "Services", component: StepServices },
  { label: "Industry", component: StepIndustry },
  { label: "Testimonials", component: StepTestimonials },
  { label: "CTA", component: StepCta },
  { label: "Contact", component: StepContact },
  { label: "Social", component: StepSocial },
  { label: "Template", component: TemplateSelector },
  { label: "Review", component: StepReview },
];

export default function Wizard() {
  const { state, dispatch } = useWizard();
  const { currentStep } = state;

  const StepComponent = steps[currentStep].component;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const goNext = () => {
    if (!isLast) dispatch({ type: "SET_STEP", step: currentStep + 1 });
  };

  const goPrev = () => {
    if (!isFirst) dispatch({ type: "SET_STEP", step: currentStep - 1 });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Step indicator */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {steps.map((step, i) => (
            <button
              key={step.label}
              type="button"
              onClick={() => dispatch({ type: "SET_STEP", step: i })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                i === currentStep
                  ? "bg-brand-600 text-white"
                  : i < currentStep
                  ? "bg-brand-100 text-brand-700"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-6">
        <StepComponent />
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 bg-white px-6 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={isFirst}
          className="btn-secondary"
        >
          Back
        </button>
        <span className="text-xs text-gray-400">
          {currentStep + 1} / {steps.length}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={isLast}
          className="btn-primary"
        >
          {isLast ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
}
