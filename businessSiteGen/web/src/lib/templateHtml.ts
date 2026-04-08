// Template HTML strings with <base> tags so CSS/JS/assets resolve from public/templates/
// These are the raw templates from TemplateFiles/ with link/script paths intact.

export const templateHtml: Record<string, string> = {
  restaurant: `<!doctype html>
<html lang="{{LANG}}">
  <head>
    <meta charset="utf-8" />
    <base href="/templates/Restaurant/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {{SEO_META}}
    {{THEME_VARS}}
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body class="template-restaurant{{ANIMATIONS_CLASS}}">
    <header class="site-header">
      <div class="brand">
        <span class="brand-mark">{{LOGO_MARK}}</span>
        <div>
          <div class="brand-name">{{SITE_NAME}}</div>
          <div class="brand-tagline">{{TAGLINE}}</div>
        </div>
      </div>
      <nav class="nav">
        <a href="#menu">Menu</a>
        <a href="#reservations">Reservations</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main>
      <div class="hero-frame">
        {{HERO_SECTION}}
      </div>
      {{ABOUT_SECTION}}
      {{RESTAURANT_MENU}}
      {{RESTAURANT_GALLERY}}
      {{RESTAURANT_RESERVATIONS}}
      {{SERVICES_SECTION}}
      {{TESTIMONIALS_SECTION}}
      {{CTA_SECTION}}
      {{CONTACT_SECTION}}
      {{LOCATIONS_SECTION}}
    </main>
    <footer class="site-footer">
      {{SOCIAL_SECTION}}
      <p>&copy; {{YEAR}} {{SITE_NAME}}. All rights reserved.</p>
    </footer>
    <script src="theme.js" defer></script>
  </body>
</html>`,

  contractor: `<!doctype html>
<html lang="{{LANG}}">
  <head>
    <meta charset="utf-8" />
    <base href="/templates/Contractor/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {{SEO_META}}
    {{THEME_VARS}}
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body class="template-contractor{{ANIMATIONS_CLASS}}">
    <header class="site-header">
      <div class="brand">
        <span class="brand-mark">{{LOGO_MARK}}</span>
        <div>
          <div class="brand-name">{{SITE_NAME}}</div>
          <div class="brand-tagline">{{TAGLINE}}</div>
        </div>
      </div>
      <nav class="nav">
        <a href="#work">Work</a>
        <a href="#process">Process</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main>
      <div class="hero-block">
        {{HERO_SECTION}}
      </div>
      {{ABOUT_SECTION}}
      {{CONTRACTOR_BEFORE_AFTER}}
      {{CONTRACTOR_PROCESS}}
      {{SERVICES_SECTION}}
      {{CONTRACTOR_CERTIFICATIONS}}
      {{TESTIMONIALS_SECTION}}
      {{CTA_SECTION}}
      {{CONTACT_SECTION}}
      {{LOCATIONS_SECTION}}
    </main>
    <footer class="site-footer">
      {{SOCIAL_SECTION}}
      <p>&copy; {{YEAR}} {{SITE_NAME}}. All rights reserved.</p>
    </footer>
    <script src="theme.js" defer></script>
  </body>
</html>`,

  realestate: `<!doctype html>
<html lang="{{LANG}}">
  <head>
    <meta charset="utf-8" />
    <base href="/templates/RealEstate/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {{SEO_META}}
    {{THEME_VARS}}
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body class="template-realestate{{ANIMATIONS_CLASS}}">
    <header class="site-header">
      <div class="brand">
        <div class="brand-name">{{SITE_NAME}}</div>
        <div class="brand-tagline">{{TAGLINE}}</div>
      </div>
      <nav class="nav">
        <a href="#listings">Listings</a>
        <a href="#agents">Agents</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main>
      <div class="hero-shell">
        {{HERO_SECTION}}
      </div>
      {{ABOUT_SECTION}}
      {{REALESTATE_LISTINGS}}
      {{REALESTATE_NEIGHBORHOODS}}
      {{REALESTATE_AGENTS}}
      {{SERVICES_SECTION}}
      {{TESTIMONIALS_SECTION}}
      {{CTA_SECTION}}
      {{CONTACT_SECTION}}
      {{LOCATIONS_SECTION}}
    </main>
    <footer class="site-footer">
      {{SOCIAL_SECTION}}
      <p>&copy; {{YEAR}} {{SITE_NAME}}. All rights reserved.</p>
    </footer>
    <script src="theme.js" defer></script>
  </body>
</html>`,

  service: `<!doctype html>
<html lang="{{LANG}}">
  <head>
    <meta charset="utf-8" />
    <base href="/templates/Service/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {{SEO_META}}
    {{THEME_VARS}}
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body class="template-service{{ANIMATIONS_CLASS}}">
    <header class="site-header">
      <div class="brand">
        <span class="brand-mark">{{LOGO_MARK}}</span>
        <div>
          <div class="brand-name">{{SITE_NAME}}</div>
          <div class="brand-tagline">{{TAGLINE}}</div>
        </div>
      </div>
      <nav class="nav">
        <a href="#pricing">Pricing</a>
        <a href="#faqs">FAQs</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main>
      <div class="hero-panel">
        {{HERO_SECTION}}
      </div>
      {{ABOUT_SECTION}}
      {{SERVICES_SECTION}}
      {{SERVICE_PRICING}}
      {{SERVICE_FAQS}}
      {{SERVICE_COVERAGE}}
      {{TESTIMONIALS_SECTION}}
      {{CTA_SECTION}}
      {{CONTACT_SECTION}}
      {{LOCATIONS_SECTION}}
    </main>
    <footer class="site-footer">
      {{SOCIAL_SECTION}}
      <p>&copy; {{YEAR}} {{SITE_NAME}}. All rights reserved.</p>
    </footer>
    <script src="theme.js" defer></script>
  </body>
</html>`,
};
