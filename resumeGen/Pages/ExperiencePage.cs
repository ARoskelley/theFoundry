namespace ResumeSiteGenerator.Pages
{
    public class ExperiencePage : PageBase
    {
        public ExperiencePage(string pageName)
        {
            PageName = pageName;
        }

        public override string GenerateHtml(Resume resume)
        {
            return TemplateContent;
        }
    }
}
