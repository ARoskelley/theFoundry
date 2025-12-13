using System;
using System.IO;
using ResumeSiteGenerator.Templates;
using ResumeSiteGenerator.Input;

namespace ResumeSiteGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Resume Website Generator ===\n");

            // --------------------------------------------------
            // Resolve project root (bin/Debug/net8.0 -> project root)
            // --------------------------------------------------
            string projectRoot = Path.GetFullPath(
                Path.Combine(AppContext.BaseDirectory, @"..\..\..")
            );

            string templateRoot = Path.Combine(projectRoot, "TemplateFiles");
            string outputRoot = Path.Combine(projectRoot, "Output");

            Console.WriteLine($"Project root: {projectRoot}");
            Console.WriteLine($"Template folder: {templateRoot}\n");

            if (!Directory.Exists(templateRoot))
            {
                Console.WriteLine("ERROR: TemplateFiles directory not found.");
                Console.WriteLine("Ensure it exists at the project root.");
                return;
            }

            // --------------------------------------------------
            // Load templates
            // --------------------------------------------------
            var templateManager = new TemplateManager();
            templateManager.LoadAllTemplates(templateRoot);

            var templateNames = templateManager.GetTemplateNames();

            if (templateNames.Count == 0)
            {
                Console.WriteLine("ERROR: No templates found in TemplateFiles.");
                return;
            }

            Console.WriteLine("Available Templates:");
            foreach (var name in templateNames)
            {
                Console.WriteLine($" - {name}");
            }

            Console.Write("\nChoose a template: ");
            string templateChoice = Console.ReadLine()?.Trim().ToLower() ?? "";

            var template = templateManager.GetTemplateByName(templateChoice);
            if (template == null)
            {
                Console.WriteLine($"ERROR: Template '{templateChoice}' not found.");
                return;
            }

            // --------------------------------------------------
            // Choose resume build mode
            // --------------------------------------------------
            Console.WriteLine("\nChoose resume build mode:");
            Console.WriteLine("1 - Quick Build (minimal prompts)");
            Console.WriteLine("2 - Full Build (guided & detailed)");
            Console.Write("Selection: ");

            IResumeBuilder builder = Console.ReadLine() switch
            {
                "2" => new FullResumeBuilder(),
                _   => new QuickResumeBuilder()
            };

            var resume = builder.BuildResume();

            // --------------------------------------------------
            // Generate pages
            // --------------------------------------------------
            Console.WriteLine("\nGenerating website...");

            var pages = template.GenerateAllPages(resume);

            var writer = new FileWriter();
            writer.EnsureOutputDirectory(outputRoot);

            foreach (var page in pages)
            {
                string outputPath = Path.Combine(outputRoot, $"{page.Key}.html");
                writer.SaveHtml(outputPath, page.Value);
                Console.WriteLine($"Created: {outputPath}");
            }

            // Save CSS
            string cssPath = Path.Combine(outputRoot, "style.css");
            writer.SaveCss(cssPath, template.CssTemplate ?? "");
            Console.WriteLine($"Created: {cssPath}");

            Console.WriteLine("\n=== Website Generation Complete ===");
            Console.WriteLine("Open the Output folder to view your site.\n");
        }
    }
}
