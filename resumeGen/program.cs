using System;
using ResumeSiteGenerator.Templates;

namespace ResumeSiteGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Resume Website Generator (Test Mode) ===\n");

            // Load templates
            var manager = new TemplateManager();
            manager.LoadAllTemplates("TemplateFiles");

            var templateNames = manager.GetTemplateNames();

            if (templateNames.Count == 0)
            {
                Console.WriteLine("No templates found! Make sure your /templates folder has subfolders like Minimal or Modern.");
                return;
            }

            Console.WriteLine("Available Templates:");
            foreach (var name in templateNames)
                Console.WriteLine($" - {name}");

            Console.Write("\nChoose a template: ");
            string choice = Console.ReadLine()?.Trim() ?? "";

            var template = manager.GetTemplateByName(choice);

            if (template == null)
            {
                Console.WriteLine($"Template '{choice}' not found.");
                return;
            }

            Console.WriteLine("\nLoading template...");

            // TEMP: Create a test resume so the generator can run
            var resume = new Resume(
                name: "Test User",
                email: "test@example.com",
                phone: "555-5555"
            );

            resume.AddSkill("C#");
            resume.AddSkill("HTML");
            resume.AddSkill("CSS");

            resume.AddExperience(new Items.ExperienceItem(
                "Developer",
                "Tech Corp",
                "Worked on cool projects.",
                "2021",
                "2023"
            ));

            resume.AddProject(new Items.ProjectItem(
                "Project Generator",
                "A program that generates static HTML websites."
            ));

            // Generate pages
            Console.WriteLine("Generating pages...");

            var pages = template.GenerateAllPages(resume);

            var writer = new FileWriter();
            writer.EnsureOutputDirectory("Output");

            foreach (var page in pages)
            {
                string outputPath = $"Output/{page.Key}.html";
                writer.SaveHtml(outputPath, page.Value);
                Console.WriteLine($"Created: {outputPath}");
            }

            // Save CSS
            string cssPath = "Output/style.css";
            writer.SaveCss(cssPath, template.CssTemplate);
            Console.WriteLine($"Created: {cssPath}");

            Console.WriteLine("\n=== Generation Complete! ===");
            Console.WriteLine("Open the /Output folder to view your generated website.\n");
        }
    }
}
