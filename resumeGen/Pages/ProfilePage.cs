using ResumeSiteGenerator.Utilities;

namespace ResumeSiteGenerator.Pages
{
    public class ProfilePage : PageBase
    {
        private PlaceholderEngine _engine;

        public ProfilePage(string pageName)
        {
            PageName = pageName;
            _engine = new PlaceholderEngine();
        }

        public override string GenerateHtml(Resume resume)
        {
            string html = TemplateContent ?? "";

            html = _engine.ReplaceCommonPlaceholders(html, resume);
            html = html.Replace("{{SKILLS}}", _engine.BuildSkillsHtml(resume));
            html = html.Replace("{{EDUCATION}}", _engine.BuildEducationSummaryHtml(resume));
            html = html.Replace("{{BIO}}", _engine.BuildBioHtml(resume));
            html = html.Replace("{{PROFILE_IMAGE}}", _engine.BuildProfileImageHtml(resume));

            return html;
        }
    }
}
