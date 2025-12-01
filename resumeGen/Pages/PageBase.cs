namespace ResumeSiteGenerator.Pages
{
    public abstract class PageBase
    {
        protected string TemplateContent { get; private set; }
        public string PageName { get; protected set; }

        public void LoadTemplate(string filePath)
        {
            if (System.IO.File.Exists(filePath))
                TemplateContent = System.IO.File.ReadAllText(filePath);
        }

        public abstract string GenerateHtml(Resume resume);
    }
}
