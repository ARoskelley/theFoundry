using System;
using System.IO;
using ResumeSiteGenerator.Templates;
using ResumeSiteGenerator.Items;

namespace ResumeSiteGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Resume Website Generator (Test Mode) ===\n");

            // --------------------------------------------------
            // Resolve project root (from bin/Debug/net8.0)
            // --------------------------------------------------
            string projectRoot = Path.GetFullPath(
                Path.Combine(AppContext.BaseDirectory, @"..\..\..")
            );

            string templateRoot = Path.Combine(projectRoot, "TemplateFiles");

            Console.WriteLine($"Resolved project root: {projectRoot}");
            Console.WriteLine($"Looking for templates in: {templateRoot}\n");

            if (!Directory.Exists(templateRoot))
            {
                Console.WriteLine("ERROR: TemplateFiles directory not found.");
                Console.WriteLine("Make sure it exists at the project root.");
                return;
            }

            // --------------------------------------------------
            // Load templates
            // --------------------------------------------------
            var manager = new TemplateManager();
            manager.LoadAllTemplates(templateRoot);

            var templateNames = manager.GetTemplateNames();

            if (templateNames.Count == 0)
            {
                Console.WriteLine("ERROR: No templates found inside TemplateFiles.");
                Console.WriteLine("Ensure subfolders like 'Minimal' or 'Modern' exist.");
                return;
            }

            Console.WriteLine("Available Templates:");
            foreach (var name in templateNames)
                Console.WriteLine($" - {name}");

            Console.Write("\nChoose a template: ");
            string choice = Console.ReadLine()?.Trim().ToLower() ?? "";

            var template = manager.GetTemplateByName(choice);

            if (template == null)
            {
                Console.WriteLine($"ERROR: Template '{choice}' not found.");
                return;
            }

            // --------------------------------------------------
            // Create a TEST resume (temporary)
            // --------------------------------------------------
            var resume = new Resume(
                name: "Test User",
                email: "test@example.com",
                phone: "555-5555"
            );

            resume.AddSkill("C#");
            resume.AddSkill("HTML");
            resume.AddSkill("CSS");

            resume.AddExperience(new ExperienceItem(
                "Software Developer",
                "Tech Corp",
                "Worked on internal tools and web applications.",
                "2021",
                "2023"
            ));

            var project = new ProjectItem(
                "Resume Generator",
                "A static site generator written in C#."
            );
            project.AddTechnology("C#");
            project.AddTechnology(".NET");
            project.AddTechnology("HTML/CSS");

            resume.AddProject(project);

            // --------------------------------------------------
            // Generate pages
            // --------------------------------------------------
            Console.WriteLine("\nGenerating pages...");

            var pages = template.GenerateAllPages(resume);

            string outputDir = Path.Combine(projectRoot, "Output");

            var writer = new FileWriter();
            writer.EnsureOutputDirectory(outputDir);

            foreach (var page in pages)
            {
                string outputPath = Path.Combine(outputDir, $"{page.Key}.html");
                writer.SaveHtml(outputPath, page.Value);
                Console.WriteLine($"Created: {outputPath}");
            }

            // Save CSS
            string cssPath = Path.Combine(outputDir, "style.css");
            writer.SaveCss(cssPath, template.CssTemplate ?? "");
            Console.WriteLine($"Created: {cssPath}");

            Console.WriteLine("\n=== Generation Complete ===");
            Console.WriteLine("Open the Output folder to view your site.\n");
        }
    }
}
