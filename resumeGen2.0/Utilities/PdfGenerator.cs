using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace ResumeSiteGenerator.Utilities;

/// <summary>
/// Generates a professional one-page PDF resume using QuestPDF.
/// </summary>
public class PdfGenerator
{
    // Color scheme matching Modern template
    private static readonly string AccentColor = "#2563eb";
    private static readonly string TextColor = "#1f2937";
    private static readonly string MutedColor = "#6b7280";
    private static readonly string LightBg = "#f5f7fb";

    public void Generate(Resume resume, string outputPath)
    {
        // QuestPDF requires license acknowledgment (free for personal/commercial use)
        QuestPDF.Settings.License = LicenseType.Community;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.Letter);
                page.MarginVertical(0.5f, Unit.Inch);
                page.MarginHorizontal(0.5f, Unit.Inch);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(TextColor));

                page.Header().Element(c => ComposeHeader(c, resume));
                page.Content().Element(c => ComposeContent(c, resume));
                page.Footer().Element(ComposeFooter);
            });
        });

        document.GeneratePdf(outputPath);
    }

    private void ComposeHeader(IContainer container, Resume resume)
    {
        container.Column(column =>
        {
            column.Spacing(5);

            // Name
            column.Item().Text(resume.Name)
                .FontSize(24)
                .Bold()
                .FontColor(AccentColor);

            // Job Title
            if (!string.IsNullOrWhiteSpace(resume.JobTitle))
            {
                column.Item().Text(resume.JobTitle)
                    .FontSize(14)
                    .FontColor(MutedColor);
            }

            // Contact Row
            column.Item().Row(row =>
            {
                var contactParts = new List<string>();

                if (!string.IsNullOrWhiteSpace(resume.Email))
                    contactParts.Add(resume.Email);
                if (!string.IsNullOrWhiteSpace(resume.Phone))
                    contactParts.Add(resume.Phone);
                if (!string.IsNullOrWhiteSpace(resume.Location))
                    contactParts.Add(resume.Location);

                row.RelativeItem().Text(string.Join("  •  ", contactParts))
                    .FontSize(9)
                    .FontColor(MutedColor);
            });

            // Social Links
            if (resume.SocialLinks.Count > 0)
            {
                var links = resume.SocialLinks
                    .Where(s => s.Platform.ToLower() != "email")
                    .Select(s => s.Url)
                    .Take(3);

                if (links.Any())
                {
                    column.Item().Text(string.Join("  |  ", links))
                        .FontSize(8)
                        .FontColor(AccentColor);
                }
            }

            // Divider
            column.Item().PaddingTop(10).LineHorizontal(1).LineColor(AccentColor);
        });
    }

    private void ComposeContent(IContainer container, Resume resume)
    {
        container.PaddingTop(10).Row(row =>
        {
            // Left Column (Main Content) - 65%
            row.RelativeItem(65).Column(col =>
            {
                // Summary/Bio
                if (!string.IsNullOrWhiteSpace(resume.Bio))
                {
                    col.Item().Element(c => ComposeSection(c, "Summary", content =>
                    {
                        content.Item().Text(resume.Bio)
                            .FontSize(9)
                            .LineHeight(1.4f);
                    }));
                }

                // Experience
                if (resume.Experiences.Count > 0)
                {
                    col.Item().Element(c => ComposeSection(c, "Experience", content =>
                    {
                        foreach (var exp in resume.Experiences)
                        {
                            content.Item().Element(e => ComposeExperience(e, exp));
                        }
                    }));
                }

                // Projects
                if (resume.Projects.Count > 0)
                {
                    col.Item().Element(c => ComposeSection(c, "Projects", content =>
                    {
                        foreach (var proj in resume.Projects.Take(3)) // Limit to top 3 for space
                        {
                            content.Item().Element(p => ComposeProject(p, proj));
                        }
                    }));
                }
            });

            // Spacing between columns
            row.ConstantItem(20);

            // Right Column (Sidebar) - 35%
            row.RelativeItem(35).Column(col =>
            {
                // Skills
                if (resume.Skills.Count > 0)
                {
                    col.Item().Element(c => ComposeSection(c, "Skills", content =>
                    {
                        var grouped = resume.Skills.GroupBy(s => s.Category ?? "General");

                        foreach (var group in grouped)
                        {
                            content.Item().PaddingBottom(5).Column(skillCol =>
                            {
                                skillCol.Item().Text(group.Key)
                                    .FontSize(9)
                                    .Bold()
                                    .FontColor(AccentColor);

                                skillCol.Item().Text(string.Join(", ", group.Select(s => s.Name)))
                                    .FontSize(8)
                                    .FontColor(TextColor);
                            });
                        }
                    }));
                }

                // Education
                if (resume.Education.Count > 0)
                {
                    col.Item().Element(c => ComposeSection(c, "Education", content =>
                    {
                        foreach (var edu in resume.Education)
                        {
                            content.Item().Element(e => ComposeEducation(e, edu));
                        }
                    }));
                }
            });
        });
    }

    private void ComposeSection(IContainer container, string title, Action<ColumnDescriptor> contentBuilder)
    {
        container.PaddingBottom(12).Column(column =>
        {
            column.Item().Text(title.ToUpper())
                .FontSize(11)
                .Bold()
                .FontColor(AccentColor)
                .LetterSpacing(0.5f);

            column.Item().PaddingTop(2).PaddingBottom(5)
                .LineHorizontal(0.5f).LineColor(Colors.Grey.Lighten2);

            column.Item().Column(contentBuilder);
        });
    }

    private void ComposeExperience(IContainer container, Items.ExperienceItem exp)
    {
        container.PaddingBottom(8).Column(col =>
        {
            // Title and Company
            col.Item().Row(row =>
            {
                row.RelativeItem().Text(text =>
                {
                    text.Span(exp.JobTitle).Bold().FontSize(10);
                    text.Span(" at ").FontColor(MutedColor).FontSize(10);
                    text.Span(exp.Company).FontSize(10);
                });
            });

            // Dates
            col.Item().Text($"{exp.StartDate} – {exp.EndDate}")
                .FontSize(8)
                .Italic()
                .FontColor(MutedColor);

            // Description
            if (!string.IsNullOrWhiteSpace(exp.Description))
            {
                col.Item().PaddingTop(3).Text(exp.Description)
                    .FontSize(9)
                    .LineHeight(1.3f);
            }

            // Highlights
            if (exp.Highlights.Count > 0)
            {
                col.Item().PaddingTop(3).Column(highlights =>
                {
                    foreach (var highlight in exp.Highlights.Take(3))
                    {
                        highlights.Item().Row(row =>
                        {
                            row.ConstantItem(10).Text("•").FontSize(9);
                            row.RelativeItem().Text(highlight).FontSize(9).LineHeight(1.3f);
                        });
                    }
                });
            }
        });
    }

    private void ComposeProject(IContainer container, Items.ProjectItem proj)
    {
        container.PaddingBottom(6).Column(col =>
        {
            col.Item().Text(proj.Title)
                .Bold()
                .FontSize(10);

            col.Item().Text(proj.Description)
                .FontSize(9)
                .LineHeight(1.3f);

            if (proj.Technologies.Count > 0)
            {
                col.Item().PaddingTop(2).Text(string.Join(", ", proj.Technologies))
                    .FontSize(8)
                    .Italic()
                    .FontColor(MutedColor);
            }
        });
    }

    private void ComposeEducation(IContainer container, Items.EducationItem edu)
    {
        container.PaddingBottom(8).Column(col =>
        {
            col.Item().Text($"{edu.Degree} in {edu.Major}")
                .Bold()
                .FontSize(9);

            col.Item().Text(edu.SchoolName)
                .FontSize(9);

            col.Item().Text(edu.GraduationYear)
                .FontSize(8)
                .Italic()
                .FontColor(MutedColor);
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.AlignCenter().Text(text =>
        {
            text.Span("Generated with ResumeGen")
                .FontSize(7)
                .FontColor(Colors.Grey.Lighten1);
        });
    }
}
