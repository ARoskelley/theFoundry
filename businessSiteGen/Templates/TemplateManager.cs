using BusinessSiteGenerator.Config;
using BusinessSiteGenerator.Exceptions;
using BusinessSiteGenerator.Utilities;

namespace BusinessSiteGenerator.Templates;

public class Template
{
    public string Name { get; }
    public string FolderPath { get; }
    public TemplateConfig Config { get; }

    private readonly Dictionary<string, string> _pageTemplates = new();
    private readonly PlaceholderEngine _engine = new();

    public Template(string folderPath)
    {
        FolderPath = folderPath;
        Name = Path.GetFileName(folderPath);

        var configPath = Path.Combine(folderPath, "template.json");
        Config = TemplateConfig.Load(configPath);

        LoadTemplateFiles();
    }

    private void LoadTemplateFiles()
    {
        foreach (var page in Config.Pages)
        {
            var pagePath = Path.Combine(FolderPath, page.FileName);
            if (File.Exists(pagePath))
            {
                _pageTemplates[page.OutputName] = File.ReadAllText(pagePath);
            }
        }

        if (_pageTemplates.Count == 0)
        {
            throw new InvalidTemplateException(FolderPath,
                Config.Pages.Select(p => p.FileName).ToList());
        }
    }

    public Dictionary<string, string> GenerateAllPages(SiteData site, bool animationsEnabled)
    {
        var result = new Dictionary<string, string>();

        foreach (var (pageName, template) in _pageTemplates)
        {
            var html = _engine.Process(template, site, animationsEnabled);
            result[pageName] = html;
        }

        return result;
    }

    public IEnumerable<string> GetStaticFilePaths()
    {
        foreach (var css in Config.CssFiles)
        {
            var path = Path.Combine(FolderPath, css);
            if (File.Exists(path))
                yield return path;
        }

        foreach (var js in Config.JsFiles)
        {
            var path = Path.Combine(FolderPath, js);
            if (File.Exists(path))
                yield return path;
        }

        foreach (var file in Config.StaticFiles)
        {
            var path = Path.Combine(FolderPath, file);
            if (File.Exists(path))
                yield return path;
        }
    }

    public IEnumerable<string> GetStaticDirectories()
    {
        foreach (var dir in Config.StaticDirectories)
        {
            var path = Path.Combine(FolderPath, dir);
            if (Directory.Exists(path))
                yield return path;
        }
    }
}

public class TemplateManager
{
    private readonly Dictionary<string, Template> _templates = new();
    private readonly string _templatesFolder;

    public TemplateManager(string templatesFolder)
    {
        _templatesFolder = templatesFolder;
    }

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
                if (Directory.GetFiles(dir, "*.html").Length > 0)
                {
                    var template = new Template(dir);
                    var key = Path.GetFileName(dir).ToLowerInvariant();
                    _templates[key] = template;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Could not load template from '{dir}': {ex.Message}");
            }
        }
    }

    public IReadOnlyList<string> GetTemplateNames() =>
        _templates.Keys
            .Select(k => char.ToUpper(k[0]) + k[1..])
            .ToList();

    public Template GetTemplate(string name)
    {
        var key = name.ToLowerInvariant();
        if (!_templates.TryGetValue(key, out var template))
        {
            throw new TemplateNotFoundException(name);
        }

        return template;
    }

    public bool HasTemplate(string name) =>
        _templates.ContainsKey(name.ToLowerInvariant());
}
