using ResumeSiteGenerator.Utilities;

namespace ResumeSiteGenerator.Pages
{
    public class PortfolioPage : PageBase
    {
        private PlaceholderEngine _engine;

        public PortfolioPage(string pageName)
        {
            PageName = pageName;
            _engine = new PlaceholderEngine();
        }

        public override string GenerateHtml(Resume resume)
        {
            string html = TemplateContent ?? "";

            html = _engine.ReplaceCommonPlaceholders(html, resume);
            html = html.Replace("{{PROJECTS}}", _engine.BuildProjectsHtml(resume));
            html = html.Replace("{{EDUCATION}}", _engine.BuildEducationHtml(resume));


            return html;
        }
    }
}
