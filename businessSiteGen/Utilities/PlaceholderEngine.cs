using System.Net;
using System.Text;

namespace BusinessSiteGenerator.Utilities;

public class PlaceholderEngine
{
    public string Process(string template, SiteData site, bool animationsEnabled)
    {
        var replacements = new Dictionary<string, string>
        {
            ["{{LANG}}"] = Escape(site.Meta.Language),
            ["{{SITE_NAME}}"] = Escape(site.Meta.SiteName),
            ["{{TAGLINE}}"] = Escape(site.Meta.Tagline),
            ["{{LOGO_MARK}}"] = BuildLogoMark(site),
            ["{{SEO_META}}"] = BuildSeoMeta(site),
            ["{{THEME_VARS}}"] = BuildThemeVars(site),
            ["{{ANIMATIONS_SCRIPT}}"] = animationsEnabled ? "<script src=\"animations.js\" defer></script>" : "",
            ["{{ANIMATIONS_CLASS}}"] = animationsEnabled ? "" : " no-motion",
            ["{{HERO_SECTION}}"] = BuildHero(site),
            ["{{ABOUT_SECTION}}"] = BuildAbout(site),
            ["{{SERVICES_SECTION}}"] = BuildServices(site),
            ["{{TESTIMONIALS_SECTION}}"] = BuildTestimonials(site),
            ["{{CTA_SECTION}}"] = BuildCta(site),
            ["{{CONTACT_SECTION}}"] = BuildContact(site),
            ["{{LOCATIONS_SECTION}}"] = BuildLocations(site),
            ["{{SOCIAL_SECTION}}"] = BuildSocialLinks(site),
            ["{{RESTAURANT_MENU}}"] = BuildRestaurantMenu(site),
            ["{{RESTAURANT_GALLERY}}"] = BuildRestaurantGallery(site),
            ["{{RESTAURANT_RESERVATIONS}}"] = BuildRestaurantReservations(site),
            ["{{CONTRACTOR_BEFORE_AFTER}}"] = BuildContractorBeforeAfter(site),
            ["{{CONTRACTOR_PROCESS}}"] = BuildContractorProcess(site),
            ["{{CONTRACTOR_CERTIFICATIONS}}"] = BuildContractorCertifications(site),
            ["{{REALESTATE_LISTINGS}}"] = BuildRealEstateListings(site),
            ["{{REALESTATE_AGENTS}}"] = BuildRealEstateAgents(site),
            ["{{REALESTATE_NEIGHBORHOODS}}"] = BuildRealEstateNeighborhoods(site),
            ["{{SERVICE_PRICING}}"] = BuildServicePricing(site),
            ["{{SERVICE_FAQS}}"] = BuildServiceFaqs(site),
            ["{{SERVICE_COVERAGE}}"] = BuildServiceCoverage(site),
            ["{{YEAR}}"] = DateTime.Now.Year.ToString()
        };

        var result = template;
        foreach (var (key, value) in replacements)
        {
            result = result.Replace(key, value);
        }

        return result;
    }

    private static string BuildThemeVars(SiteData site)
    {
        var c = site.Brand.Colors;
        var f = site.Brand.Fonts;
        return $@"<style>
:root {{
  --primary: {Escape(c.Primary)};
  --secondary: {Escape(c.Secondary)};
  --accent: {Escape(c.Accent)};
  --bg: {Escape(c.Background)};
  --text: {Escape(c.Text)};
  --heading-font: {Escape(f.Heading)};
  --body-font: {Escape(f.Body)};
}}
</style>";
    }

    private static string BuildSeoMeta(SiteData site)
    {
        var meta = site.Meta;
        var sb = new StringBuilder();
        sb.AppendLine($"<title>{Escape(meta.Title)}</title>");
        sb.AppendLine($"<meta name=\"description\" content=\"{Escape(meta.Description)}\" />");

        if (!string.IsNullOrWhiteSpace(meta.CanonicalUrl))
            sb.AppendLine($"<link rel=\"canonical\" href=\"{Escape(meta.CanonicalUrl)}\" />");

        if (!string.IsNullOrWhiteSpace(meta.Favicon))
            sb.AppendLine($"<link rel=\"icon\" href=\"{Escape(meta.Favicon)}\" />");

        sb.AppendLine($"<meta property=\"og:title\" content=\"{Escape(meta.Title)}\" />");
        sb.AppendLine($"<meta property=\"og:description\" content=\"{Escape(meta.Description)}\" />");
        if (!string.IsNullOrWhiteSpace(meta.OgImage))
            sb.AppendLine($"<meta property=\"og:image\" content=\"{Escape(meta.OgImage)}\" />");
        if (!string.IsNullOrWhiteSpace(meta.CanonicalUrl))
            sb.AppendLine($"<meta property=\"og:url\" content=\"{Escape(meta.CanonicalUrl)}\" />");
        sb.AppendLine("<meta property=\"og:type\" content=\"website\" />");

        var jsonLd = BuildJsonLd(site);
        if (!string.IsNullOrWhiteSpace(jsonLd))
        {
            sb.AppendLine("<script type=\"application/ld+json\">");
            sb.AppendLine(jsonLd);
            sb.AppendLine("</script>");
        }

        return sb.ToString();
    }

    private static string BuildJsonLd(SiteData site)
    {
        var name = site.Meta.SiteName;
        if (string.IsNullOrWhiteSpace(name))
            return "";

        var type = "LocalBusiness";
        if (site.Restaurant != null) type = "Restaurant";
        if (site.RealEstate != null) type = "RealEstateAgent";

        var sb = new StringBuilder();
        sb.Append("{");
        sb.Append($"\"@context\":\"https://schema.org\",\"@type\":\"{type}\",");
        sb.Append($"\"name\":\"{EscapeJson(name)}\"");
        if (!string.IsNullOrWhiteSpace(site.Meta.CanonicalUrl))
            sb.Append($",\"url\":\"{EscapeJson(site.Meta.CanonicalUrl)}\"");
        if (!string.IsNullOrWhiteSpace(site.Contact.Phone))
            sb.Append($",\"telephone\":\"{EscapeJson(site.Contact.Phone)}\"");
        if (site.Locations.Count > 0)
            sb.Append($",\"address\":\"{EscapeJson(site.Locations[0].Address)}\"");
        sb.Append("}");
        return sb.ToString();
    }

    private static string BuildHero(SiteData site)
    {
        var hero = site.Hero;
        if (string.IsNullOrWhiteSpace(hero.Headline) && string.IsNullOrWhiteSpace(hero.Subheadline))
            return "";

        var image = string.IsNullOrWhiteSpace(hero.Image)
            ? ""
            : $"<img src=\"{Escape(hero.Image)}\" alt=\"{Escape(site.Meta.SiteName)} hero\" loading=\"lazy\" />";

        var cta = string.IsNullOrWhiteSpace(hero.CtaText)
            ? ""
            : $"<a class=\"btn primary\" href=\"{Escape(hero.CtaLink)}\">{Escape(hero.CtaText)}</a>";

        return $@"
<section class=""hero reveal"">
  <div class=""hero-content"">
    <p class=""eyebrow"">{Escape(site.Meta.Tagline)}</p>
    <h1>{Escape(hero.Headline)}</h1>
    <p class=""lead"">{Escape(hero.Subheadline)}</p>
    <div class=""hero-actions"">{cta}</div>
  </div>
  <div class=""hero-media"">{image}</div>
</section>";
    }

    private static string BuildAbout(SiteData site)
    {
        if (string.IsNullOrWhiteSpace(site.About.Title) && string.IsNullOrWhiteSpace(site.About.Body))
            return "";

        var image = string.IsNullOrWhiteSpace(site.About.Image)
            ? ""
            : $"<img src=\"{Escape(site.About.Image)}\" alt=\"About {Escape(site.Meta.SiteName)}\" loading=\"lazy\" />";

        return $@"
<section class=""about reveal"">
  <div class=""about-text"">
    <h2>{Escape(site.About.Title)}</h2>
    <p>{Escape(site.About.Body)}</p>
  </div>
  <div class=""about-media"">{image}</div>
</section>";
    }

    private static string BuildServices(SiteData site)
    {
        if (site.Services.Count == 0) return "";

        var sb = new StringBuilder();
        sb.AppendLine("<section class=\"services reveal\">");
        sb.AppendLine("  <h2>Services</h2>");
        sb.AppendLine("  <div class=\"cards\">");
        foreach (var svc in site.Services)
        {
            var icon = string.IsNullOrWhiteSpace(svc.Icon) ? "" : $"<img src=\"{Escape(svc.Icon)}\" alt=\"\" />";
            sb.AppendLine("    <div class=\"card\">");
            sb.AppendLine($"      <div class=\"icon\">{icon}</div>");
            sb.AppendLine($"      <h3>{Escape(svc.Title)}</h3>");
            sb.AppendLine($"      <p>{Escape(svc.Description)}</p>");
            sb.AppendLine("    </div>");
        }
        sb.AppendLine("  </div>");
        sb.AppendLine("</section>");
        return sb.ToString();
    }

    private static string BuildTestimonials(SiteData site)
    {
        if (site.Testimonials.Count == 0) return "";

        var sb = new StringBuilder();
        sb.AppendLine("<section class=\"testimonials reveal\">");
        sb.AppendLine("  <h2>What people say</h2>");
        sb.AppendLine("  <div class=\"cards\">");
        foreach (var t in site.Testimonials)
        {
            var image = string.IsNullOrWhiteSpace(t.Image) ? "" : $"<img src=\"{Escape(t.Image)}\" alt=\"{Escape(t.Name)}\" loading=\"lazy\" />";
            sb.AppendLine("    <blockquote class=\"card\">");
            sb.AppendLine($"      <p>\"{Escape(t.Quote)}\"</p>");
            sb.AppendLine("      <div class=\"person\">");
            sb.AppendLine($"        {image}");
            sb.AppendLine($"        <div><strong>{Escape(t.Name)}</strong><span>{Escape(t.Role)}</span></div>");
            sb.AppendLine("      </div>");
            sb.AppendLine("    </blockquote>");
        }
        sb.AppendLine("  </div>");
        sb.AppendLine("</section>");
        return sb.ToString();
    }

    private static string BuildCta(SiteData site)
    {
        if (string.IsNullOrWhiteSpace(site.Cta.Title)) return "";
        var button = string.IsNullOrWhiteSpace(site.Cta.ButtonText)
            ? ""
            : $"<a class=\"btn primary\" href=\"{Escape(site.Cta.ButtonLink)}\">{Escape(site.Cta.ButtonText)}</a>";

        return $@"
<section class=""cta reveal"">
  <div class=""cta-inner"">
    <h2>{Escape(site.Cta.Title)}</h2>
    <p>{Escape(site.Cta.Body)}</p>
    {button}
  </div>
</section>";
    }

    private static string BuildContact(SiteData site)
    {
        var contact = site.Contact;
        var map = string.IsNullOrWhiteSpace(contact.MapEmbed) ? "" : $"<div class=\"map\">{contact.MapEmbed}</div>";

        return $@"
<section class=""contact reveal"" id=""contact"">
  <div class=""contact-info"">
    <h2>Contact</h2>
    <p class=""contact-row""><strong>Phone</strong> {Escape(contact.Phone)}</p>
    <p class=""contact-row""><strong>Email</strong> {Escape(contact.Email)}</p>
    <p class=""contact-row""><strong>Address</strong> {Escape(contact.Address)}</p>
    <p class=""contact-row""><strong>Hours</strong> {Escape(contact.Hours)}</p>
  </div>
  {map}
</section>";
    }

    private static string BuildLocations(SiteData site)
    {
        if (site.Locations.Count == 0) return "";
        var sb = new StringBuilder();
        sb.AppendLine("<section class=\"locations reveal\">");
        sb.AppendLine("  <h2>Locations</h2>");
        sb.AppendLine("  <div class=\"cards\">");
        foreach (var loc in site.Locations)
        {
            sb.AppendLine("    <div class=\"card\">");
            sb.AppendLine($"      <h3>{Escape(loc.Label)}</h3>");
            sb.AppendLine($"      <p>{Escape(loc.Address)}</p>");
            sb.AppendLine($"      <p>{Escape(loc.Phone)}</p>");
            sb.AppendLine("    </div>");
        }
        sb.AppendLine("  </div>");
        sb.AppendLine("</section>");
        return sb.ToString();
    }

    private static string BuildSocialLinks(SiteData site)
    {
        if (site.Social.Count == 0) return "";
        var sb = new StringBuilder();
        sb.AppendLine("<div class=\"social\">");
        foreach (var link in site.Social)
        {
            sb.AppendLine($"  <a href=\"{Escape(link.Url)}\" target=\"_blank\" rel=\"noopener\">{Escape(link.Label)}</a>");
        }
        sb.AppendLine("</div>");
        return sb.ToString();
    }

    private static string BuildRestaurantMenu(SiteData site)
    {
        if (site.Restaurant?.MenuSections.Count > 0)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<section class=\"menu reveal\" id=\"menu\">");
            sb.AppendLine("  <h2>Menu Highlights</h2>");
            foreach (var section in site.Restaurant.MenuSections)
            {
                sb.AppendLine($"  <div class=\"menu-section\">");
                sb.AppendLine($"    <h3>{Escape(section.Title)}</h3>");
                sb.AppendLine("    <ul>");
                foreach (var item in section.Items)
                {
                    sb.AppendLine("      <li>");
                    sb.AppendLine($"        <div class=\"menu-title\"><strong>{Escape(item.Name)}</strong><span>{Escape(item.Price)}</span></div>");
                    sb.AppendLine($"        <p>{Escape(item.Description)}</p>");
                    sb.AppendLine("      </li>");
                }
                sb.AppendLine("    </ul>");
                sb.AppendLine("  </div>");
            }
            sb.AppendLine("</section>");
            return sb.ToString();
        }

        return "";
    }

    private static string BuildRestaurantGallery(SiteData site)
    {
        if (site.Restaurant?.Gallery.Count > 0)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<section class=\"gallery reveal\">");
            sb.AppendLine("  <h2>Gallery</h2>");
            sb.AppendLine("  <div class=\"grid\">");
            foreach (var img in site.Restaurant.Gallery)
            {
                sb.AppendLine($"    <img src=\"{Escape(img.Image)}\" alt=\"{Escape(img.Alt)}\" loading=\"lazy\" />");
            }
            sb.AppendLine("  </div>");
            sb.AppendLine("</section>");
            return sb.ToString();
        }

        return "";
    }

    private static string BuildRestaurantReservations(SiteData site)
    {
        var r = site.Restaurant?.Reservations;
        if (r == null || string.IsNullOrWhiteSpace(r.CtaText)) return "";
        return $@"
<section class=""reservations reveal"" id=""reservations"">
  <h2>Reservations</h2>
  <p>Book your table in just a few clicks.</p>
  <a class=""btn primary"" href=""{Escape(r.CtaLink)}"">{Escape(r.CtaText)}</a>
</section>";
    }

    private static string BuildContractorBeforeAfter(SiteData site)
    {
        if (site.Contractor?.BeforeAfter.Count > 0)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<section class=\"before-after reveal\" id=\"work\">");
            sb.AppendLine("  <h2>Before & After</h2>");
            sb.AppendLine("  <div class=\"ba-grid\">");
            foreach (var ba in site.Contractor.BeforeAfter)
            {
                sb.AppendLine("    <div class=\"ba-item\">");
                sb.AppendLine($"      <img src=\"{Escape(ba.BeforeImage)}\" alt=\"Before\" loading=\"lazy\" />");
                sb.AppendLine($"      <img src=\"{Escape(ba.AfterImage)}\" alt=\"After\" loading=\"lazy\" />");
                sb.AppendLine($"      <p>{Escape(ba.Caption)}</p>");
                sb.AppendLine("    </div>");
            }
            sb.AppendLine("  </div>");
            sb.AppendLine("</section>");
            return sb.ToString();
        }
        return "";
    }

    private static string BuildContractorProcess(SiteData site)
    {
        if (site.Contractor?.Process.Count > 0)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<section class=\"process reveal\" id=\"process\">");
            sb.AppendLine("  <h2>Our Process</h2>");
            sb.AppendLine("  <ol>");
            foreach (var step in site.Contractor.Process)
            {
                sb.AppendLine("    <li>");
                sb.AppendLine($"      <strong>{Escape(step.Step)}</strong>");
                sb.AppendLine($"      <p>{Escape(step.Detail)}</p>");
                sb.AppendLine("    </li>");
            }
            sb.AppendLine("  </ol>");
            sb.AppendLine("</section>");
            return sb.ToString();
        }
        return "";
    }

    private static string BuildContractorCertifications(SiteData site)
    {
        if (site.Contractor?.Certifications.Count > 0)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<section class=\"certifications reveal\">");
            sb.AppendLine("  <h2>Certifications</h2>");
            sb.AppendLine("  <ul>");
            foreach (var c in site.Contractor.Certifications)
            {
                sb.AppendLine($"    <li><strong>{Escape(c.Name)}</strong> - {Escape(c.Issuer)} ({Escape(c.Year)})</li>");
            }
            sb.AppendLine("  </ul>");
            sb.AppendLine("</section>");
            return sb.ToString();
        }
        return "";
    }

    private static string BuildRealEstateListings(SiteData site)
    {
        if (site.RealEstate?.FeaturedListings.Count > 0)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<section class=\"listings reveal\" id=\"listings\">");
            sb.AppendLine("  <h2>Featured Listings</h2>");
            sb.AppendLine("  <div class=\"cards\">");
            foreach (var l in site.RealEstate.FeaturedListings)
            {
                sb.AppendLine("    <div class=\"card listing\">");
                sb.AppendLine($"      <img src=\"{Escape(l.Image)}\" alt=\"{Escape(l.Title)}\" loading=\"lazy\" />");
                sb.AppendLine($"      <h3>{Escape(l.Title)}</h3>");
                sb.AppendLine($"      <p class=\"price\">{Escape(l.Price)}</p>");
                sb.AppendLine($"      <p>{Escape(l.Address)}</p>");
                sb.AppendLine($"      <p class=\"meta\">{Escape(l.Beds)} bd | {Escape(l.Baths)} ba | {Escape(l.Sqft)} sqft</p>");
                sb.AppendLine("    </div>");
            }
            sb.AppendLine("  </div>");
            sb.AppendLine("</section>");
            return sb.ToString();
        }
        return "";
    }

    private static string BuildRealEstateAgents(SiteData site)
    {
        if (site.RealEstate?.Agents.Count > 0)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<section class=\"agents reveal\" id=\"agents\">");
            sb.AppendLine("  <h2>Meet the Team</h2>");
            sb.AppendLine("  <div class=\"cards\">");
            foreach (var a in site.RealEstate.Agents)
            {
                sb.AppendLine("    <div class=\"card agent\">");
                sb.AppendLine($"      <img src=\"{Escape(a.Image)}\" alt=\"{Escape(a.Name)}\" loading=\"lazy\" />");
                sb.AppendLine($"      <h3>{Escape(a.Name)}</h3>");
                sb.AppendLine($"      <p>{Escape(a.Role)}</p>");
                sb.AppendLine($"      <p>{Escape(a.Phone)}</p>");
                sb.AppendLine($"      <p>{Escape(a.Email)}</p>");
                sb.AppendLine("    </div>");
            }
            sb.AppendLine("  </div>");
            sb.AppendLine("</section>");
            return sb.ToString();
        }
        return "";
    }

    private static string BuildRealEstateNeighborhoods(SiteData site)
    {
        if (site.RealEstate?.Neighborhoods.Count > 0)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<section class=\"neighborhoods reveal\">");
            sb.AppendLine("  <h2>Neighborhoods</h2>");
            sb.AppendLine("  <div class=\"cards\">");
            foreach (var n in site.RealEstate.Neighborhoods)
            {
                sb.AppendLine("    <div class=\"card\">");
                sb.AppendLine($"      <h3>{Escape(n.Name)}</h3>");
                sb.AppendLine($"      <p>{Escape(n.Summary)}</p>");
                sb.AppendLine("    </div>");
            }
            sb.AppendLine("  </div>");
            sb.AppendLine("</section>");
            return sb.ToString();
        }
        return "";
    }

    private static string BuildServicePricing(SiteData site)
    {
        if (site.Service?.Pricing.Count > 0)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<section class=\"pricing reveal\" id=\"pricing\">");
            sb.AppendLine("  <h2>Pricing</h2>");
            sb.AppendLine("  <div class=\"cards\">");
            foreach (var p in site.Service.Pricing)
            {
                sb.AppendLine("    <div class=\"card plan\">");
                sb.AppendLine($"      <h3>{Escape(p.Name)}</h3>");
                sb.AppendLine($"      <p class=\"price\">{Escape(p.Price)}</p>");
                sb.AppendLine("      <ul>");
                foreach (var f in p.Features)
                {
                    sb.AppendLine($"        <li>{Escape(f)}</li>");
                }
                sb.AppendLine("      </ul>");
                sb.AppendLine("    </div>");
            }
            sb.AppendLine("  </div>");
            sb.AppendLine("</section>");
            return sb.ToString();
        }
        return "";
    }

    private static string BuildServiceFaqs(SiteData site)
    {
        if (site.Service?.Faqs.Count > 0)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<section class=\"faqs reveal\" id=\"faqs\">");
            sb.AppendLine("  <h2>FAQs</h2>");
            sb.AppendLine("  <div class=\"faq-list\">");
            foreach (var f in site.Service.Faqs)
            {
                sb.AppendLine("    <details>");
                sb.AppendLine($"      <summary>{Escape(f.Question)}</summary>");
                sb.AppendLine($"      <p>{Escape(f.Answer)}</p>");
                sb.AppendLine("    </details>");
            }
            sb.AppendLine("  </div>");
            sb.AppendLine("</section>");
            return sb.ToString();
        }
        return "";
    }

    private static string BuildServiceCoverage(SiteData site)
    {
        if (site.Service == null) return "";
        var areas = site.Service.Coverage.Areas.Count > 0
            ? string.Join(", ", site.Service.Coverage.Areas.Select(Escape))
            : "";
        if (string.IsNullOrWhiteSpace(areas) && string.IsNullOrWhiteSpace(site.Service.Coverage.Notes))
            return "";

        return $@"
<section class=""coverage reveal"">
  <h2>Coverage Area</h2>
  <p>{areas}</p>
  <p>{Escape(site.Service.Coverage.Notes)}</p>
</section>";
    }

    private static string Escape(string? input) =>
        WebUtility.HtmlEncode(input ?? "");

    private static string EscapeJson(string input) =>
        input.Replace("\\", "\\\\").Replace("\"", "\\\"");

    private static string BuildLogoMark(SiteData site)
    {
        if (!string.IsNullOrWhiteSpace(site.Brand.Logo))
            return $"<img src=\"{Escape(site.Brand.Logo)}\" alt=\"{Escape(site.Meta.SiteName)} logo\" />";

        var initials = string.Join("",
            site.Meta.SiteName
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Take(2)
                .Select(s => s.Substring(0, 1).ToUpperInvariant()));

        return Escape(initials);
    }
}
