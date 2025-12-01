namespace ResumeSiteGenerator.Pages
{
    public class ProfilePage : PageBase
    {
        public ProfilePage(string pageName)
        {
            PageName = pageName;
        }

        public override string GenerateHtml(Resume resume)
        {
            // To be implemented: replace placeholders
            return TemplateContent;
        }
    }
}
