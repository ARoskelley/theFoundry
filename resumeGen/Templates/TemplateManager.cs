using System.Collections.Generic;
using System.IO;

namespace ResumeSiteGenerator.Templates
{
    public class TemplateManager
    {
        private Dictionary<string, TemplateBase> _templates;

        public TemplateManager()
        {
            _templates = new Dictionary<string, TemplateBase>();
        }

        public void LoadAllTemplates(string templatesFolderPath)
        {
            foreach (var dir in Directory.GetDirectories(templatesFolderPath))
            {
                string name = Path.GetFileName(dir).ToLower();

                TemplateBase template = name.ToLower() switch
                {
                    "minimal" => new MinimalTemplate(),
                    "modern" => new ModernTemplate(),
                    _ => null
                };

                if (template != null)
                {
                    template.LoadTemplateFiles(dir);
                    _templates.Add(name, template);
                }
            }
        }

        public List<string> GetTemplateNames()
        {
            return _templates.Keys
                .Select(k => char.ToUpper(k[0]) + k.Substring(1))
                .ToList();
        }


        public TemplateBase GetTemplateByName(string name)
        {
            name = name.ToLower();
            return _templates.ContainsKey(name) ? _templates[name] : null;
        }

    }
}
