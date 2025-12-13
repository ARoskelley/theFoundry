namespace ResumeSiteGenerator.Items
{
    public class EducationItem
{
    public string SchoolName { get; }
    public string Degree { get; }
    public string Major { get; }
    public string GraduationYear { get; }
    public string Description { get; }

    public EducationItem(
        string schoolName,
        string degree,
        string major,
        string graduationYear,
        string description = ""
    )
    {
        SchoolName = schoolName;
        Degree = degree;
        Major = major;
        GraduationYear = graduationYear;
        Description = description;
    }
}

}
