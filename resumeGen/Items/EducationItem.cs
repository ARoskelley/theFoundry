namespace ResumeSiteGenerator.Items
{
    public class EducationItem
    {
        private string _schoolName;
        private string _degree;
        private string _graduationYear;

        public string SchoolName => _schoolName;
        public string Degree => _degree;
        public string GraduationYear => _graduationYear;

        public EducationItem(string schoolName, string degree, string graduationYear)
        {
            _schoolName = schoolName;
            _degree = degree;
            _graduationYear = graduationYear;
        }
    }
}
