using System.Collections.Generic;

namespace ResumeSiteGenerator.Items
{
    public class ProjectItem
    {
        private string _title;
        private string _description;
        private List<string> _technologies;

        public string Title => _title;
        public string Description => _description;
        public IReadOnlyList<string> Technologies => _technologies;

        public ProjectItem(string title, string description)
        {
            _title = title;
            _description = description;
            _technologies = new List<string>();
        }

        public void AddTechnology(string tech)
        {
            _technologies.Add(tech);
        }
    }
}
