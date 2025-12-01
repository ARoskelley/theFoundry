using System.Collections.Generic;
using ResumeSiteGenerator.Pages;

namespace ResumeSiteGenerator.Templates
{
    public abstract class TemplateBase
    {
        protected List<PageBase> Pages { get; private set; }
        public string CssTemplate { get; protected set; }

        public TemplateBase()
        {
            Pages = new List<PageBase>();
        }

        public abstract void LoadTemplateFiles(string folderPath);

        public virtual Dictionary<string, string> GenerateAllPages(Resume resume)
        {
            var result = new Dictionary<string, string>();

            foreach (var page in Pages)
            {
                string html = page.GenerateHtml(resume);
                result.Add(page.PageName, html);
            }

            return result;
        }
    }
}
