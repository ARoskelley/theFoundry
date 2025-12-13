using ResumeSiteGenerator.Items;

namespace ResumeSiteGenerator.Input
{
    public class FullResumeBuilder : ResumeBuilderBase
    {
        public override Resume BuildResume()
        {
            Console.WriteLine("\n--- Full Resume Build ---");

            var resume = new Resume(
                Prompt("Name: "),
                Prompt("Email: "),
                Prompt("Phone: ")
            );

            BuildSkills(resume);
            BuildEducation(resume);
            BuildExperience(resume);
            BuildProjects(resume);

            return resume;
        }

        private void BuildSkills(Resume resume)
        {
            if (!Confirm("Add skills? (y/n): ")) return;

            while (true)
            {
                resume.AddSkill(Prompt("Skill: "));
                if (!Confirm("Add another skill? (y/n): ")) break;
            }
        }

        private void BuildEducation(Resume resume)
        {
            if (!Confirm("Add education? (y/n): ")) return;

            while (true)
            {
                resume.AddEducation(new EducationItem(
                    Prompt("School: "),
                    Prompt("Degree: "),
                    Prompt("Graduation Year: ")
                ));

                if (!Confirm("Add another education entry? (y/n): ")) break;
            }
        }

        private void BuildExperience(Resume resume)
        {
            if (!Confirm("Add work experience? (y/n): ")) return;

            while (true)
            {
                resume.AddExperience(new ExperienceItem(
                    Prompt("Job Title: "),
                    Prompt("Company: "),
                    Prompt("Description: "),
                    Prompt("Start Date: "),
                    Prompt("End Date: ")
                ));

                if (!Confirm("Add another job? (y/n): ")) break;
            }
        }

        private void BuildProjects(Resume resume)
        {
            if (!Confirm("Add projects? (y/n): ")) return;

            while (true)
            {
                var project = new ProjectItem(
                    Prompt("Project Title: "),
                    Prompt("Description: ")
                );

                if (Confirm("Add technologies? (y/n): "))
                {
                    while (true)
                    {
                        project.AddTechnology(Prompt("Technology: "));
                        if (!Confirm("Add another technology? (y/n): ")) break;
                    }
                }

                resume.AddProject(project);

                if (!Confirm("Add another project? (y/n): ")) break;
            }
        }
    }
}
