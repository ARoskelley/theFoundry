using ResumeSiteGenerator.Exceptions;
using ResumeSiteGenerator.Templates;

namespace ResumeSiteGenerator.Utilities;

/// <summary>
/// Handles writing generated content to the output folder.
/// </summary>
public class OutputWriter
{
    private readonly string _outputFolder;
    private readonly string _imagesFolder;

    public OutputWriter(string outputFolder)
    {
        _outputFolder = outputFolder;
        _imagesFolder = Path.Combine(outputFolder, "images");
    }

    /// <summary>
    /// Prepares the output directory (creates if needed, optionally cleans).
    /// </summary>
    public void PrepareOutputDirectory(bool clean = false)
    {
        try
        {
            if (clean && Directory.Exists(_outputFolder))
            {
                Directory.Delete(_outputFolder, recursive: true);
            }

            Directory.CreateDirectory(_outputFolder);
            Directory.CreateDirectory(_imagesFolder);
        }
        catch (Exception ex)
        {
            throw new OutputGenerationException(_outputFolder, ex);
        }
    }

    /// <summary>
    /// Writes all generated pages and CSS to the output folder.
    /// </summary>
    public void WriteOutput(Template template, Dictionary<string, string> pages, Resume resume)
    {
        // Write HTML pages
        foreach (var (pageName, html) in pages)
        {
            var path = Path.Combine(_outputFolder, $"{pageName}.html");
            WriteFile(path, html);
            Console.WriteLine($"  ✓ Created: {pageName}.html");
        }

        // Write CSS
        if (!string.IsNullOrEmpty(template.CssContent))
        {
            var cssPath = Path.Combine(_outputFolder, "style.css");
            WriteFile(cssPath, template.CssContent);
            Console.WriteLine($"  ✓ Created: style.css");
        }

        // Copy static files from template
        foreach (var staticFile in template.GetStaticFilePaths())
        {
            var fileName = Path.GetFileName(staticFile);
            var destPath = Path.Combine(_outputFolder, fileName);
            File.Copy(staticFile, destPath, overwrite: true);
            Console.WriteLine($"  ✓ Copied: {fileName}");
        }

        // Create placeholder for images folder
        var readmePath = Path.Combine(_imagesFolder, "README.txt");
        if (!File.Exists(readmePath))
        {
            WriteFile(readmePath, GetImagesReadme(resume));
        }
    }

    /// <summary>
    /// Writes a resume JSON file for later editing.
    /// </summary>
    public void WriteResumeJson(Resume resume)
    {
        var path = Path.Combine(_outputFolder, "resume.json");
        resume.SaveToFile(path);
        Console.WriteLine($"  ✓ Created: resume.json (your data, for future edits)");
    }

    private void WriteFile(string path, string content)
    {
        try
        {
            File.WriteAllText(path, content);
        }
        catch (Exception ex)
        {
            throw new OutputGenerationException(path, ex);
        }
    }

    private string GetImagesReadme(Resume resume)
    {
        var sb = new System.Text.StringBuilder();
        sb.AppendLine("=== Images Folder ===");
        sb.AppendLine();
        sb.AppendLine("Place your images in this folder.");
        sb.AppendLine();

        if (!string.IsNullOrWhiteSpace(resume.ProfileImage))
        {
            sb.AppendLine($"Required: {resume.ProfileImage} (your profile image)");
        }

        foreach (var project in resume.Projects.Where(p => !string.IsNullOrWhiteSpace(p.ImageFile)))
        {
            sb.AppendLine($"Required: {project.ImageFile} (image for '{project.Title}')");
        }

        sb.AppendLine();
        sb.AppendLine("Supported formats: .jpg, .jpeg, .png, .gif, .webp");

        return sb.ToString();
    }
}
