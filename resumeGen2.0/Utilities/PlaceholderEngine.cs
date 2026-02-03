using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using ResumeSiteGenerator.Items;

namespace ResumeSiteGenerator.Utilities;

/// <summary>
/// Handles all placeholder replacement in templates.
/// Supports both simple {{PLACEHOLDER}} and loop {{#EACH items}}...{{/EACH}} syntax.
/// </summary>
public partial class PlaceholderEngine
{
    // ---------------------------------------------------------
    // Main Entry Point
    // ---------------------------------------------------------
    public string Process(string template, Resume resume)
    {
        var result = template;

        // Replace simple placeholders
        result = ReplaceSimplePlaceholders(result, resume);

        // Replace collection placeholders with generated HTML
        result = ReplaceCollectionPlaceholders(result, resume);

        return result;
    }

    // ---------------------------------------------------------
    // Simple Placeholders
    // ---------------------------------------------------------
    private string ReplaceSimplePlaceholders(string template, Resume resume)
    {
        var replacements = new Dictionary<string, string>
        {
            ["{{NAME}}"] = Escape(resume.Name),
            ["{{EMAIL}}"] = Escape(resume.Email),
            ["{{PHONE}}"] = Escape(resume.Phone),
            ["{{BIO}}"] = BuildBioHtml(resume),
            ["{{BIO_TEXT}}"] = Escape(resume.Bio),  // Raw text for use in attributes
            ["{{LOCATION}}"] = Escape(resume.Location),
            ["{{JOB_TITLE}}"] = Escape(resume.JobTitle),
            ["{{PROFILE_IMAGE}}"] = BuildProfileImageHtml(resume),
            ["{{YEAR}}"] = DateTime.Now.Year.ToString(),
            ["{{GENERATED_DATE}}"] = DateTime.Now.ToString("MMMM dd, yyyy"),
        };

        var result = template;
        foreach (var (placeholder, value) in replacements)
        {
            result = result.Replace(placeholder, value);
        }

        return result;
    }

    // ---------------------------------------------------------
    // Collection Placeholders
    // ---------------------------------------------------------
    private string ReplaceCollectionPlaceholders(string template, Resume resume)
    {
        var result = template;

        result = result.Replace("{{SKILLS}}", BuildSkillsHtml(resume));
        result = result.Replace("{{SKILLS_CATEGORIZED}}", BuildCategorizedSkillsHtml(resume));
        result = result.Replace("{{EXPERIENCE}}", BuildExperienceHtml(resume));
        result = result.Replace("{{EDUCATION}}", BuildEducationHtml(resume));
        result = result.Replace("{{EDUCATION_SUMMARY}}", BuildEducationSummaryHtml(resume));
        result = result.Replace("{{EDUCATION_DETAILED}}", BuildEducationDetailedHtml(resume));
        result = result.Replace("{{PROJECTS}}", BuildProjectsHtml(resume));
        result = result.Replace("{{SOCIAL_LINKS}}", BuildSocialLinksHtml(resume));
        result = result.Replace("{{SOCIAL_ICONS}}", BuildSocialIconsHtml(resume));

        return result;
    }

    // ---------------------------------------------------------
    // HTML Builders
    // ---------------------------------------------------------

    public string BuildBioHtml(Resume resume)
    {
        if (string.IsNullOrWhiteSpace(resume.Bio))
            return "";

        return $"<p class=\"bio\">{Escape(resume.Bio)}</p>";
    }

    public string BuildProfileImageHtml(Resume resume)
    {
        if (string.IsNullOrWhiteSpace(resume.ProfileImage))
            return "<div class=\"image-box\">No Image</div>";

        return $"<img src=\"images/{Escape(resume.ProfileImage)}\" alt=\"{Escape(resume.Name)} - Profile Photo\" class=\"profile-image\" loading=\"lazy\" />";
    }

    public string BuildSkillsHtml(Resume resume)
    {
        if (resume.Skills.Count == 0)
            return "<li><em>No skills listed.</em></li>";

        var sb = new StringBuilder();
        foreach (var skill in resume.Skills)
        {
            if (skill.ProficiencyPercent.HasValue)
            {
                sb.AppendLine($@"<li class=""skill-item"">
                    <span class=""skill-name"">{Escape(skill.Name)}</span>
                    <div class=""skill-bar"">
                        <div class=""skill-progress"" style=""width: {skill.ProficiencyPercent}%""></div>
                    </div>
                </li>");
            }
            else
            {
                sb.AppendLine($"<li>{Escape(skill.Name)}</li>");
            }
        }
        return sb.ToString();
    }

    public string BuildCategorizedSkillsHtml(Resume resume)
    {
        if (resume.Skills.Count == 0)
            return "<p><em>No skills listed.</em></p>";

        var grouped = resume.Skills.GroupBy(s => s.Category ?? "General");
        var sb = new StringBuilder();

        foreach (var group in grouped)
        {
            sb.AppendLine($"<div class=\"skill-category\">");
            sb.AppendLine($"  <h4>{Escape(group.Key)}</h4>");
            sb.AppendLine("  <ul class=\"skills-list\">");
            foreach (var skill in group)
            {
                sb.AppendLine($"    <li>{Escape(skill.Name)}</li>");
            }
            sb.AppendLine("  </ul>");
            sb.AppendLine("</div>");
        }

        return sb.ToString();
    }

    public string BuildExperienceHtml(Resume resume)
    {
        if (resume.Experiences.Count == 0)
            return "<p><em>No work experience listed.</em></p>";

        var sb = new StringBuilder();
        foreach (var exp in resume.Experiences)
        {
            sb.AppendLine("<div class=\"experience-item\">");
            sb.AppendLine($"  <h3>{Escape(exp.JobTitle)} — {Escape(exp.Company)}</h3>");
            sb.AppendLine($"  <p class=\"dates\">{Escape(exp.StartDate)} – {Escape(exp.EndDate)}</p>");
            sb.AppendLine($"  <p>{Escape(exp.Description)}</p>");

            if (exp.Highlights.Count > 0)
            {
                sb.AppendLine("  <ul class=\"highlights\">");
                foreach (var highlight in exp.Highlights)
                {
                    sb.AppendLine($"    <li>{Escape(highlight)}</li>");
                }
                sb.AppendLine("  </ul>");
            }

            sb.AppendLine("</div>");
        }
        return sb.ToString();
    }

    public string BuildEducationHtml(Resume resume) => BuildEducationDetailedHtml(resume);

    public string BuildEducationSummaryHtml(Resume resume)
    {
        if (resume.Education.Count == 0)
            return "<p><em>No education listed.</em></p>";

        var sb = new StringBuilder();
        foreach (var edu in resume.Education)
        {
            sb.AppendLine("<div class=\"education-summary\">");
            sb.AppendLine($"  <strong>{Escape(edu.Degree)}</strong> in {Escape(edu.Major)}<br>");
            sb.AppendLine($"  {Escape(edu.SchoolName)}");
            sb.AppendLine("</div>");
        }
        return sb.ToString();
    }

    public string BuildEducationDetailedHtml(Resume resume)
    {
        if (resume.Education.Count == 0)
            return "<p><em>No education listed.</em></p>";

        var sb = new StringBuilder();
        foreach (var edu in resume.Education)
        {
            sb.AppendLine("<div class=\"education-item\">");
            sb.AppendLine($"  <h3>{Escape(edu.Degree)} — {Escape(edu.Major)}</h3>");
            sb.AppendLine($"  <p class=\"school\">{Escape(edu.SchoolName)} ({Escape(edu.GraduationYear)})</p>");

            if (!string.IsNullOrWhiteSpace(edu.Description))
            {
                sb.AppendLine($"  <p>{Escape(edu.Description)}</p>");
            }

            sb.AppendLine("</div>");
        }
        return sb.ToString();
    }

    public string BuildProjectsHtml(Resume resume)
    {
        if (resume.Projects.Count == 0)
            return "<p><em>No projects listed.</em></p>";

        var sb = new StringBuilder();
        foreach (var proj in resume.Projects)
        {
            sb.AppendLine("<div class=\"project-item\">");

            // Title with optional link
            if (!string.IsNullOrWhiteSpace(proj.Url))
            {
                sb.AppendLine($"  <h3><a href=\"{Escape(proj.Url)}\" target=\"_blank\" rel=\"noopener\">{Escape(proj.Title)}</a></h3>");
            }
            else
            {
                sb.AppendLine($"  <h3>{Escape(proj.Title)}</h3>");
            }

            // Optional project image
            if (!string.IsNullOrWhiteSpace(proj.ImageFile))
            {
                sb.AppendLine($"  <img src=\"images/{Escape(proj.ImageFile)}\" alt=\"{Escape(proj.Title)}\" class=\"project-image\" loading=\"lazy\" />");
            }

            sb.AppendLine($"  <p>{Escape(proj.Description)}</p>");

            if (proj.Technologies.Count > 0)
            {
                sb.AppendLine("  <div class=\"tech-tags\">");
                foreach (var tech in proj.Technologies)
                {
                    sb.AppendLine($"    <span class=\"tag\">{Escape(tech)}</span>");
                }
                sb.AppendLine("  </div>");
            }

            sb.AppendLine("</div>");
        }
        return sb.ToString();
    }

    public string BuildSocialLinksHtml(Resume resume)
    {
        if (resume.SocialLinks.Count == 0)
            return "";

        var sb = new StringBuilder();
        sb.AppendLine("<div class=\"social-links\">");

        foreach (var link in resume.SocialLinks)
        {
            var displayText = link.DisplayText ?? link.Platform;
            sb.AppendLine($"  <a href=\"{Escape(link.Url)}\" class=\"social-link social-{Escape(link.Platform.ToLower())}\" target=\"_blank\" rel=\"noopener\">{Escape(displayText)}</a>");
        }

        sb.AppendLine("</div>");
        return sb.ToString();
    }

    public string BuildSocialIconsHtml(Resume resume)
    {
        if (resume.SocialLinks.Count == 0)
            return "";

        var sb = new StringBuilder();
        sb.AppendLine("<div class=\"social-icons\">");

        foreach (var link in resume.SocialLinks)
        {
            var icon = GetSocialIcon(link.Platform);
            sb.AppendLine($"  <a href=\"{Escape(link.Url)}\" class=\"social-icon\" title=\"{Escape(link.Platform)}\" target=\"_blank\" rel=\"noopener\" aria-label=\"{Escape(link.Platform)}\">{icon}</a>");
        }

        sb.AppendLine("</div>");
        return sb.ToString();
    }

    // ---------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------

    private static string Escape(string? input) =>
        WebUtility.HtmlEncode(input ?? "");

    private static string GetSocialIcon(string platform) => platform.ToLower() switch
    {
        "github" => "&#128187;",      // 💻
        "linkedin" => "&#128188;",    // 💼
        "twitter" => "&#128038;",     // 🐦
        "email" => "&#9993;",         // ✉
        "website" => "&#127760;",     // 🌐
        _ => "&#128279;"              // 🔗
    };
}
