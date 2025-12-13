using System.Collections.Generic;
using ResumeSiteGenerator.Items;

namespace ResumeSiteGenerator
{
    public class Resume
    {
        private string _name;
        private string _email;
        private string _phone;

        private List<string> _skills;
        private List<ExperienceItem> _experiences;
        private List<EducationItem> _educationItems;
        private List<ProjectItem> _projectItems;

        public string Name => _name;
        public string Email => _email;
        public string Phone => _phone;

        public IReadOnlyList<string> Skills => _skills;
        public IReadOnlyList<ExperienceItem> Experiences => _experiences;
        public IReadOnlyList<EducationItem> Education => _educationItems;
        public IReadOnlyList<ProjectItem> Projects => _projectItems;
        public string Bio { get; private set; } = "";
        public string ProfileImage { get; private set; } = "";
        public void ClearExperience() => _experiences.Clear();
        public void ClearEducation() => _educationItems.Clear();
        public void ClearProjects() => _projectItems.Clear();

        public Resume()
        {
            _name = "";
            _email = "";
            _phone = "";

            _skills = new List<string>();
            _experiences = new List<ExperienceItem>();
            _educationItems = new List<EducationItem>();
            _projectItems = new List<ProjectItem>();
        }

        public Resume(string name, string email, string phone) : this()
        {
            _name = name;
            _email = email;
            _phone = phone;
        }



        public void SetBio(string bio)
        {
            Bio = bio ?? "";
        }
        public void SetProfileImage(string imageFileName)
        {
            ProfileImage = imageFileName?.Trim() ?? "";
        }
        public void SetName(string name)
        {
            _name = name ?? "";
        }

        public void SetEmail(string email)
        {
            _email = email ?? "";
        }

        public void SetPhone(string phone)
        {
            _phone = phone ?? "";
        }


        public void AddSkill(string skill) => _skills.Add(skill);
        public void AddExperience(ExperienceItem exp) => _experiences.Add(exp);
        public void AddEducation(EducationItem edu) => _educationItems.Add(edu);
        public void AddProject(ProjectItem project) => _projectItems.Add(project);
    }
}
