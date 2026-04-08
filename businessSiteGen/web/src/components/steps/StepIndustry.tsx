"use client";

import { useWizard } from "@/lib/store";
import type {
  MenuItem,
  MenuSection,
  ImageItem,
  BeforeAfter,
  ProcessStep,
  Certification,
  Listing,
  Agent,
  Neighborhood,
  PricingPlan,
  FaqItem,
} from "@/lib/types";

// ──────────────────────────────────────────────
// Restaurant sub-form
// ──────────────────────────────────────────────
function RestaurantFields() {
  const { state, dispatch } = useWizard();
  const restaurant = state.siteData.restaurant!;

  const setField = (path: string, value: unknown) =>
    dispatch({ type: "SET_FIELD", path, value });

  // Menu sections
  const addSection = () =>
    dispatch({
      type: "ADD_LIST_ITEM",
      path: "restaurant.menuSections",
      item: { title: "", items: [] } as MenuSection,
    });

  const removeSection = (i: number) =>
    dispatch({ type: "REMOVE_LIST_ITEM", path: "restaurant.menuSections", index: i });

  const updateSection = (i: number, field: string, value: unknown) =>
    dispatch({
      type: "UPDATE_LIST_ITEM",
      path: "restaurant.menuSections",
      index: i,
      value: { ...restaurant.menuSections[i], [field]: value },
    });

  const addMenuItem = (sectionIdx: number) => {
    const section = { ...restaurant.menuSections[sectionIdx] };
    section.items = [...section.items, { name: "", description: "", price: "" }];
    updateSection(sectionIdx, "items", section.items);
  };

  const updateMenuItem = (sIdx: number, iIdx: number, field: keyof MenuItem, val: string) => {
    const section = { ...restaurant.menuSections[sIdx] };
    const items = [...section.items];
    items[iIdx] = { ...items[iIdx], [field]: val };
    updateSection(sIdx, "items", items);
  };

  const removeMenuItem = (sIdx: number, iIdx: number) => {
    const section = { ...restaurant.menuSections[sIdx] };
    const items = [...section.items];
    items.splice(iIdx, 1);
    updateSection(sIdx, "items", items);
  };

  // Gallery
  const addGallery = () =>
    dispatch({
      type: "ADD_LIST_ITEM",
      path: "restaurant.gallery",
      item: { image: "", alt: "" } as ImageItem,
    });

  const removeGallery = (i: number) =>
    dispatch({ type: "REMOVE_LIST_ITEM", path: "restaurant.gallery", index: i });

  const updateGallery = (i: number, field: keyof ImageItem, value: string) =>
    dispatch({
      type: "UPDATE_LIST_ITEM",
      path: "restaurant.gallery",
      index: i,
      value: { ...restaurant.gallery[i], [field]: value },
    });

  return (
    <div className="space-y-6">
      {/* Reservations */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Reservations</h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="wizard-label">Button Text</label>
            <input
              className="wizard-input"
              placeholder="e.g. Reserve a Table"
              value={restaurant.reservations?.ctaText || ""}
              onChange={(e) => setField("restaurant.reservations", { ...restaurant.reservations, ctaText: e.target.value, ctaLink: restaurant.reservations?.ctaLink || "" })}
            />
          </div>
          <div>
            <label className="wizard-label">Button Link</label>
            <input
              className="wizard-input"
              placeholder="e.g. https://resy.com/yourplace"
              value={restaurant.reservations?.ctaLink || ""}
              onChange={(e) => setField("restaurant.reservations", { ...restaurant.reservations, ctaText: restaurant.reservations?.ctaText || "", ctaLink: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Menu */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Menu Sections</h3>
          <button type="button" onClick={addSection} className="btn-primary text-xs">+ Section</button>
        </div>
        <div className="mt-3 space-y-4">
          {restaurant.menuSections.map((section, sIdx) => (
            <div key={sIdx} className="wizard-card relative">
              <button type="button" onClick={() => removeSection(sIdx)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg leading-none">&times;</button>
              <input
                className="wizard-input mb-3 font-medium"
                placeholder="Section name (e.g. Starters)"
                value={section.title}
                onChange={(e) => updateSection(sIdx, "title", e.target.value)}
              />
              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="ml-2 mb-2 grid grid-cols-[1fr_1fr_80px_24px] gap-2 items-end">
                  <input className="wizard-input text-xs" placeholder="Name" value={item.name} onChange={(e) => updateMenuItem(sIdx, iIdx, "name", e.target.value)} />
                  <input className="wizard-input text-xs" placeholder="Description" value={item.description} onChange={(e) => updateMenuItem(sIdx, iIdx, "description", e.target.value)} />
                  <input className="wizard-input text-xs" placeholder="$0" value={item.price} onChange={(e) => updateMenuItem(sIdx, iIdx, "price", e.target.value)} />
                  <button type="button" onClick={() => removeMenuItem(sIdx, iIdx)} className="text-gray-400 hover:text-red-500 text-sm">&times;</button>
                </div>
              ))}
              <button type="button" onClick={() => addMenuItem(sIdx)} className="mt-1 text-xs text-brand-600 hover:underline">+ Add item</button>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Gallery</h3>
          <button type="button" onClick={addGallery} className="btn-primary text-xs">+ Image</button>
        </div>
        <div className="mt-3 space-y-2">
          {restaurant.gallery.map((img, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_24px] gap-2 items-end">
              <input className="wizard-input text-xs" placeholder="Image URL" value={img.image} onChange={(e) => updateGallery(i, "image", e.target.value)} />
              <input className="wizard-input text-xs" placeholder="Alt text" value={img.alt} onChange={(e) => updateGallery(i, "alt", e.target.value)} />
              <button type="button" onClick={() => removeGallery(i)} className="text-gray-400 hover:text-red-500 text-sm">&times;</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Contractor sub-form
// ──────────────────────────────────────────────
function ContractorFields() {
  const { state, dispatch } = useWizard();
  const contractor = state.siteData.contractor!;

  const addBA = () => dispatch({ type: "ADD_LIST_ITEM", path: "contractor.beforeAfter", item: { beforeImage: "", afterImage: "", caption: "" } as BeforeAfter });
  const removeBA = (i: number) => dispatch({ type: "REMOVE_LIST_ITEM", path: "contractor.beforeAfter", index: i });
  const updateBA = (i: number, field: keyof BeforeAfter, val: string) => dispatch({ type: "UPDATE_LIST_ITEM", path: "contractor.beforeAfter", index: i, value: { ...contractor.beforeAfter[i], [field]: val } });

  const addStep = () => dispatch({ type: "ADD_LIST_ITEM", path: "contractor.process", item: { step: "", detail: "" } as ProcessStep });
  const removeStep = (i: number) => dispatch({ type: "REMOVE_LIST_ITEM", path: "contractor.process", index: i });
  const updateStep = (i: number, field: keyof ProcessStep, val: string) => dispatch({ type: "UPDATE_LIST_ITEM", path: "contractor.process", index: i, value: { ...contractor.process[i], [field]: val } });

  const addCert = () => dispatch({ type: "ADD_LIST_ITEM", path: "contractor.certifications", item: { name: "", issuer: "", year: "" } as Certification });
  const removeCert = (i: number) => dispatch({ type: "REMOVE_LIST_ITEM", path: "contractor.certifications", index: i });
  const updateCert = (i: number, field: keyof Certification, val: string) => dispatch({ type: "UPDATE_LIST_ITEM", path: "contractor.certifications", index: i, value: { ...contractor.certifications[i], [field]: val } });

  return (
    <div className="space-y-6">
      {/* Before / After */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Before & After</h3>
          <button type="button" onClick={addBA} className="btn-primary text-xs">+ Add</button>
        </div>
        <div className="mt-3 space-y-3">
          {contractor.beforeAfter.map((ba, i) => (
            <div key={i} className="wizard-card relative">
              <button type="button" onClick={() => removeBA(i)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg leading-none">&times;</button>
              <div className="grid gap-2 sm:grid-cols-2 pr-6">
                <input className="wizard-input text-xs" placeholder="Before image URL" value={ba.beforeImage} onChange={(e) => updateBA(i, "beforeImage", e.target.value)} />
                <input className="wizard-input text-xs" placeholder="After image URL" value={ba.afterImage} onChange={(e) => updateBA(i, "afterImage", e.target.value)} />
                <input className="wizard-input text-xs sm:col-span-2" placeholder="Caption" value={ba.caption} onChange={(e) => updateBA(i, "caption", e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Process Steps</h3>
          <button type="button" onClick={addStep} className="btn-primary text-xs">+ Step</button>
        </div>
        <div className="mt-3 space-y-2">
          {contractor.process.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_24px] gap-2 items-end">
              <input className="wizard-input text-xs" placeholder="Step name" value={s.step} onChange={(e) => updateStep(i, "step", e.target.value)} />
              <input className="wizard-input text-xs" placeholder="Detail" value={s.detail} onChange={(e) => updateStep(i, "detail", e.target.value)} />
              <button type="button" onClick={() => removeStep(i)} className="text-gray-400 hover:text-red-500 text-sm">&times;</button>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Certifications</h3>
          <button type="button" onClick={addCert} className="btn-primary text-xs">+ Cert</button>
        </div>
        <div className="mt-3 space-y-2">
          {contractor.certifications.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_80px_24px] gap-2 items-end">
              <input className="wizard-input text-xs" placeholder="Name" value={c.name} onChange={(e) => updateCert(i, "name", e.target.value)} />
              <input className="wizard-input text-xs" placeholder="Issuer" value={c.issuer} onChange={(e) => updateCert(i, "issuer", e.target.value)} />
              <input className="wizard-input text-xs" placeholder="Year" value={c.year} onChange={(e) => updateCert(i, "year", e.target.value)} />
              <button type="button" onClick={() => removeCert(i)} className="text-gray-400 hover:text-red-500 text-sm">&times;</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Real Estate sub-form
// ──────────────────────────────────────────────
function RealEstateFields() {
  const { state, dispatch } = useWizard();
  const re = state.siteData.realEstate!;

  const addListing = () => dispatch({ type: "ADD_LIST_ITEM", path: "realEstate.featuredListings", item: { title: "", price: "", address: "", beds: "", baths: "", sqft: "", image: "" } as Listing });
  const removeListing = (i: number) => dispatch({ type: "REMOVE_LIST_ITEM", path: "realEstate.featuredListings", index: i });
  const updateListing = (i: number, field: keyof Listing, val: string) => dispatch({ type: "UPDATE_LIST_ITEM", path: "realEstate.featuredListings", index: i, value: { ...re.featuredListings[i], [field]: val } });

  const addAgent = () => dispatch({ type: "ADD_LIST_ITEM", path: "realEstate.agents", item: { name: "", role: "", phone: "", email: "", image: "" } as Agent });
  const removeAgent = (i: number) => dispatch({ type: "REMOVE_LIST_ITEM", path: "realEstate.agents", index: i });
  const updateAgent = (i: number, field: keyof Agent, val: string) => dispatch({ type: "UPDATE_LIST_ITEM", path: "realEstate.agents", index: i, value: { ...re.agents[i], [field]: val } });

  const addNeighborhood = () => dispatch({ type: "ADD_LIST_ITEM", path: "realEstate.neighborhoods", item: { name: "", summary: "" } as Neighborhood });
  const removeNeighborhood = (i: number) => dispatch({ type: "REMOVE_LIST_ITEM", path: "realEstate.neighborhoods", index: i });
  const updateNeighborhood = (i: number, field: keyof Neighborhood, val: string) => dispatch({ type: "UPDATE_LIST_ITEM", path: "realEstate.neighborhoods", index: i, value: { ...re.neighborhoods[i], [field]: val } });

  return (
    <div className="space-y-6">
      {/* Listings */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Featured Listings</h3>
          <button type="button" onClick={addListing} className="btn-primary text-xs">+ Listing</button>
        </div>
        <div className="mt-3 space-y-3">
          {re.featuredListings.map((l, i) => (
            <div key={i} className="wizard-card relative">
              <button type="button" onClick={() => removeListing(i)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg leading-none">&times;</button>
              <div className="grid gap-2 sm:grid-cols-3 pr-6">
                <input className="wizard-input text-xs sm:col-span-2" placeholder="Title" value={l.title} onChange={(e) => updateListing(i, "title", e.target.value)} />
                <input className="wizard-input text-xs" placeholder="Price" value={l.price} onChange={(e) => updateListing(i, "price", e.target.value)} />
                <input className="wizard-input text-xs sm:col-span-2" placeholder="Address" value={l.address} onChange={(e) => updateListing(i, "address", e.target.value)} />
                <input className="wizard-input text-xs" placeholder="Image URL" value={l.image} onChange={(e) => updateListing(i, "image", e.target.value)} />
                <input className="wizard-input text-xs" placeholder="Beds" value={l.beds} onChange={(e) => updateListing(i, "beds", e.target.value)} />
                <input className="wizard-input text-xs" placeholder="Baths" value={l.baths} onChange={(e) => updateListing(i, "baths", e.target.value)} />
                <input className="wizard-input text-xs" placeholder="Sqft" value={l.sqft} onChange={(e) => updateListing(i, "sqft", e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agents */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Agents</h3>
          <button type="button" onClick={addAgent} className="btn-primary text-xs">+ Agent</button>
        </div>
        <div className="mt-3 space-y-2">
          {re.agents.map((a, i) => (
            <div key={i} className="wizard-card relative">
              <button type="button" onClick={() => removeAgent(i)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg leading-none">&times;</button>
              <div className="grid gap-2 sm:grid-cols-2 pr-6">
                <input className="wizard-input text-xs" placeholder="Name" value={a.name} onChange={(e) => updateAgent(i, "name", e.target.value)} />
                <input className="wizard-input text-xs" placeholder="Role" value={a.role} onChange={(e) => updateAgent(i, "role", e.target.value)} />
                <input className="wizard-input text-xs" placeholder="Phone" value={a.phone} onChange={(e) => updateAgent(i, "phone", e.target.value)} />
                <input className="wizard-input text-xs" placeholder="Email" value={a.email} onChange={(e) => updateAgent(i, "email", e.target.value)} />
                <input className="wizard-input text-xs sm:col-span-2" placeholder="Image URL" value={a.image} onChange={(e) => updateAgent(i, "image", e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Neighborhoods */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Neighborhoods</h3>
          <button type="button" onClick={addNeighborhood} className="btn-primary text-xs">+ Area</button>
        </div>
        <div className="mt-3 space-y-2">
          {re.neighborhoods.map((n, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_24px] gap-2 items-end">
              <input className="wizard-input text-xs" placeholder="Name" value={n.name} onChange={(e) => updateNeighborhood(i, "name", e.target.value)} />
              <input className="wizard-input text-xs" placeholder="Summary" value={n.summary} onChange={(e) => updateNeighborhood(i, "summary", e.target.value)} />
              <button type="button" onClick={() => removeNeighborhood(i)} className="text-gray-400 hover:text-red-500 text-sm">&times;</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Service Business sub-form
// ──────────────────────────────────────────────
function ServiceFields() {
  const { state, dispatch } = useWizard();
  const svc = state.siteData.service!;

  // Pricing
  const addPlan = () => dispatch({ type: "ADD_LIST_ITEM", path: "service.pricing", item: { name: "", price: "", features: [] } as PricingPlan });
  const removePlan = (i: number) => dispatch({ type: "REMOVE_LIST_ITEM", path: "service.pricing", index: i });
  const updatePlan = (i: number, field: string, val: unknown) => dispatch({ type: "UPDATE_LIST_ITEM", path: "service.pricing", index: i, value: { ...svc.pricing[i], [field]: val } });

  // FAQs
  const addFaq = () => dispatch({ type: "ADD_LIST_ITEM", path: "service.faqs", item: { question: "", answer: "" } as FaqItem });
  const removeFaq = (i: number) => dispatch({ type: "REMOVE_LIST_ITEM", path: "service.faqs", index: i });
  const updateFaq = (i: number, field: keyof FaqItem, val: string) => dispatch({ type: "UPDATE_LIST_ITEM", path: "service.faqs", index: i, value: { ...svc.faqs[i], [field]: val } });

  const setField = (path: string, value: unknown) => dispatch({ type: "SET_FIELD", path, value });

  return (
    <div className="space-y-6">
      {/* Pricing */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Pricing Plans</h3>
          <button type="button" onClick={addPlan} className="btn-primary text-xs">+ Plan</button>
        </div>
        <div className="mt-3 space-y-3">
          {svc.pricing.map((plan, i) => (
            <div key={i} className="wizard-card relative">
              <button type="button" onClick={() => removePlan(i)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg leading-none">&times;</button>
              <div className="grid gap-2 sm:grid-cols-2 pr-6">
                <input className="wizard-input text-xs" placeholder="Plan name" value={plan.name} onChange={(e) => updatePlan(i, "name", e.target.value)} />
                <input className="wizard-input text-xs" placeholder="Price" value={plan.price} onChange={(e) => updatePlan(i, "price", e.target.value)} />
                <div className="sm:col-span-2">
                  <label className="wizard-label text-xs">Features (one per line)</label>
                  <textarea
                    className="wizard-input text-xs min-h-[60px]"
                    placeholder={"24/7 support\nFree estimates\nLicensed & insured"}
                    value={plan.features.join("\n")}
                    onChange={(e) => updatePlan(i, "features", e.target.value.split("\n"))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">FAQs</h3>
          <button type="button" onClick={addFaq} className="btn-primary text-xs">+ FAQ</button>
        </div>
        <div className="mt-3 space-y-2">
          {svc.faqs.map((faq, i) => (
            <div key={i} className="wizard-card relative">
              <button type="button" onClick={() => removeFaq(i)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg leading-none">&times;</button>
              <div className="grid gap-2 pr-6">
                <input className="wizard-input text-xs" placeholder="Question" value={faq.question} onChange={(e) => updateFaq(i, "question", e.target.value)} />
                <textarea className="wizard-input text-xs min-h-[50px]" placeholder="Answer" value={faq.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Coverage Area</h3>
        <div className="mt-2 grid gap-3">
          <div>
            <label className="wizard-label text-xs">Areas (comma-separated)</label>
            <input
              className="wizard-input text-xs"
              placeholder="e.g. Portland, Beaverton, Lake Oswego"
              value={svc.coverage.areas.join(", ")}
              onChange={(e) => setField("service.coverage.areas", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            />
          </div>
          <div>
            <label className="wizard-label text-xs">Notes</label>
            <input
              className="wizard-input text-xs"
              placeholder="e.g. We serve the greater Portland metro area"
              value={svc.coverage.notes}
              onChange={(e) => setField("service.coverage.notes", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main industry step
// ──────────────────────────────────────────────
export default function StepIndustry() {
  const { state } = useWizard();

  const labels: Record<string, string> = {
    restaurant: "Restaurant Details",
    contractor: "Contractor Details",
    realEstate: "Real Estate Details",
    service: "Service Business Details",
  };

  if (!state.industryType) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Go back to Step 1 and select an industry type first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {labels[state.industryType]}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Fill in industry-specific details for your site.
        </p>
      </div>

      {state.industryType === "restaurant" && <RestaurantFields />}
      {state.industryType === "contractor" && <ContractorFields />}
      {state.industryType === "realEstate" && <RealEstateFields />}
      {state.industryType === "service" && <ServiceFields />}
    </div>
  );
}
