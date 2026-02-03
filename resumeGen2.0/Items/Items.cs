namespace ResumeSiteGenerator.Items;

/// <summary>
/// Represents a work experience entry. Using records for immutability and built-in equality.
/// </summary>
public record ExperienceItem(
    string JobTitle,
    string Company,
    string Description,
    string StartDate,
    string EndDate,
    List<string> Highlights = null!
)
{
    public List<string> Highlights { get; init; } = Highlights ?? new();
}

/// <summary>
/// Represents an education entry.
/// </summary>
public record EducationItem(
    string SchoolName,
    string Degree,
    string Major,
    string GraduationYear,
    string Description = ""
);

/// <summary>
/// Represents a portfolio project.
/// </summary>
public record ProjectItem(
    string Title,
    string Description,
    List<string> Technologies = null!,
    string? Url = null,
    string? ImageFile = null
)
{
    public List<string> Technologies { get; init; } = Technologies ?? new();
}

/// <summary>
/// Represents a social media or professional link.
/// </summary>
public record SocialLink(
    string Platform,
    string Url,
    string? DisplayText = null
)
{
    // Common platforms for icon/styling purposes
    public static class Platforms
    {
        public const string GitHub = "github";
        public const string LinkedIn = "linkedin";
        public const string Twitter = "twitter";
        public const string Website = "website";
        public const string Email = "email";
    }
}

/// <summary>
/// Represents a skill with optional proficiency level.
/// </summary>
public record Skill(
    string Name,
    string? Category = null,
    int? ProficiencyPercent = null  // 0-100, optional
);
