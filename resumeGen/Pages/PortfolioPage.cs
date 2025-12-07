namespace ResumeSiteGenerator.Pages
{
    public class PortfolioPage : PageBase
    {
        public PortfolioPage(string pageName)
        {
            PageName = pageName;
        }

        public override string GenerateHtml(Resume resume)
        {
            return TemplateContent;
        }
    }
}
