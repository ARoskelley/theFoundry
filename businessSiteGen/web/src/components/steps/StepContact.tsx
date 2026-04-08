"use client";

import { useWizard } from "@/lib/store";
import type { Location } from "@/lib/types";

export default function StepContact() {
  const { state, dispatch } = useWizard();
  const { contact, locations } = state.siteData;

  const setField = (path: string, value: string) =>
    dispatch({ type: "SET_FIELD", path, value });

  const addLocation = () =>
    dispatch({
      type: "ADD_LIST_ITEM",
      path: "locations",
      item: { label: "", address: "", phone: "" } as Location,
    });

  const removeLocation = (i: number) =>
    dispatch({ type: "REMOVE_LIST_ITEM", path: "locations", index: i });

  const updateLocation = (i: number, field: keyof Location, value: string) =>
    dispatch({
      type: "UPDATE_LIST_ITEM",
      path: "locations",
      index: i,
      value: { ...locations[i], [field]: value },
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Contact & Locations</h2>
        <p className="mt-1 text-sm text-gray-500">
          How can customers reach you?
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="wizard-label">Phone</label>
          <input
            className="wizard-input"
            placeholder="(555) 555-1234"
            value={contact.phone}
            onChange={(e) => setField("contact.phone", e.target.value)}
          />
        </div>
        <div>
          <label className="wizard-label">Email</label>
          <input
            className="wizard-input"
            placeholder="hello@yourbiz.com"
            value={contact.email}
            onChange={(e) => setField("contact.email", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="wizard-label">Address</label>
          <input
            className="wizard-input"
            placeholder="123 Main St, City, ST"
            value={contact.address}
            onChange={(e) => setField("contact.address", e.target.value)}
          />
        </div>
        <div>
          <label className="wizard-label">Hours</label>
          <input
            className="wizard-input"
            placeholder="e.g. Mon-Fri 9am-5pm"
            value={contact.hours}
            onChange={(e) => setField("contact.hours", e.target.value)}
          />
        </div>
        <div>
          <label className="wizard-label">Map Embed HTML</label>
          <input
            className="wizard-input"
            placeholder='<iframe src="https://maps.google.com/..." />'
            value={contact.mapEmbed}
            onChange={(e) => setField("contact.mapEmbed", e.target.value)}
          />
        </div>
      </div>

      {/* Locations */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Additional Locations
          </h3>
          <button type="button" onClick={addLocation} className="btn-primary text-xs">
            + Location
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {locations.map((loc, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_1fr_24px] gap-2 items-end">
              <input className="wizard-input text-xs" placeholder="Label" value={loc.label} onChange={(e) => updateLocation(i, "label", e.target.value)} />
              <input className="wizard-input text-xs" placeholder="Address" value={loc.address} onChange={(e) => updateLocation(i, "address", e.target.value)} />
              <input className="wizard-input text-xs" placeholder="Phone" value={loc.phone} onChange={(e) => updateLocation(i, "phone", e.target.value)} />
              <button type="button" onClick={() => removeLocation(i)} className="text-gray-400 hover:text-red-500 text-sm">&times;</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
