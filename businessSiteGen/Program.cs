using BusinessSiteGenerator.Exceptions;
using BusinessSiteGenerator.Templates;
using BusinessSiteGenerator.Utilities;

namespace BusinessSiteGenerator;

class Program
{
    static void Main(string[] args)
    {
        try
        {
            var options = ParseArguments(args);

            if (options.ShowHelp)
            {
                ShowHelp();
                return;
            }

            ConsoleUI.WriteHeader("Business Website Generator");

            string projectRoot = ResolveProjectRoot();
            string templateRoot = Path.Combine(projectRoot, "TemplateFiles");
            string outputRoot = options.OutputPath ?? Path.Combine(projectRoot, "Output");

            ConsoleUI.WriteInfo($"Output:    {outputRoot}");
            Console.WriteLine();

            var templateManager = new TemplateManager(templateRoot);
            templateManager.DiscoverTemplates();

            var templateNames = templateManager.GetTemplateNames();
            if (templateNames.Count == 0)
            {
                ConsoleUI.WriteError("No templates found in TemplateFiles folder.");
                return;
            }

            var template = SelectTemplate(templateManager, templateNames, options.TemplateName);

            if (string.IsNullOrWhiteSpace(options.JsonPath))
            {
                ConsoleUI.WriteError("JSON data file is required. Use -j path/to/site.json");
                Console.WriteLine();
                ShowHelp();
                return;
            }

            var site = SiteData.LoadFromFile(options.JsonPath);

            var errors = site.Validate();
            if (errors.Count > 0)
            {
                ConsoleUI.WriteWarning("Site data has validation issues:");
                ConsoleUI.WriteList(errors, "!");
                if (!ConsoleUI.Confirm("Continue anyway?"))
                    return;
            }

            ConsoleUI.WriteSection("Generating Output");

            var writer = new OutputWriter(outputRoot);
            writer.PrepareOutputDirectory(clean: options.CleanOutput);

            var pages = template.GenerateAllPages(site, animationsEnabled: !options.NoAnimations);
            writer.WriteOutput(template, pages);
            writer.WriteSiteJson(site);

            ConsoleUI.WriteSection("Complete!");
            ConsoleUI.WriteSuccess($"Website generated at: {outputRoot}");
            Console.WriteLine();
            Console.WriteLine("Next steps:");
            Console.WriteLine("  1. Open index.html in a browser to preview");
            Console.WriteLine("  2. Replace placeholder images in assets/images");
            Console.WriteLine("  3. Upload the folder to your hosting service");
            Console.WriteLine();
            Console.WriteLine("To regenerate with changes, edit site.json and run:");
            Console.WriteLine($"  dotnet run -- --json \"{Path.Combine(outputRoot, "site.json")}\"");
        }
        catch (GeneratorException ex)
        {
            ConsoleUI.WriteError(ex.Message);
            Environment.Exit(1);
        }
        catch (Exception ex)
        {
            ConsoleUI.WriteError($"Unexpected error: {ex.Message}");
            if (Environment.GetEnvironmentVariable("DEBUG") == "1")
            {
                Console.WriteLine(ex.StackTrace);
            }
            Environment.Exit(1);
        }
    }

    private static string ResolveProjectRoot()
    {
        var baseDir = AppContext.BaseDirectory;
        if (baseDir.Contains(Path.Combine("bin", "Debug")) ||
            baseDir.Contains(Path.Combine("bin", "Release")))
        {
            return Path.GetFullPath(Path.Combine(baseDir, "..", "..", ".."));
        }

        return baseDir;
    }

    private static Template SelectTemplate(
        TemplateManager manager,
        IReadOnlyList<string> names,
        string? preselected)
    {
        if (!string.IsNullOrWhiteSpace(preselected))
        {
            if (manager.HasTemplate(preselected))
            {
                ConsoleUI.WriteInfo($"Using template: {preselected}");
                return manager.GetTemplate(preselected);
            }
            else
            {
                ConsoleUI.WriteWarning($"Template '{preselected}' not found.");
            }
        }

        Console.WriteLine("Available templates:");
        var index = ConsoleUI.PromptChoice("Choose a template:", names.ToList());
        return manager.GetTemplate(names[index]);
    }

    private static CommandLineOptions ParseArguments(string[] args)
    {
        var options = new CommandLineOptions();

        for (int i = 0; i < args.Length; i++)
        {
            switch (args[i].ToLower())
            {
                case "-h":
                case "--help":
                    options.ShowHelp = true;
                    break;
                case "-t":
                case "--template":
                    if (i + 1 < args.Length)
                        options.TemplateName = args[++i];
                    break;
                case "-j":
                case "--json":
                    if (i + 1 < args.Length)
                        options.JsonPath = args[++i];
                    break;
                case "-o":
                case "--output":
                    if (i + 1 < args.Length)
                        options.OutputPath = args[++i];
                    break;
                case "--clean":
                    options.CleanOutput = true;
                    break;
                case "--no-animations":
                    options.NoAnimations = true;
                    break;
            }
        }

        return options;
    }

    private static void ShowHelp()
    {
        Console.WriteLine(@"
Business Website Generator - Generate a business website from JSON data

USAGE:
    dotnet run -- [OPTIONS]

OPTIONS:
    -h, --help              Show this help message
    -t, --template NAME     Use specified template (restaurant, contractor, realestate, service)
    -j, --json PATH         Load site data from JSON file (required)
    -o, --output PATH       Output directory (default: ./Output)
    --clean                 Clean output directory before generating
    --no-animations         Disable animation JS and motion helpers

EXAMPLES:
    dotnet run -- -t restaurant -j example-restaurant.json
    dotnet run -- -t contractor -j example-contractor.json --clean
");
    }
}

class CommandLineOptions
{
    public bool ShowHelp { get; set; }
    public string? TemplateName { get; set; }
    public string? JsonPath { get; set; }
    public string? OutputPath { get; set; }
    public bool CleanOutput { get; set; }
    public bool NoAnimations { get; set; }
}
