using System.Text.Json;
using System.Text.Json.Serialization;

namespace ResumeSiteGenerator.Config;

/// <summary>
/// Configuration for a template, loaded from template.json in each template folder.
/// Allows templates to be self-describing without code changes.
/// </summary>
public class TemplateConfig
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Author { get; set; } = "";
    public string Version { get; set; } = "1.0";

    /// <summary>
    /// List of page definitions. Each page will be generated.
    /// </summary>
    public List<PageConfig> Pages { get; set; } = new();

    /// <summary>
    /// CSS file name (relative to template folder)
    /// </summary>
    public string CssFile { get; set; } = "style.css";

    /// <summary>
    /// Optional color customization
    /// </summary>
    public ColorTheme? Colors { get; set; }

    /// <summary>
    /// Additional static files to copy (images, fonts, etc.)
    /// </summary>
    public List<string> StaticFiles { get; set; } = new();

    // ---------------------------------------------------------
    // Serialization
    // ---------------------------------------------------------
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public static TemplateConfig Load(string path)
    {
        if (!File.Exists(path))
            return CreateDefault();

        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<TemplateConfig>(json, JsonOptions) ?? CreateDefault();
    }

    public void Save(string path)
    {
        var json = JsonSerializer.Serialize(this, JsonOptions);
        File.WriteAllText(path, json);
    }

    public static TemplateConfig CreateDefault() => new()
    {
        Name = "Unnamed Template",
        Description = "A resume website template",
        Pages = new List<PageConfig>
        {
            new() { FileName = "page_profile.html", OutputName = "index" },
            new() { FileName = "page_experience.html", OutputName = "experience" },
            new() { FileName = "page_portfolio.html", OutputName = "portfolio" }
        }
    };
}

/// <summary>
/// Configuration for a single page within a template.
/// </summary>
public class PageConfig
{
    /// <summary>
    /// The template HTML file name (e.g., "page_profile.html")
    /// </summary>
    public string FileName { get; set; } = "";

    /// <summary>
    /// The output file name without extension (e.g., "index" -> "index.html")
    /// </summary>
    public string OutputName { get; set; } = "";

    /// <summary>
    /// Optional page title override
    /// </summary>
    public string? Title { get; set; }
}

/// <summary>
/// Color theme customization for a template.
/// </summary>
public class ColorTheme
{
    public string Primary { get; set; } = "#2563eb";
    public string PrimarySoft { get; set; } = "#dbeafe";
    public string Background { get; set; } = "#f5f7fb";
    public string Card { get; set; } = "#ffffff";
    public string Text { get; set; } = "#1f2937";
    public string Muted { get; set; } = "#6b7280";

    /// <summary>
    /// Generates CSS variables for the theme
    /// </summary>
    public string ToCssVariables() => $@":root {{
    --accent: {Primary};
    --accent-soft: {PrimarySoft};
    --bg: {Background};
    --card: {Card};
    --text: {Text};
    --muted: {Muted};
}}";
}
