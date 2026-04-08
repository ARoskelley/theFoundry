import type { SiteData } from "./types";

function esc(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function escJson(input: string): string {
  return input.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function processTemplate(
  template: string,
  site: SiteData,
  animationsEnabled = true
): string {
  const replacements: Record<string, string> = {
    "{{LANG}}": esc(site.meta.language),
    "{{SITE_NAME}}": esc(site.meta.siteName),
    "{{TAGLINE}}": esc(site.meta.tagline),
    "{{LOGO_MARK}}": buildLogoMark(site),
    "{{SEO_META}}": buildSeoMeta(site),
    "{{THEME_VARS}}": buildThemeVars(site),
    "{{ANIMATIONS_SCRIPT}}": animationsEnabled
      ? '<script src="animations.js" defer></script>'
      : "",
    "{{ANIMATIONS_CLASS}}": animationsEnabled ? "" : " no-motion",
    "{{HERO_SECTION}}": buildHero(site),
    "{{ABOUT_SECTION}}": buildAbout(site),
    "{{SERVICES_SECTION}}": buildServices(site),
    "{{TESTIMONIALS_SECTION}}": buildTestimonials(site),
    "{{CTA_SECTION}}": buildCta(site),
    "{{CONTACT_SECTION}}": buildContact(site),
    "{{LOCATIONS_SECTION}}": buildLocations(site),
    "{{SOCIAL_SECTION}}": buildSocialLinks(site),
    "{{RESTAURANT_MENU}}": buildRestaurantMenu(site),
    "{{RESTAURANT_GALLERY}}": buildRestaurantGallery(site),
    "{{RESTAURANT_RESERVATIONS}}": buildRestaurantReservations(site),
    "{{CONTRACTOR_BEFORE_AFTER}}": buildContractorBeforeAfter(site),
    "{{CONTRACTOR_PROCESS}}": buildContractorProcess(site),
    "{{CONTRACTOR_CERTIFICATIONS}}": buildContractorCertifications(site),
    "{{REALESTATE_LISTINGS}}": buildRealEstateListings(site),
    "{{REALESTATE_AGENTS}}": buildRealEstateAgents(site),
    "{{REALESTATE_NEIGHBORHOODS}}": buildRealEstateNeighborhoods(site),
    "{{SERVICE_PRICING}}": buildServicePricing(site),
    "{{SERVICE_FAQS}}": buildServiceFaqs(site),
    "{{SERVICE_COVERAGE}}": buildServiceCoverage(site),
    "{{YEAR}}": new Date().getFullYear().toString(),
  };

  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replaceAll(key, value);
  }
  return result;
}

function buildThemeVars(site: SiteData): string {
  const c = site.brand.colors;
  const f = site.brand.fonts;
  return `<style>
:root {
  --primary: ${esc(c.primary)};
  --secondary: ${esc(c.secondary)};
  --accent: ${esc(c.accent)};
  --bg: ${esc(c.background)};
  --text: ${esc(c.text)};
  --heading-font: ${esc(f.heading)};
  --body-font: ${esc(f.body)};
}
</style>`;
}

function buildSeoMeta(site: SiteData): string {
  const meta = site.meta;
  const lines: string[] = [];
  lines.push(`<title>${esc(meta.title)}</title>`);
  lines.push(
    `<meta name="description" content="${esc(meta.description)}" />`
  );

  if (meta.canonicalUrl)
    lines.push(`<link rel="canonical" href="${esc(meta.canonicalUrl)}" />`);
  if (meta.favicon)
    lines.push(`<link rel="icon" href="${esc(meta.favicon)}" />`);

  lines.push(
    `<meta property="og:title" content="${esc(meta.title)}" />`
  );
  lines.push(
    `<meta property="og:description" content="${esc(meta.description)}" />`
  );
  if (meta.ogImage)
    lines.push(
      `<meta property="og:image" content="${esc(meta.ogImage)}" />`
    );
  if (meta.canonicalUrl)
    lines.push(
      `<meta property="og:url" content="${esc(meta.canonicalUrl)}" />`
    );
  lines.push('<meta property="og:type" content="website" />');

  const jsonLd = buildJsonLd(site);
  if (jsonLd) {
    lines.push('<script type="application/ld+json">');
    lines.push(jsonLd);
    lines.push("</script>");
  }

  return lines.join("\n");
}

function buildJsonLd(site: SiteData): string {
  const name = site.meta.siteName;
  if (!name) return "";

  let type = "LocalBusiness";
  if (site.restaurant) type = "Restaurant";
  if (site.realEstate) type = "RealEstateAgent";

  let json = `{"@context":"https://schema.org","@type":"${type}","name":"${escJson(name)}"`;
  if (site.meta.canonicalUrl)
    json += `,"url":"${escJson(site.meta.canonicalUrl)}"`;
  if (site.contact.phone)
    json += `,"telephone":"${escJson(site.contact.phone)}"`;
  if (site.locations.length > 0)
    json += `,"address":"${escJson(site.locations[0].address)}"`;
  json += "}";
  return json;
}

function buildLogoMark(site: SiteData): string {
  if (site.brand.logo)
    return `<img src="${esc(site.brand.logo)}" alt="${esc(site.meta.siteName)} logo" />`;

  const initials = site.meta.siteName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return esc(initials);
}

function buildHero(site: SiteData): string {
  const hero = site.hero;
  if (!hero.headline && !hero.subheadline) return "";

  const image = hero.image
    ? `<img src="${esc(hero.image)}" alt="${esc(site.meta.siteName)} hero" loading="lazy" />`
    : "";

  const cta = hero.ctaText
    ? `<a class="btn primary" href="${esc(hero.ctaLink)}">${esc(hero.ctaText)}</a>`
    : "";

  return `
<section class="hero reveal">
  <div class="hero-content">
    <p class="eyebrow">${esc(site.meta.tagline)}</p>
    <h1>${esc(hero.headline)}</h1>
    <p class="lead">${esc(hero.subheadline)}</p>
    <div class="hero-actions">${cta}</div>
  </div>
  <div class="hero-media">${image}</div>
</section>`;
}

function buildAbout(site: SiteData): string {
  if (!site.about.title && !site.about.body) return "";

  const image = site.about.image
    ? `<img src="${esc(site.about.image)}" alt="About ${esc(site.meta.siteName)}" loading="lazy" />`
    : "";

  return `
<section class="about reveal">
  <div class="about-text">
    <h2>${esc(site.about.title)}</h2>
    <p>${esc(site.about.body)}</p>
  </div>
  <div class="about-media">${image}</div>
</section>`;
}

function buildServices(site: SiteData): string {
  if (site.services.length === 0) return "";

  const cards = site.services
    .map((svc) => {
      const icon = svc.icon
        ? `<img src="${esc(svc.icon)}" alt="" />`
        : "";
      return `    <div class="card">
      <div class="icon">${icon}</div>
      <h3>${esc(svc.title)}</h3>
      <p>${esc(svc.description)}</p>
    </div>`;
    })
    .join("\n");

  return `<section class="services reveal">
  <h2>Services</h2>
  <div class="cards">
${cards}
  </div>
</section>`;
}

function buildTestimonials(site: SiteData): string {
  if (site.testimonials.length === 0) return "";

  const cards = site.testimonials
    .map((t) => {
      const image = t.image
        ? `<img src="${esc(t.image)}" alt="${esc(t.name)}" loading="lazy" />`
        : "";
      return `    <blockquote class="card">
      <p>"${esc(t.quote)}"</p>
      <div class="person">
        ${image}
        <div><strong>${esc(t.name)}</strong><span>${esc(t.role)}</span></div>
      </div>
    </blockquote>`;
    })
    .join("\n");

  return `<section class="testimonials reveal">
  <h2>What people say</h2>
  <div class="cards">
${cards}
  </div>
</section>`;
}

function buildCta(site: SiteData): string {
  if (!site.cta.title) return "";
  const button = site.cta.buttonText
    ? `<a class="btn primary" href="${esc(site.cta.buttonLink)}">${esc(site.cta.buttonText)}</a>`
    : "";

  return `
<section class="cta reveal">
  <div class="cta-inner">
    <h2>${esc(site.cta.title)}</h2>
    <p>${esc(site.cta.body)}</p>
    ${button}
  </div>
</section>`;
}

function buildContact(site: SiteData): string {
  const c = site.contact;
  const map = c.mapEmbed ? `<div class="map">${c.mapEmbed}</div>` : "";

  return `
<section class="contact reveal" id="contact">
  <div class="contact-info">
    <h2>Contact</h2>
    <p class="contact-row"><strong>Phone</strong> ${esc(c.phone)}</p>
    <p class="contact-row"><strong>Email</strong> ${esc(c.email)}</p>
    <p class="contact-row"><strong>Address</strong> ${esc(c.address)}</p>
    <p class="contact-row"><strong>Hours</strong> ${esc(c.hours)}</p>
  </div>
  ${map}
</section>`;
}

function buildLocations(site: SiteData): string {
  if (site.locations.length === 0) return "";

  const cards = site.locations
    .map(
      (loc) => `    <div class="card">
      <h3>${esc(loc.label)}</h3>
      <p>${esc(loc.address)}</p>
      <p>${esc(loc.phone)}</p>
    </div>`
    )
    .join("\n");

  return `<section class="locations reveal">
  <h2>Locations</h2>
  <div class="cards">
${cards}
  </div>
</section>`;
}

function buildSocialLinks(site: SiteData): string {
  if (site.social.length === 0) return "";

  const links = site.social
    .map(
      (s) =>
        `  <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`
    )
    .join("\n");

  return `<div class="social">
${links}
</div>`;
}

// --- Restaurant ---

function buildRestaurantMenu(site: SiteData): string {
  const sections = site.restaurant?.menuSections;
  if (!sections || sections.length === 0) return "";

  const body = sections
    .map((section) => {
      const items = section.items
        .map(
          (item) => `      <li>
        <div class="menu-title"><strong>${esc(item.name)}</strong><span>${esc(item.price)}</span></div>
        <p>${esc(item.description)}</p>
      </li>`
        )
        .join("\n");
      return `  <div class="menu-section">
    <h3>${esc(section.title)}</h3>
    <ul>
${items}
    </ul>
  </div>`;
    })
    .join("\n");

  return `<section class="menu reveal" id="menu">
  <h2>Menu Highlights</h2>
${body}
</section>`;
}

function buildRestaurantGallery(site: SiteData): string {
  const gallery = site.restaurant?.gallery;
  if (!gallery || gallery.length === 0) return "";

  const imgs = gallery
    .map(
      (img) =>
        `    <img src="${esc(img.image)}" alt="${esc(img.alt)}" loading="lazy" />`
    )
    .join("\n");

  return `<section class="gallery reveal">
  <h2>Gallery</h2>
  <div class="grid">
${imgs}
  </div>
</section>`;
}

function buildRestaurantReservations(site: SiteData): string {
  const r = site.restaurant?.reservations;
  if (!r || !r.ctaText) return "";

  return `
<section class="reservations reveal" id="reservations">
  <h2>Reservations</h2>
  <p>Book your table in just a few clicks.</p>
  <a class="btn primary" href="${esc(r.ctaLink)}">${esc(r.ctaText)}</a>
</section>`;
}

// --- Contractor ---

function buildContractorBeforeAfter(site: SiteData): string {
  const ba = site.contractor?.beforeAfter;
  if (!ba || ba.length === 0) return "";

  const items = ba
    .map(
      (b) => `    <div class="ba-item">
      <img src="${esc(b.beforeImage)}" alt="Before" loading="lazy" />
      <img src="${esc(b.afterImage)}" alt="After" loading="lazy" />
      <p>${esc(b.caption)}</p>
    </div>`
    )
    .join("\n");

  return `<section class="before-after reveal" id="work">
  <h2>Before &amp; After</h2>
  <div class="ba-grid">
${items}
  </div>
</section>`;
}

function buildContractorProcess(site: SiteData): string {
  const process = site.contractor?.process;
  if (!process || process.length === 0) return "";

  const steps = process
    .map(
      (s) => `    <li>
      <strong>${esc(s.step)}</strong>
      <p>${esc(s.detail)}</p>
    </li>`
    )
    .join("\n");

  return `<section class="process reveal" id="process">
  <h2>Our Process</h2>
  <ol>
${steps}
  </ol>
</section>`;
}

function buildContractorCertifications(site: SiteData): string {
  const certs = site.contractor?.certifications;
  if (!certs || certs.length === 0) return "";

  const items = certs
    .map(
      (c) =>
        `    <li><strong>${esc(c.name)}</strong> - ${esc(c.issuer)} (${esc(c.year)})</li>`
    )
    .join("\n");

  return `<section class="certifications reveal">
  <h2>Certifications</h2>
  <ul>
${items}
  </ul>
</section>`;
}

// --- Real Estate ---

function buildRealEstateListings(site: SiteData): string {
  const listings = site.realEstate?.featuredListings;
  if (!listings || listings.length === 0) return "";

  const cards = listings
    .map(
      (l) => `    <div class="card listing">
      <img src="${esc(l.image)}" alt="${esc(l.title)}" loading="lazy" />
      <h3>${esc(l.title)}</h3>
      <p class="price">${esc(l.price)}</p>
      <p>${esc(l.address)}</p>
      <p class="meta">${esc(l.beds)} bd | ${esc(l.baths)} ba | ${esc(l.sqft)} sqft</p>
    </div>`
    )
    .join("\n");

  return `<section class="listings reveal" id="listings">
  <h2>Featured Listings</h2>
  <div class="cards">
${cards}
  </div>
</section>`;
}

function buildRealEstateAgents(site: SiteData): string {
  const agents = site.realEstate?.agents;
  if (!agents || agents.length === 0) return "";

  const cards = agents
    .map(
      (a) => `    <div class="card agent">
      <img src="${esc(a.image)}" alt="${esc(a.name)}" loading="lazy" />
      <h3>${esc(a.name)}</h3>
      <p>${esc(a.role)}</p>
      <p>${esc(a.phone)}</p>
      <p>${esc(a.email)}</p>
    </div>`
    )
    .join("\n");

  return `<section class="agents reveal" id="agents">
  <h2>Meet the Team</h2>
  <div class="cards">
${cards}
  </div>
</section>`;
}

function buildRealEstateNeighborhoods(site: SiteData): string {
  const neighborhoods = site.realEstate?.neighborhoods;
  if (!neighborhoods || neighborhoods.length === 0) return "";

  const cards = neighborhoods
    .map(
      (n) => `    <div class="card">
      <h3>${esc(n.name)}</h3>
      <p>${esc(n.summary)}</p>
    </div>`
    )
    .join("\n");

  return `<section class="neighborhoods reveal">
  <h2>Neighborhoods</h2>
  <div class="cards">
${cards}
  </div>
</section>`;
}

// --- Service Business ---

function buildServicePricing(site: SiteData): string {
  const pricing = site.service?.pricing;
  if (!pricing || pricing.length === 0) return "";

  const cards = pricing
    .map((p) => {
      const features = p.features
        .map((f) => `        <li>${esc(f)}</li>`)
        .join("\n");
      return `    <div class="card plan">
      <h3>${esc(p.name)}</h3>
      <p class="price">${esc(p.price)}</p>
      <ul>
${features}
      </ul>
    </div>`;
    })
    .join("\n");

  return `<section class="pricing reveal" id="pricing">
  <h2>Pricing</h2>
  <div class="cards">
${cards}
  </div>
</section>`;
}

function buildServiceFaqs(site: SiteData): string {
  const faqs = site.service?.faqs;
  if (!faqs || faqs.length === 0) return "";

  const items = faqs
    .map(
      (f) => `    <details>
      <summary>${esc(f.question)}</summary>
      <p>${esc(f.answer)}</p>
    </details>`
    )
    .join("\n");

  return `<section class="faqs reveal" id="faqs">
  <h2>FAQs</h2>
  <div class="faq-list">
${items}
  </div>
</section>`;
}

function buildServiceCoverage(site: SiteData): string {
  if (!site.service) return "";
  const areas = site.service.coverage.areas.map(esc).join(", ");
  if (!areas && !site.service.coverage.notes) return "";

  return `
<section class="coverage reveal">
  <h2>Coverage Area</h2>
  <p>${areas}</p>
  <p>${esc(site.service.coverage.notes)}</p>
</section>`;
}
