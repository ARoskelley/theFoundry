using System.IO;

namespace ResumeSiteGenerator
{
    public class FileWriter
    {
        public void EnsureOutputDirectory(string folderPath)
        {
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);
        }

        public void SaveHtml(string filePath, string htmlContent)
        {
            File.WriteAllText(filePath, htmlContent);
        }

        public void SaveCss(string filePath, string cssContent)
        {
            File.WriteAllText(filePath, cssContent);
        }
    }
}
