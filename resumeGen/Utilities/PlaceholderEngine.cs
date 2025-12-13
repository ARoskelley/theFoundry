using System.Text;
using ResumeSiteGenerator.Items;

namespace ResumeSiteGenerator.Utilities
{
    public class PlaceholderEngine
    {
        public string ReplaceCommonPlaceholders(string template, Resume resume)
        {
            return template
                .Replace("{{NAME}}", resume.Name)
                .Replace("{{EMAIL}}", resume.Email)
                .Replace("{{PHONE}}", resume.Phone);
        }

        public string BuildSkillsHtml(Resume resume)
        {
            var sb = new StringBuilder();

            foreach (var skill in resume.Skills)
            {
                sb.AppendLine($"<li>{skill}</li>");
            }

            return sb.ToString();
        }

        public string BuildExperienceHtml(Resume resume)
        {
            var sb = new StringBuilder();

            foreach (var exp in resume.Experiences)
            {
                sb.AppendLine("<div class=\"experience-item\">");
                sb.AppendLine($"  <h3>{exp.JobTitle} — {exp.Company}</h3>");
                sb.AppendLine($"  <p class=\"dates\">{exp.StartDate} – {exp.EndDate}</p>");
                sb.AppendLine($"  <p>{exp.Description}</p>");
                sb.AppendLine("</div>");
            }

            return sb.ToString();
        }

        public string BuildProjectsHtml(Resume resume)
        {
            var sb = new StringBuilder();

            foreach (var proj in resume.Projects)
            {
                sb.AppendLine("<div class=\"project-item\">");
                sb.AppendLine($"  <h3>{proj.Title}</h3>");
                sb.AppendLine($"  <p>{proj.Description}</p>");

                if (proj.Technologies.Count > 0)
                {
                    sb.AppendLine("  <p><strong>Tech:</strong> "
                        + string.Join(", ", proj.Technologies) + "</p>");
                }

                sb.AppendLine("</div>");
            }

            return sb.ToString();
        }
    }
}
