using System.IO;
using ResumeSiteGenerator.Pages;

namespace ResumeSiteGenerator.Templates
{
    public class MinimalTemplate : TemplateBase
    {
        public override void LoadTemplateFiles(string folderPath)
        {
            // Load CSS
            CssTemplate = File.ReadAllText(Path.Combine(folderPath, "style.css"));

            // Load Pages
            var profile = new ProfilePage("index");
            profile.LoadTemplate(Path.Combine(folderPath, "page_profile.html"));

            var experience = new ExperiencePage("experience");
            experience.LoadTemplate(Path.Combine(folderPath, "page_experience.html"));

            var portfolio = new PortfolioPage("portfolio");
            portfolio.LoadTemplate(Path.Combine(folderPath, "page_portfolio.html"));

            Pages.Add(profile);
            Pages.Add(experience);
            Pages.Add(portfolio);
        }
    }
}
