using System;
using ResumeSiteGenerator.Items;

namespace ResumeSiteGenerator.Input
{
    public class FullResumeBuilder : IResumeBuilder
    {
        private Resume _resume;

        public FullResumeBuilder()
        {
            _resume = new Resume();
        }

        public Resume Run()
        {
            bool running = true;

            while (running)
            {
                Console.Clear();
                ShowMenu();

                switch (Prompt("Choose an option: "))
                {
                    case "1":
                        BuildPersonalInfo();
                        break;
                    case "2":
                        BuildExperience();
                        break;
                    case "3":
                        BuildEducation();
                        break;
                    case "4":
                        BuildProjects();
                        break;
                    case "5":
                        ShowSummary();
                        break;
                    case "6":
                        running = false;
                        break;
                    case "0":
                        Environment.Exit(0);
                        break;
                    default:
                        Pause("Invalid choice.");
                        break;
                }
            }

            return _resume;
        }

        /* =========================
           Menu
           ========================= */
        private void ShowMenu()
        {
            Console.WriteLine("=== Full Resume Builder ===\n");
            Console.WriteLine("1. Personal Information");
            Console.WriteLine("2. Experience");
            Console.WriteLine("3. Education");
            Console.WriteLine("4. Projects");
            Console.WriteLine("5. Review Summary");
            Console.WriteLine("6. Generate Website");
            Console.WriteLine("0. Exit\n");
        }

        /* =========================
           Sections
           ========================= */
        private void BuildPersonalInfo()
        {
            Console.Clear();
            Console.WriteLine("=== Personal Information ===\n");

            _resume.SetName(Prompt("Name: "));
            _resume.SetEmail(Prompt("Email: "));
            _resume.SetPhone(Prompt("Phone: "));

            if (Confirm("Add or update bio? (y/n): "))
            {
                _resume.SetBio(Prompt("Bio: "));
            }

            if (Confirm("Add or update profile image? (y/n): "))
            {
                _resume.SetProfileImage(
                    Prompt("Image file name (e.g. profile.jpg): ")
                );
            }

            Pause("Personal information updated.");
        }

        private void BuildExperience()
        {
            Console.Clear();
            Console.WriteLine("=== Experience ===\n");

            if (_resume.Experiences.Count > 0 &&
                Confirm("Clear existing experience entries? (y/n): "))
            {
                _resume.ClearExperience();
            }

            do
            {
                _resume.AddExperience(new ExperienceItem(
                Prompt("Job Title: "),
                Prompt("Company: "),
                Prompt("Description: "),
                Prompt("Start Date (e.g. March 2025): "),
                Prompt("End Date (e.g. September 2025 or Present): ")
            ));

            }
            while (Confirm("Add another experience? (y/n): "));

            Pause("Experience updated.");
        }

        private void BuildEducation()
        {
            Console.Clear();
            Console.WriteLine("=== Education ===\n");

            if (_resume.Education.Count > 0 &&
                Confirm("Clear existing education entries? (y/n): "))
            {
                _resume.ClearEducation();
            }

            do
            {
                string description = "";

                if (Confirm("Add detailed education description? (y/n): "))
                {
                    description = Prompt("Description: ");
                }

                _resume.AddEducation(new EducationItem(
                    Prompt("School: "),
                    Prompt("Degree: "),
                    Prompt("Major: "),
                    Prompt("Graduation Year: "),
                    description
                ));
            }
            while (Confirm("Add another education entry? (y/n): "));

            Pause("Education updated.");
        }

        private void BuildProjects()
        {
            Console.Clear();
            Console.WriteLine("=== Projects ===\n");

            if (_resume.Projects.Count > 0 &&
                Confirm("Clear existing project entries? (y/n): "))
            {
                _resume.ClearProjects();
            }

            do
            {
                _resume.AddProject(new ProjectItem(
                    Prompt("Project Name: "),
                    Prompt("Description: ")
                ));
            }
            while (Confirm("Add another project? (y/n): "));

            Pause("Projects updated.");
        }

        private void ShowSummary()
        {
            Console.Clear();
            Console.WriteLine("=== Resume Summary ===\n");

            Console.WriteLine($"Name: {_resume.Name}");
            Console.WriteLine($"Email: {_resume.Email}");
            Console.WriteLine($"Phone: {_resume.Phone}\n");

            Console.WriteLine($"Experience entries: {_resume.Experiences.Count}");
            Console.WriteLine($"Education entries: {_resume.Education.Count}");
            Console.WriteLine($"Projects: {_resume.Projects.Count}");

            Pause();
        }

        /* =========================
           Helpers
           ========================= */
        private string Prompt(string message)
        {
            Console.Write(message);
            return Console.ReadLine()?.Trim() ?? "";
        }

        private bool Confirm(string message)
        {
            Console.Write(message);
            return (Console.ReadLine() ?? "").Trim().ToLower() == "y";
        }

        private void Pause(string message = "Press Enter to continue...")
        {
            Console.WriteLine($"\n{message}");
            Console.ReadLine();
        }
        public Resume Build()
        {
            return Run();
        }

    }
}
