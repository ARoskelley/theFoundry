using ResumeSiteGenerator.Config;
using ResumeSiteGenerator.Exceptions;
using ResumeSiteGenerator.Utilities;

namespace ResumeSiteGenerator.Templates;

/// <summary>
/// Represents a loaded template that can generate HTML pages.
/// Templates are now configuration-driven rather than hard-coded.
/// </summary>
public class Template
{
    public string Name { get; }
    public string FolderPath { get; }
    public TemplateConfig Config { get; }

    private readonly Dictionary<string, string> _pageTemplates = new();
    private readonly PlaceholderEngine _engine = new();

    public string? CssContent { get; private set; }

    public Template(string folderPath)
    {
        FolderPath = folderPath;
        Name = Path.GetFileName(folderPath);

        // Load configuration
        var configPath = Path.Combine(folderPath, "template.json");
        Config = TemplateConfig.Load(configPath);

        // Override name from config if available
        if (!string.IsNullOrWhiteSpace(Config.Name))
        {
            // Keep folder name for internal use, config name for display
        }

        LoadTemplateFiles();
    }

    private void LoadTemplateFiles()
    {
        // Load CSS
        var cssPath = Path.Combine(FolderPath, Config.CssFile);
        if (File.Exists(cssPath))
        {
            CssContent = File.ReadAllText(cssPath);

            // Apply color theme if specified
            if (Config.Colors != null)
            {
                CssContent = Config.Colors.ToCssVariables() + "\n\n" + CssContent;
            }
        }

        // Load page templates
        foreach (var page in Config.Pages)
        {
            var pagePath = Path.Combine(FolderPath, page.FileName);
            if (File.Exists(pagePath))
            {
                _pageTemplates[page.OutputName] = File.ReadAllText(pagePath);
            }
        }

        // Validate we have at least one page
        if (_pageTemplates.Count == 0)
        {
            throw new InvalidTemplateException(FolderPath,
                Config.Pages.Select(p => p.FileName).ToList());
        }
    }

    /// <summary>
    /// Generates all pages for the given resume.
    /// </summary>
    public Dictionary<string, string> GenerateAllPages(Resume resume)
    {
        var result = new Dictionary<string, string>();

        foreach (var (pageName, template) in _pageTemplates)
        {
            var html = _engine.Process(template, resume);
            result[pageName] = html;
        }

        return result;
    }

    /// <summary>
    /// Gets the list of static files that should be copied to output.
    /// </summary>
    public IEnumerable<string> GetStaticFilePaths()
    {
        foreach (var file in Config.StaticFiles)
        {
            var fullPath = Path.Combine(FolderPath, file);
            if (File.Exists(fullPath))
                yield return fullPath;
        }
    }
}

/// <summary>
/// Manages template discovery and loading.
/// Uses convention-based discovery: any folder in TemplateFiles/ with HTML files is a template.
/// </summary>
public class TemplateManager
{
    private readonly Dictionary<string, Template> _templates = new();
    private readonly string _templatesFolder;

    public TemplateManager(string templatesFolder)
    {
        _templatesFolder = templatesFolder;
    }

    /// <summary>
    /// Discovers and loads all templates from the templates folder.
    /// </summary>
    public void DiscoverTemplates()
    {
        if (!Directory.Exists(_templatesFolder))
        {
            throw new DirectoryNotFoundException(
                $"Templates folder not found: {_templatesFolder}");
        }

        foreach (var dir in Directory.GetDirectories(_templatesFolder))
        {
            try
            {
                // Check if this looks like a template (has HTML files)
                if (Directory.GetFiles(dir, "*.html").Length > 0)
                {
                    var template = new Template(dir);
                    var key = Path.GetFileName(dir).ToLowerInvariant();
                    _templates[key] = template;
                }
            }
            catch (Exception ex)
            {
                // Log but don't fail - skip invalid templates
                Console.WriteLine($"Warning: Could not load template from '{dir}': {ex.Message}");
            }
        }
    }

    /// <summary>
    /// Gets the names of all available templates.
    /// </summary>
    public IReadOnlyList<string> GetTemplateNames() =>
        _templates.Keys
            .Select(k => char.ToUpper(k[0]) + k[1..])
            .ToList();

    /// <summary>
    /// Gets detailed info about all templates.
    /// </summary>
    public IEnumerable<(string Name, string Description)> GetTemplateInfo() =>
        _templates.Values.Select(t => (t.Config.Name, t.Config.Description));

    /// <summary>
    /// Gets a template by name (case-insensitive).
    /// </summary>
    public Template GetTemplate(string name)
    {
        var key = name.ToLowerInvariant();

        if (!_templates.TryGetValue(key, out var template))
        {
            throw new TemplateNotFoundException(name);
        }

        return template;
    }

    /// <summary>
    /// Checks if a template exists.
    /// </summary>
    public bool HasTemplate(string name) =>
        _templates.ContainsKey(name.ToLowerInvariant());
}
