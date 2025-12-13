using ResumeSiteGenerator.Items;

namespace ResumeSiteGenerator.Input
{
    public class QuickResumeBuilder : ResumeBuilderBase
    {
        public override Resume Build()
        {
            Console.WriteLine("\n--- Quick Resume Build ---");

            var resume = new Resume(
                Prompt("Name: "),
                Prompt("Email: "),
                Prompt("Phone: ")
            );
            
            Console.Write("Profile image file name (leave blank to skip): ");
            string image = Console.ReadLine() ?? "";
            resume.SetProfileImage(image);

            // Skills
            Console.Write("Skills (comma-separated): ");
            foreach (var skill in (Console.ReadLine() ?? "")
                     .Split(',', StringSplitOptions.RemoveEmptyEntries))
            {
                resume.AddSkill(skill.Trim());
            }

            // Education (single entry)
            if (Confirm("Add education? (y/n): "))
            {
                resume.AddEducation(new EducationItem(
                    Prompt("School: "),
                    Prompt("Degree: "),
                    Prompt("Graduation Year: "),
                    Prompt("Description:")
                ));
            }

            // Experience (single entry)
            if (Confirm("Add experience? (y/n): "))
            {
                resume.AddExperience(new ExperienceItem(
                    Prompt("Job Title: "),
                    Prompt("Company: "),
                    Prompt("Description: "),
                    Prompt("Start Date: "),
                    Prompt("End Date: ")
                ));
            }

            // Bio (maybe)
            Console.Write("Add a short bio? (y/n): ");
            if (Confirm(""))
            {
                resume.SetBio(Prompt("Bio: "));
            }

            // Project (single entry)
            if (Confirm("Add project? (y/n): "))
            {
                var project = new ProjectItem(
                    Prompt("Project Title: "),
                    Prompt("Description: ")
                );

                Console.Write("Technologies (comma-separated): ");
                foreach (var tech in (Console.ReadLine() ?? "")
                         .Split(',', StringSplitOptions.RemoveEmptyEntries))
                {
                    project.AddTechnology(tech.Trim());
                }

                resume.AddProject(project);
            }

            return resume;
        }
    }
}
