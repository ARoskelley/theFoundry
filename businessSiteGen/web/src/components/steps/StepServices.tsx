"use client";

import { useWizard } from "@/lib/store";
import type { ServiceItem } from "@/lib/types";

const emptyService: ServiceItem = { title: "", description: "", icon: "" };

export default function StepServices() {
  const { state, dispatch } = useWizard();
  const services = state.siteData.services;

  const add = () =>
    dispatch({ type: "ADD_LIST_ITEM", path: "services", item: { ...emptyService } });

  const remove = (i: number) =>
    dispatch({ type: "REMOVE_LIST_ITEM", path: "services", index: i });

  const update = (i: number, field: keyof ServiceItem, value: string) => {
    dispatch({
      type: "UPDATE_LIST_ITEM",
      path: "services",
      index: i,
      value: { ...services[i], [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Services</h2>
          <p className="mt-1 text-sm text-gray-500">
            What do you offer? Add your main services or offerings.
          </p>
        </div>
        <button type="button" onClick={add} className="btn-primary text-xs">
          + Add
        </button>
      </div>

      {services.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">No services added yet.</p>
          <button type="button" onClick={add} className="mt-3 btn-secondary text-xs">
            Add your first service
          </button>
        </div>
      )}

      <div className="space-y-4">
        {services.map((svc, i) => (
          <div key={i} className="wizard-card relative">
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg leading-none"
              title="Remove"
            >
              &times;
            </button>
            <div className="grid gap-3 sm:grid-cols-2 pr-6">
              <div>
                <label className="wizard-label">Title</label>
                <input
                  className="wizard-input"
                  placeholder="e.g. Dine-In"
                  value={svc.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                />
              </div>
              <div>
                <label className="wizard-label">Icon URL</label>
                <input
                  className="wizard-input"
                  placeholder="e.g. assets/icons/plate.svg"
                  value={svc.icon}
                  onChange={(e) => update(i, "icon", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="wizard-label">Description</label>
                <textarea
                  className="wizard-input min-h-[60px]"
                  placeholder="Briefly describe this service..."
                  value={svc.description}
                  onChange={(e) => update(i, "description", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
