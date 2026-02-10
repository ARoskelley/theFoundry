using BusinessSiteGenerator.Exceptions;
using BusinessSiteGenerator.Templates;

namespace BusinessSiteGenerator.Utilities;

public class OutputWriter
{
    private readonly string _outputFolder;

    public OutputWriter(string outputFolder)
    {
        _outputFolder = outputFolder;
    }

    public void PrepareOutputDirectory(bool clean = false)
    {
        try
        {
            if (clean && Directory.Exists(_outputFolder))
            {
                Directory.Delete(_outputFolder, recursive: true);
            }

            Directory.CreateDirectory(_outputFolder);
        }
        catch (Exception ex)
        {
            throw new OutputGenerationException(_outputFolder, ex);
        }
    }

    public void WriteOutput(Template template, Dictionary<string, string> pages)
    {
        foreach (var (pageName, html) in pages)
        {
            var path = Path.Combine(_outputFolder, $"{pageName}.html");
            WriteFile(path, html);
            Console.WriteLine($"  - Created: {pageName}.html");
        }

        foreach (var staticFile in template.GetStaticFilePaths())
        {
            var fileName = Path.GetFileName(staticFile);
            var destPath = Path.Combine(_outputFolder, fileName);
            File.Copy(staticFile, destPath, overwrite: true);
            Console.WriteLine($"  - Copied: {fileName}");
        }

        foreach (var dir in template.GetStaticDirectories())
        {
            var destDir = Path.Combine(_outputFolder, Path.GetFileName(dir));
            CopyDirectory(dir, destDir);
            Console.WriteLine($"  - Copied: {Path.GetFileName(dir)}/");
        }
    }

    public void WriteSiteJson(SiteData site)
    {
        var path = Path.Combine(_outputFolder, "site.json");
        site.SaveToFile(path);
        Console.WriteLine("  - Created: site.json");
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

    private static void CopyDirectory(string sourceDir, string destDir)
    {
        Directory.CreateDirectory(destDir);

        foreach (var file in Directory.GetFiles(sourceDir))
        {
            var destPath = Path.Combine(destDir, Path.GetFileName(file));
            File.Copy(file, destPath, overwrite: true);
        }

        foreach (var dir in Directory.GetDirectories(sourceDir))
        {
            var destPath = Path.Combine(destDir, Path.GetFileName(dir));
            CopyDirectory(dir, destPath);
        }
    }
}
