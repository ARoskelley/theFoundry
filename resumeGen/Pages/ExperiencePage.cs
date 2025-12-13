using ResumeSiteGenerator.Utilities;

namespace ResumeSiteGenerator.Pages
{
    public class ExperiencePage : PageBase
    {
        private PlaceholderEngine _engine;

        public ExperiencePage(string pageName)
        {
            PageName = pageName;
            _engine = new PlaceholderEngine();
        }

        public override string GenerateHtml(Resume resume)
        {
            string html = TemplateContent ?? "";

            html = _engine.ReplaceCommonPlaceholders(html, resume);
            html = html.Replace("{{EXPERIENCE}}", _engine.BuildExperienceHtml(resume));

            return html;
        }
    }
}
