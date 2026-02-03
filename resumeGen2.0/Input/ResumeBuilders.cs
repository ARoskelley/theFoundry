using ResumeSiteGenerator.Items;
using ResumeSiteGenerator.Utilities;

namespace ResumeSiteGenerator.Input;

/// <summary>
/// Interface for resume building strategies.
/// </summary>
public interface IResumeBuilder
{
    Resume Build();
}

/// <summary>
/// Quick build mode - minimal prompts for fast resume creation.
/// </summary>
public class QuickResumeBuilder : IResumeBuilder
{
    public Resume Build()
    {
        ConsoleUI.WriteSection("Quick Resume Build");

        var resume = new Resume
        {
            Name = ConsoleUI.PromptRequired("Name"),
            Email = ConsoleUI.PromptRequired("Email"),
            Phone = ConsoleUI.PromptRequired("Phone"),
            JobTitle = ConsoleUI.Prompt("Job Title (e.g., 'Software Developer')", ""),
            Location = ConsoleUI.Prompt("Location (e.g., 'Rexburg, ID')", ""),
            ProfileImage = ConsoleUI.Prompt("Profile image filename (leave blank to skip)", ""),
            Bio = ConsoleUI.Prompt("Short bio (1-2 sentences)", "")
        };

        // Skills
        var skills = ConsoleUI.PromptList("Skills");
        foreach (var skill in skills)
        {
            resume.AddSkill(skill);
        }

        // Quick education
        if (ConsoleUI.Confirm("Add education?"))
        {
            resume.AddEducation(new EducationItem(
                ConsoleUI.PromptRequired("School"),
                ConsoleUI.PromptRequired("Degree"),
                ConsoleUI.Prompt("Major", ""),
                ConsoleUI.PromptRequired("Graduation Year")
            ));
        }

        // Quick experience
        if (ConsoleUI.Confirm("Add work experience?"))
        {
            resume.AddExperience(new ExperienceItem(
                ConsoleUI.PromptRequired("Job Title"),
                ConsoleUI.PromptRequired("Company"),
                ConsoleUI.Prompt("Description", ""),
                ConsoleUI.PromptRequired("Start Date"),
                ConsoleUI.Prompt("End Date", "Present")
            ));
        }

        // Quick project
        if (ConsoleUI.Confirm("Add a project?"))
        {
            var techs = ConsoleUI.PromptList("Technologies used");
            resume.AddProject(new ProjectItem(
                ConsoleUI.PromptRequired("Project Name"),
                ConsoleUI.Prompt("Description", ""),
                techs,
                ConsoleUI.Prompt("Project URL (optional)", null)
            ));
        }

        // Social links
        if (ConsoleUI.Confirm("Add social links?"))
        {
            var github = ConsoleUI.Prompt("GitHub URL (blank to skip)", "");
            if (!string.IsNullOrWhiteSpace(github))
                resume.AddSocialLink("github", github);

            var linkedin = ConsoleUI.Prompt("LinkedIn URL (blank to skip)", "");
            if (!string.IsNullOrWhiteSpace(linkedin))
                resume.AddSocialLink("linkedin", linkedin);
        }

        return resume;
    }
}

/// <summary>
/// Full build mode - guided, detailed resume creation with menu system.
/// </summary>
public class FullResumeBuilder : IResumeBuilder
{
    private Resume _resume = new();

    public Resume Build()
    {
        bool running = true;

        while (running)
        {
            ConsoleUI.Clear();
            ShowMenu();

            var choice = ConsoleUI.Prompt("Choose an option");

            switch (choice)
            {
                case "1": BuildPersonalInfo(); break;
                case "2": BuildExperience(); break;
                case "3": BuildEducation(); break;
                case "4": BuildProjects(); break;
                case "5": BuildSkills(); break;
                case "6": BuildSocialLinks(); break;
                case "7": ShowSummary(); break;
                case "8": running = false; break;
                case "0": Environment.Exit(0); break;
                default:
                    ConsoleUI.WriteWarning("Invalid choice.");
                    ConsoleUI.Pause();
                    break;
            }
        }

        return _resume;
    }

    private void ShowMenu()
    {
        ConsoleUI.WriteHeader("Full Resume Builder");

        var completeness = GetCompletenessIndicators();

        Console.WriteLine("  1. Personal Information  " + completeness["personal"]);
        Console.WriteLine("  2. Work Experience       " + completeness["experience"]);
        Console.WriteLine("  3. Education             " + completeness["education"]);
        Console.WriteLine("  4. Projects              " + completeness["projects"]);
        Console.WriteLine("  5. Skills                " + completeness["skills"]);
        Console.WriteLine("  6. Social Links          " + completeness["social"]);
        Console.WriteLine("  7. Review Summary");
        Console.WriteLine("  8. Generate Website →");
        Console.WriteLine("  0. Exit");
        Console.WriteLine();
    }

    private Dictionary<string, string> GetCompletenessIndicators()
    {
        return new Dictionary<string, string>
        {
            ["personal"] = !string.IsNullOrWhiteSpace(_resume.Name) ? "✓" : "",
            ["experience"] = _resume.Experiences.Count > 0 ? $"({_resume.Experiences.Count})" : "",
            ["education"] = _resume.Education.Count > 0 ? $"({_resume.Education.Count})" : "",
            ["projects"] = _resume.Projects.Count > 0 ? $"({_resume.Projects.Count})" : "",
            ["skills"] = _resume.Skills.Count > 0 ? $"({_resume.Skills.Count})" : "",
            ["social"] = _resume.SocialLinks.Count > 0 ? $"({_resume.SocialLinks.Count})" : ""
        };
    }

    private void BuildPersonalInfo()
    {
        ConsoleUI.Clear();
        ConsoleUI.WriteSection("Personal Information");

        _resume.Name = ConsoleUI.Prompt("Name", _resume.Name);
        _resume.Email = ConsoleUI.Prompt("Email", _resume.Email);
        _resume.Phone = ConsoleUI.Prompt("Phone", _resume.Phone);
        _resume.JobTitle = ConsoleUI.Prompt("Job Title", _resume.JobTitle);
        _resume.Location = ConsoleUI.Prompt("Location", _resume.Location);

        if (ConsoleUI.Confirm("Update bio?", !string.IsNullOrWhiteSpace(_resume.Bio)))
        {
            _resume.Bio = ConsoleUI.Prompt("Bio");
        }

        if (ConsoleUI.Confirm("Update profile image?"))
        {
            _resume.ProfileImage = ConsoleUI.Prompt("Image filename (e.g., profile.jpg)");
        }

        ConsoleUI.WriteSuccess("Personal information updated.");
        ConsoleUI.Pause();
    }

    private void BuildExperience()
    {
        ConsoleUI.Clear();
        ConsoleUI.WriteSection("Work Experience");

        if (_resume.Experiences.Count > 0)
        {
            Console.WriteLine($"Current entries: {_resume.Experiences.Count}");
            ConsoleUI.WriteList(_resume.Experiences.Select(e => $"{e.JobTitle} at {e.Company}"));

            if (ConsoleUI.Confirm("Clear existing entries?"))
            {
                _resume.Experiences.Clear();
            }
        }

        do
        {
            Console.WriteLine();
            var highlights = new List<string>();

            var exp = new ExperienceItem(
                ConsoleUI.PromptRequired("Job Title"),
                ConsoleUI.PromptRequired("Company"),
                ConsoleUI.Prompt("Description", ""),
                ConsoleUI.PromptRequired("Start Date"),
                ConsoleUI.Prompt("End Date", "Present"),
                ConsoleUI.PromptList("Key achievements/highlights")
            );

            _resume.AddExperience(exp);
            ConsoleUI.WriteSuccess("Experience added.");

        } while (ConsoleUI.Confirm("Add another experience?"));

        ConsoleUI.Pause();
    }

    private void BuildEducation()
    {
        ConsoleUI.Clear();
        ConsoleUI.WriteSection("Education");

        if (_resume.Education.Count > 0)
        {
            Console.WriteLine($"Current entries: {_resume.Education.Count}");
            ConsoleUI.WriteList(_resume.Education.Select(e => $"{e.Degree} from {e.SchoolName}"));

            if (ConsoleUI.Confirm("Clear existing entries?"))
            {
                _resume.Education.Clear();
            }
        }

        do
        {
            Console.WriteLine();
            var description = "";

            if (ConsoleUI.Confirm("Add detailed description?"))
            {
                description = ConsoleUI.Prompt("Description");
            }

            _resume.AddEducation(new EducationItem(
                ConsoleUI.PromptRequired("School"),
                ConsoleUI.PromptRequired("Degree"),
                ConsoleUI.Prompt("Major", ""),
                ConsoleUI.PromptRequired("Graduation Year"),
                description
            ));

            ConsoleUI.WriteSuccess("Education added.");

        } while (ConsoleUI.Confirm("Add another education entry?"));

        ConsoleUI.Pause();
    }

    private void BuildProjects()
    {
        ConsoleUI.Clear();
        ConsoleUI.WriteSection("Projects");

        if (_resume.Projects.Count > 0)
        {
            Console.WriteLine($"Current entries: {_resume.Projects.Count}");
            ConsoleUI.WriteList(_resume.Projects.Select(p => p.Title));

            if (ConsoleUI.Confirm("Clear existing entries?"))
            {
                _resume.Projects.Clear();
            }
        }

        do
        {
            Console.WriteLine();

            var project = new ProjectItem(
                ConsoleUI.PromptRequired("Project Name"),
                ConsoleUI.Prompt("Description", ""),
                ConsoleUI.PromptList("Technologies"),
                ConsoleUI.Prompt("Project URL (optional)", null),
                ConsoleUI.Prompt("Screenshot filename (optional)", null)
            );

            _resume.AddProject(project);
            ConsoleUI.WriteSuccess("Project added.");

        } while (ConsoleUI.Confirm("Add another project?"));

        ConsoleUI.Pause();
    }

    private void BuildSkills()
    {
        ConsoleUI.Clear();
        ConsoleUI.WriteSection("Skills");

        if (_resume.Skills.Count > 0)
        {
            Console.WriteLine($"Current skills: {_resume.Skills.Count}");
            ConsoleUI.WriteList(_resume.Skills.Select(s =>
                s.Category != null ? $"{s.Name} ({s.Category})" : s.Name));

            if (ConsoleUI.Confirm("Clear existing skills?"))
            {
                _resume.Skills.Clear();
            }
        }

        Console.WriteLine("\nYou can add skills one at a time or as a comma-separated list.");

        var quickAdd = ConsoleUI.Confirm("Quick add (comma-separated list)?", true);

        if (quickAdd)
        {
            var category = ConsoleUI.Prompt("Category for these skills (blank for none)", "");
            var skills = ConsoleUI.PromptList("Skills");

            foreach (var skill in skills)
            {
                _resume.AddSkill(skill, string.IsNullOrWhiteSpace(category) ? null : category);
            }

            ConsoleUI.WriteSuccess($"Added {skills.Count} skills.");
        }
        else
        {
            do
            {
                var name = ConsoleUI.PromptRequired("Skill name");
                var category = ConsoleUI.Prompt("Category (optional)", null);

                int? proficiency = null;
                if (ConsoleUI.Confirm("Add proficiency level?"))
                {
                    var profStr = ConsoleUI.Prompt("Proficiency (0-100)", "75");
                    if (int.TryParse(profStr, out int prof))
                        proficiency = Math.Clamp(prof, 0, 100);
                }

                _resume.AddSkill(name, category, proficiency);
                ConsoleUI.WriteSuccess("Skill added.");

            } while (ConsoleUI.Confirm("Add another skill?"));
        }

        ConsoleUI.Pause();
    }

    private void BuildSocialLinks()
    {
        ConsoleUI.Clear();
        ConsoleUI.WriteSection("Social Links");

        if (_resume.SocialLinks.Count > 0)
        {
            Console.WriteLine($"Current links: {_resume.SocialLinks.Count}");
            ConsoleUI.WriteList(_resume.SocialLinks.Select(s => $"{s.Platform}: {s.Url}"));

            if (ConsoleUI.Confirm("Clear existing links?"))
            {
                _resume.SocialLinks.Clear();
            }
        }

        Console.WriteLine("\nCommon platforms:");
        var platforms = new[] { "github", "linkedin", "twitter", "website", "other" };

        do
        {
            var platformIndex = ConsoleUI.PromptChoice("Select platform:", platforms.ToList());
            var platform = platforms[platformIndex];

            if (platform == "other")
            {
                platform = ConsoleUI.PromptRequired("Platform name");
            }

            var url = ConsoleUI.PromptRequired("URL");
            var displayText = ConsoleUI.Prompt("Display text (optional)", null);

            _resume.AddSocialLink(platform, url, displayText);
            ConsoleUI.WriteSuccess("Social link added.");

        } while (ConsoleUI.Confirm("Add another link?"));

        ConsoleUI.Pause();
    }

    private void ShowSummary()
    {
        ConsoleUI.Clear();
        ConsoleUI.WriteSection("Resume Summary");

        Console.WriteLine($"Name:       {_resume.Name}");
        Console.WriteLine($"Email:      {_resume.Email}");
        Console.WriteLine($"Phone:      {_resume.Phone}");
        Console.WriteLine($"Job Title:  {_resume.JobTitle}");
        Console.WriteLine($"Location:   {_resume.Location}");
        Console.WriteLine();
        Console.WriteLine($"Experience: {_resume.Experiences.Count} entries");
        Console.WriteLine($"Education:  {_resume.Education.Count} entries");
        Console.WriteLine($"Projects:   {_resume.Projects.Count} entries");
        Console.WriteLine($"Skills:     {_resume.Skills.Count} skills");
        Console.WriteLine($"Social:     {_resume.SocialLinks.Count} links");

        var errors = _resume.Validate();
        if (errors.Count > 0)
        {
            Console.WriteLine();
            ConsoleUI.WriteWarning("Validation issues:");
            ConsoleUI.WriteList(errors, "!");
        }
        else
        {
            Console.WriteLine();
            ConsoleUI.WriteSuccess("Resume is valid and ready to generate!");
        }

        ConsoleUI.Pause();
    }
}

/// <summary>
/// Loads an existing resume from a JSON file.
/// </summary>
public class JsonResumeLoader : IResumeBuilder
{
    private readonly string _filePath;

    public JsonResumeLoader(string filePath)
    {
        _filePath = filePath;
    }

    public Resume Build()
    {
        ConsoleUI.WriteInfo($"Loading resume from: {_filePath}");
        return Resume.LoadFromFile(_filePath);
    }
}
