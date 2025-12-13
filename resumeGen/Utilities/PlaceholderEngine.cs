using System.Text;
using System.Net;
using ResumeSiteGenerator.Items;

namespace ResumeSiteGenerator.Utilities
{
    public class PlaceholderEngine
    {
        // -----------------------------
        // Common placeholders
        // -----------------------------
        public string ReplaceCommonPlaceholders(string template, Resume resume)
        {
            return template
                .Replace("{{NAME}}", Escape(resume.Name))
                .Replace("{{EMAIL}}", Escape(resume.Email))
                .Replace("{{PHONE}}", Escape(resume.Phone));
        }

        // -----------------------------
        // Skills
        // -----------------------------
        public string BuildSkillsHtml(Resume resume)
        {
            if (resume.Skills.Count == 0)
            {
                return "<li><em>No skills listed.</em></li>";
            }

            var sb = new StringBuilder();

            foreach (var skill in resume.Skills)
            {
                sb.AppendLine($"<li>{Escape(skill)}</li>");
            }

            return sb.ToString();
        }

        // -----------------------------
        // Education
        // -----------------------------
        public string BuildEducationHtml(Resume resume)
        {
            if (resume.Education.Count == 0)
            {
                return "<p><em>No education listed.</em></p>";
            }

            var sb = new StringBuilder();

            foreach (var edu in resume.Education)
            {
                sb.AppendLine("<div class=\"education-item\">");
                sb.AppendLine($"  <h3>{Escape(edu.Degree)}</h3>");
                sb.AppendLine($"  <p>{Escape(edu.SchoolName)} ({Escape(edu.GraduationYear)})</p>");
                sb.AppendLine("</div>");
            }

            return sb.ToString();
        }

        public string BuildEducationSummaryHtml(Resume resume)
        {
            if (resume.Education.Count == 0)
            {
                return "<p><em>No education listed.</em></p>";
            }

            var sb = new StringBuilder();

            foreach (var edu in resume.Education)
            {
                sb.AppendLine("<div class=\"education-summary\">");
                sb.AppendLine(
                    $"<strong>{Escape(edu.Degree)}</strong> in {Escape(edu.Major)}<br>"
                    + $"{Escape(edu.SchoolName)}"
                );
                sb.AppendLine("</div>");
            }

            return sb.ToString();
        }

        public string BuildEducationDetailedHtml(Resume resume)
        {
            if (resume.Education.Count == 0)
            {
                return "<p><em>No education listed.</em></p>";
            }

            var sb = new StringBuilder();

            foreach (var edu in resume.Education)
            {
                sb.AppendLine("<div class=\"education-item\">");
                sb.AppendLine($"<h3>{Escape(edu.Degree)} — {Escape(edu.Major)}</h3>");
                sb.AppendLine($"<p class=\"school\">{Escape(edu.SchoolName)} ({Escape(edu.GraduationYear)})</p>");

                if (!string.IsNullOrWhiteSpace(edu.Description))
                {
                    sb.AppendLine($"<p>{Escape(edu.Description)}</p>");
                }

                sb.AppendLine("</div>");
            }

            return sb.ToString();
        }
        public string BuildBioHtml(Resume resume)
        {
            if (string.IsNullOrWhiteSpace(resume.Bio))
            {
                return "";
            }

            return $"<p class=\"bio\">{Escape(resume.Bio)}</p>";
        }

        public string BuildProfileImageHtml(Resume resume)
        {
            if (string.IsNullOrWhiteSpace(resume.ProfileImage))
            {
                return "<div class=\"image-box\">No Image</div>";
            }

            return $"<img src=\"images/{Escape(resume.ProfileImage)}\" alt=\"Profile Image\" class=\"profile-image\" />";
        }
        
        // -----------------------------
        // Experience
        // -----------------------------
        public string BuildExperienceHtml(Resume resume)
        {
            if (resume.Experiences.Count == 0)
            {
                return "<p><em>No work experience listed.</em></p>";
            }

            var sb = new StringBuilder();

            foreach (var exp in resume.Experiences)
            {
                sb.AppendLine("<div class=\"experience-item\">");
                sb.AppendLine($"  <h3>{Escape(exp.JobTitle)} — {Escape(exp.Company)}</h3>");
                sb.AppendLine($"  <p class=\"dates\">{Escape(exp.StartDate)} – {Escape(exp.EndDate)}</p>");
                sb.AppendLine($"  <p>{Escape(exp.Description)}</p>");
                sb.AppendLine("</div>");
            }

            return sb.ToString();
        }

        // -----------------------------
        // Projects
        // -----------------------------
        public string BuildProjectsHtml(Resume resume)
        {
            if (resume.Projects.Count == 0)
            {
                return "<p><em>No projects listed.</em></p>";
            }

            var sb = new StringBuilder();

            foreach (var proj in resume.Projects)
            {
                sb.AppendLine("<div class=\"project-item\">");
                sb.AppendLine($"  <h3>{Escape(proj.Title)}</h3>");
                sb.AppendLine($"  <p>{Escape(proj.Description)}</p>");

                if (proj.Technologies.Count > 0)
                {
                    sb.AppendLine(
                        $"  <p><strong>Tech:</strong> {Escape(string.Join(", ", proj.Technologies))}</p>"
                    );
                }

                sb.AppendLine("</div>");
            }

            return sb.ToString();
        }

        // -----------------------------
        // Helpers
        // -----------------------------
        private string Escape(string? input)
        {
            return WebUtility.HtmlEncode(input ?? "");
        }
    }
}
