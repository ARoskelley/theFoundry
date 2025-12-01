namespace ResumeSiteGenerator.Items
{
    public class ExperienceItem
    {
        private string _jobTitle;
        private string _company;
        private string _description;
        private string _startDate;
        private string _endDate;

        public string JobTitle => _jobTitle;
        public string Company => _company;
        public string Description => _description;
        public string StartDate => _startDate;
        public string EndDate => _endDate;

        public ExperienceItem(string jobTitle, string company, string description,
                              string startDate, string endDate)
        {
            _jobTitle = jobTitle;
            _company = company;
            _description = description;
            _startDate = startDate;
            _endDate = endDate;
        }
    }
}
