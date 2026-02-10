using System.Text.Json;
using System.Text.Json.Serialization;

namespace BusinessSiteGenerator;

public class SiteData
{
    public Meta Meta { get; set; } = new();
    public Brand Brand { get; set; } = new();
    public Hero Hero { get; set; } = new();
    public About About { get; set; } = new();
    public List<ServiceItem> Services { get; set; } = new();
    public List<Testimonial> Testimonials { get; set; } = new();
    public Cta Cta { get; set; } = new();
    public Contact Contact { get; set; } = new();
    public List<Location> Locations { get; set; } = new();
    public List<SocialLink> Social { get; set; } = new();

    public RestaurantData? Restaurant { get; set; }
    public ContractorData? Contractor { get; set; }
    public RealEstateData? RealEstate { get; set; }
    public ServiceBusinessData? Service { get; set; }

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public string ToJson() => JsonSerializer.Serialize(this, JsonOptions);

    public static SiteData FromJson(string json) =>
        JsonSerializer.Deserialize<SiteData>(json, JsonOptions)
        ?? throw new InvalidOperationException("Failed to deserialize site JSON.");

    public void SaveToFile(string path)
    {
        File.WriteAllText(path, ToJson());
    }

    public static SiteData LoadFromFile(string path)
    {
        if (!File.Exists(path))
            throw new FileNotFoundException($"Site data file not found: {path}");

        return FromJson(File.ReadAllText(path));
    }

    public List<string> Validate()
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(Meta.SiteName))
            errors.Add("meta.siteName is required.");
        if (string.IsNullOrWhiteSpace(Meta.Title))
            errors.Add("meta.title is required.");
        if (string.IsNullOrWhiteSpace(Meta.Description))
            errors.Add("meta.description is required.");
        if (string.IsNullOrWhiteSpace(Hero.Headline))
            errors.Add("hero.headline is required.");
        if (string.IsNullOrWhiteSpace(Cta.ButtonText))
            errors.Add("cta.buttonText is required.");
        if (string.IsNullOrWhiteSpace(Contact.Email) && string.IsNullOrWhiteSpace(Contact.Phone))
            errors.Add("contact.phone or contact.email is required.");

        return errors;
    }
}

public class Meta
{
    public string SiteName { get; set; } = "";
    public string Tagline { get; set; } = "";
    public string Domain { get; set; } = "";
    public string Language { get; set; } = "en";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string CanonicalUrl { get; set; } = "";
    public string OgImage { get; set; } = "";
    public string Favicon { get; set; } = "";
}

public class Brand
{
    public string Logo { get; set; } = "";
    public BrandColors Colors { get; set; } = new();
    public BrandFonts Fonts { get; set; } = new();
}

public class BrandColors
{
    public string Primary { get; set; } = "#111827";
    public string Secondary { get; set; } = "#94A3B8";
    public string Accent { get; set; } = "#F59E0B";
    public string Background { get; set; } = "#F8FAFC";
    public string Text { get; set; } = "#0F172A";
}

public class BrandFonts
{
    public string Heading { get; set; } = "serif";
    public string Body { get; set; } = "sans-serif";
}

public class Hero
{
    public string Headline { get; set; } = "";
    public string Subheadline { get; set; } = "";
    public string CtaText { get; set; } = "";
    public string CtaLink { get; set; } = "";
    public string Image { get; set; } = "";
}

public class About
{
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public string Image { get; set; } = "";
}

public class ServiceItem
{
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Icon { get; set; } = "";
}

public class Testimonial
{
    public string Name { get; set; } = "";
    public string Quote { get; set; } = "";
    public string Role { get; set; } = "";
    public string Image { get; set; } = "";
}

public class Cta
{
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public string ButtonText { get; set; } = "";
    public string ButtonLink { get; set; } = "";
}

public class Contact
{
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string Address { get; set; } = "";
    public string Hours { get; set; } = "";
    public string MapEmbed { get; set; } = "";
}

public class Location
{
    public string Label { get; set; } = "";
    public string Address { get; set; } = "";
    public string Phone { get; set; } = "";
}

public class SocialLink
{
    public string Label { get; set; } = "";
    public string Url { get; set; } = "";
}

public class RestaurantData
{
    public List<MenuSection> MenuSections { get; set; } = new();
    public Reservation? Reservations { get; set; }
    public List<ImageItem> Gallery { get; set; } = new();
}

public class MenuSection
{
    public string Title { get; set; } = "";
    public List<MenuItem> Items { get; set; } = new();
}

public class MenuItem
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Price { get; set; } = "";
}

public class Reservation
{
    public string CtaText { get; set; } = "";
    public string CtaLink { get; set; } = "";
}

public class ImageItem
{
    public string Image { get; set; } = "";
    public string Alt { get; set; } = "";
}

public class ContractorData
{
    public List<BeforeAfter> BeforeAfter { get; set; } = new();
    public List<ProcessStep> Process { get; set; } = new();
    public List<Certification> Certifications { get; set; } = new();
}

public class BeforeAfter
{
    public string BeforeImage { get; set; } = "";
    public string AfterImage { get; set; } = "";
    public string Caption { get; set; } = "";
}

public class ProcessStep
{
    public string Step { get; set; } = "";
    public string Detail { get; set; } = "";
}

public class Certification
{
    public string Name { get; set; } = "";
    public string Issuer { get; set; } = "";
    public string Year { get; set; } = "";
}

public class RealEstateData
{
    public List<Listing> FeaturedListings { get; set; } = new();
    public List<Agent> Agents { get; set; } = new();
    public List<Neighborhood> Neighborhoods { get; set; } = new();
}

public class Listing
{
    public string Title { get; set; } = "";
    public string Price { get; set; } = "";
    public string Address { get; set; } = "";
    public string Beds { get; set; } = "";
    public string Baths { get; set; } = "";
    public string Sqft { get; set; } = "";
    public string Image { get; set; } = "";
}

public class Agent
{
    public string Name { get; set; } = "";
    public string Role { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string Image { get; set; } = "";
}

public class Neighborhood
{
    public string Name { get; set; } = "";
    public string Summary { get; set; } = "";
}

public class ServiceBusinessData
{
    public List<PricingPlan> Pricing { get; set; } = new();
    public List<FaqItem> Faqs { get; set; } = new();
    public Coverage Coverage { get; set; } = new();
}

public class PricingPlan
{
    public string Name { get; set; } = "";
    public string Price { get; set; } = "";
    public List<string> Features { get; set; } = new();
}

public class FaqItem
{
    public string Question { get; set; } = "";
    public string Answer { get; set; } = "";
}

public class Coverage
{
    public List<string> Areas { get; set; } = new();
    public string Notes { get; set; } = "";
}
