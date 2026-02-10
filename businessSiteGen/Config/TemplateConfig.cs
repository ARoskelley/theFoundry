using System.Text.Json;
using System.Text.Json.Serialization;

namespace BusinessSiteGenerator.Config;

public class TemplateConfig
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Author { get; set; } = "";
    public string Version { get; set; } = "1.0";
    public List<PageConfig> Pages { get; set; } = new();
    public List<string> CssFiles { get; set; } = new() { "base.css", "styles.css" };
    public List<string> JsFiles { get; set; } = new() { "animations.js", "theme.js" };
    public List<string> StaticFiles { get; set; } = new();
    public List<string> StaticDirectories { get; set; } = new() { "assets" };

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
        Description = "A business website template",
        Pages = new List<PageConfig> { new() { FileName = "index.html", OutputName = "index" } }
    };
}

public class PageConfig
{
    public string FileName { get; set; } = "";
    public string OutputName { get; set; } = "";
    public string? Title { get; set; }
}
