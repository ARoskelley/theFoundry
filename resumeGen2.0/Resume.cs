using System.Text.Json;
using System.Text.Json.Serialization;
using ResumeSiteGenerator.Items;

namespace ResumeSiteGenerator;

/// <summary>
/// The main Resume data model. Supports JSON serialization for save/load functionality.
/// </summary>
public class Resume
{
    // Personal Info
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Bio { get; set; } = "";
    public string ProfileImage { get; set; } = "";
    public string Location { get; set; } = "";
    public string JobTitle { get; set; } = "";  // e.g., "Software Developer"

    // Collections
    public List<Skill> Skills { get; set; } = new();
    public List<ExperienceItem> Experiences { get; set; } = new();
    public List<EducationItem> Education { get; set; } = new();
    public List<ProjectItem> Projects { get; set; } = new();
    public List<SocialLink> SocialLinks { get; set; } = new();

    // Metadata
    public DateTime LastModified { get; set; } = DateTime.Now;
    public string? PreferredTemplate { get; set; }

    // ---------------------------------------------------------
    // JSON Serialization
    // ---------------------------------------------------------
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public string ToJson() => JsonSerializer.Serialize(this, JsonOptions);

    public static Resume FromJson(string json) =>
        JsonSerializer.Deserialize<Resume>(json, JsonOptions) 
        ?? throw new InvalidOperationException("Failed to deserialize resume JSON.");

    public void SaveToFile(string path)
    {
        LastModified = DateTime.Now;
        File.WriteAllText(path, ToJson());
    }

    public static Resume LoadFromFile(string path)
    {
        if (!File.Exists(path))
            throw new FileNotFoundException($"Resume file not found: {path}");

        return FromJson(File.ReadAllText(path));
    }

    // ---------------------------------------------------------
    // Validation
    // ---------------------------------------------------------
    public List<string> Validate()
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(Name))
            errors.Add("Name is required.");

        if (string.IsNullOrWhiteSpace(Email))
            errors.Add("Email is required.");
        else if (!Email.Contains('@'))
            errors.Add("Email appears to be invalid.");

        if (string.IsNullOrWhiteSpace(Phone))
            errors.Add("Phone is required.");

        return errors;
    }

    public bool IsValid => Validate().Count == 0;

    // ---------------------------------------------------------
    // Builder-style methods for fluent construction
    // ---------------------------------------------------------
    public Resume WithName(string name) { Name = name; return this; }
    public Resume WithEmail(string email) { Email = email; return this; }
    public Resume WithPhone(string phone) { Phone = phone; return this; }
    public Resume WithBio(string bio) { Bio = bio; return this; }
    public Resume WithProfileImage(string image) { ProfileImage = image; return this; }
    public Resume WithLocation(string location) { Location = location; return this; }
    public Resume WithJobTitle(string title) { JobTitle = title; return this; }

    public Resume AddSkill(string name, string? category = null, int? proficiency = null)
    {
        Skills.Add(new Skill(name, category, proficiency));
        return this;
    }

    public Resume AddExperience(ExperienceItem exp)
    {
        Experiences.Add(exp);
        return this;
    }

    public Resume AddEducation(EducationItem edu)
    {
        Education.Add(edu);
        return this;
    }

    public Resume AddProject(ProjectItem project)
    {
        Projects.Add(project);
        return this;
    }

    public Resume AddSocialLink(string platform, string url, string? displayText = null)
    {
        SocialLinks.Add(new SocialLink(platform, url, displayText));
        return this;
    }
}
