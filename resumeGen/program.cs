using ResumeSiteGenerator.Items;
using ResumeSiteGenerator.Pages;
using ResumeSiteGenerator.Templates;
using System;


namespace ResumeSiteGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Resume Website Generator\n");

            // Load templates
            var manager = new TemplateManager();
            manager.LoadAllTemplates("templates");

            // Choose template
            var names = manager.GetTemplateNames();
            Console.WriteLine("Available Templates:");
            foreach (var name in names)
                Console.WriteLine($"- {name}");

            Console.Write("\nChoose template: ");
            string choice = Console.ReadLine();

            var template = manager.GetTemplateByName(choice);
            if (template == null)
            {
                Console.WriteLine("Invalid template.");
                return;
            }

            // TODO: Build InputManager next to collect user data
            // TEMPORARY: Test resume so program can run
var resume = new Resume(
    name: "John Doe",
    email: "john@example.com",
    phone: "555-1234"
);

// Add some fake content
resume.AddSkill("C#");
resume.AddSkill("HTML");
resume.AddSkill("CSS");

resume.AddExperience(new ExperienceItem(
    "Software Developer",
    "Example Corp",
    "Worked on test projects",
    "2020",
    "2023"
));

resume.AddProject(new ProjectItem(
    "Portfolio Generator",
    "A program that generates websites from templates"
));
var pages = template.GenerateAllPages(resume);

var writer = new FileWriter();
writer.EnsureOutputDirectory("Output");

foreach (var page in pages)
{
    writer.SaveHtml($"Output/{page.Key}.html", page.Value);
}

writer.SaveCss("Output/style.css", template.CssTemplate);

Console.WriteLine("Website generated in /Output!");

        }
    }

    
}
