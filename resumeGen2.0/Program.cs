using ResumeSiteGenerator.Exceptions;
using ResumeSiteGenerator.Input;
using ResumeSiteGenerator.Templates;
using ResumeSiteGenerator.Utilities;

namespace ResumeSiteGenerator;

class Program
{
    static void Main(string[] args)
    {
        try
        {
            // Parse command line arguments
            var options = ParseArguments(args);

            if (options.ShowHelp)
            {
                ShowHelp();
                return;
            }

            ConsoleUI.WriteHeader("Resume Website Generator");

            // Resolve paths
            string projectRoot = ResolveProjectRoot();
            string templateRoot = Path.Combine(projectRoot, "TemplateFiles");
            string outputRoot = options.OutputPath ?? Path.Combine(projectRoot, "Output");

            ConsoleUI.WriteInfo($"Output:    {outputRoot}");
            Console.WriteLine();

            // Load templates (skip if PDF-only)
            Template? template = null;
            if (!options.PdfOnly)
            {
                ConsoleUI.WriteInfo($"Templates: {templateRoot}");
                
                var templateManager = new TemplateManager(templateRoot);
                templateManager.DiscoverTemplates();

                var templateNames = templateManager.GetTemplateNames();
                if (templateNames.Count == 0)
                {
                    ConsoleUI.WriteError("No templates found in TemplateFiles folder.");
                    return;
                }

                // Select template
                template = SelectTemplate(templateManager, templateNames, options.TemplateName);
            }

            // Build resume
            var resume = BuildResume(options);

            // Validate
            var errors = resume.Validate();
            if (errors.Count > 0)
            {
                ConsoleUI.WriteWarning("Resume has validation issues:");
                ConsoleUI.WriteList(errors, "!");

                if (!ConsoleUI.Confirm("Continue anyway?"))
                    return;
            }

            // Generate
            ConsoleUI.WriteSection("Generating Output");

            var writer = new OutputWriter(outputRoot);
            writer.PrepareOutputDirectory(clean: options.CleanOutput);

            // Generate website (unless --pdf-only)
            if (!options.PdfOnly && template != null)
            {
                var pages = template.GenerateAllPages(resume);
                writer.WriteOutput(template, pages, resume);
                writer.WriteResumeJson(resume);
            }

            // Generate PDF (if --pdf or --pdf-only)
            if (options.GeneratePdf)
            {
                var pdfPath = Path.Combine(outputRoot, $"{SanitizeFileName(resume.Name)}_Resume.pdf");
                var pdfGenerator = new PdfGenerator();
                pdfGenerator.Generate(resume, pdfPath);
                ConsoleUI.WriteSuccess($"Created: {Path.GetFileName(pdfPath)}");
            }

            ConsoleUI.WriteSection("Complete!");
            
            if (options.PdfOnly)
            {
                ConsoleUI.WriteSuccess($"PDF generated at: {outputRoot}");
            }
            else
            {
                ConsoleUI.WriteSuccess($"Website generated at: {outputRoot}");
                if (options.GeneratePdf)
                {
                    ConsoleUI.WriteSuccess("PDF resume also generated!");
                }
                Console.WriteLine();
                Console.WriteLine("Next steps:");
                Console.WriteLine("  1. Add your images to the 'images' folder");
                Console.WriteLine("  2. Open index.html in a browser to preview");
                Console.WriteLine("  3. Upload the folder to your hosting service");
                Console.WriteLine();
                Console.WriteLine("To regenerate with changes, edit resume.json and run:");
                Console.WriteLine($"  dotnet run -- --json \"{Path.Combine(outputRoot, "resume.json")}\"");
            }
        }
        catch (ResumeGeneratorException ex)
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

    // ---------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------

    private static string SanitizeFileName(string name)
    {
        var invalid = Path.GetInvalidFileNameChars();
        return string.Join("_", name.Split(invalid, StringSplitOptions.RemoveEmptyEntries)).Replace(" ", "_");
    }

    private static string ResolveProjectRoot()
    {
        // When running from bin/Debug/net8.0, go up 3 levels
        var baseDir = AppContext.BaseDirectory;

        // Check if we're in a bin folder
        if (baseDir.Contains(Path.Combine("bin", "Debug")) ||
            baseDir.Contains(Path.Combine("bin", "Release")))
        {
            return Path.GetFullPath(Path.Combine(baseDir, "..", "..", ".."));
        }

        // Otherwise assume we're already at project root
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

    private static Resume BuildResume(CommandLineOptions options)
    {
        // If JSON file provided, load it
        if (!string.IsNullOrWhiteSpace(options.JsonPath))
        {
            return new JsonResumeLoader(options.JsonPath).Build();
        }

        // Otherwise, interactive build
        Console.WriteLine("\nBuild mode:");
        var modes = new List<string>
        {
            "Quick Build (minimal prompts)",
            "Full Build (guided & detailed)",
            "Load from JSON file"
        };

        var modeIndex = ConsoleUI.PromptChoice("Select build mode:", modes);

        IResumeBuilder builder = modeIndex switch
        {
            0 => new QuickResumeBuilder(),
            1 => new FullResumeBuilder(),
            2 => new JsonResumeLoader(
                ConsoleUI.PromptRequired("Path to resume.json")),
            _ => new QuickResumeBuilder()
        };

        return builder.Build();
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

                case "--pdf":
                    options.GeneratePdf = true;
                    break;

                case "--pdf-only":
                    options.GeneratePdf = true;
                    options.PdfOnly = true;
                    break;
            }
        }

        return options;
    }

    private static void ShowHelp()
    {
        Console.WriteLine(@"
Resume Website Generator - Generate a personal website from your resume data

USAGE:
    dotnet run [OPTIONS]

OPTIONS:
    -h, --help              Show this help message
    -t, --template NAME     Use specified template (e.g., 'modern', 'minimal')
    -j, --json PATH         Load resume data from JSON file
    -o, --output PATH       Output directory (default: ./Output)
    --clean                 Clean output directory before generating
    --pdf                   Also generate a PDF resume
    --pdf-only              Only generate PDF (skip website)

EXAMPLES:
    dotnet run                              Interactive mode
    dotnet run -t modern                    Use modern template
    dotnet run -j resume.json               Load from JSON file
    dotnet run -j resume.json --pdf         Generate website + PDF
    dotnet run -j resume.json --pdf-only    Generate PDF only
    dotnet run -t minimal -j data.json      Combined options

TEMPLATES:
    Templates are auto-discovered from the TemplateFiles/ folder.
    Each subfolder with HTML files is treated as a template.
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
    public bool GeneratePdf { get; set; }
    public bool PdfOnly { get; set; }
}
