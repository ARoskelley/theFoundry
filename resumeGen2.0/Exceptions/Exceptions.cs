namespace ResumeSiteGenerator.Exceptions;

/// <summary>
/// Base exception for all ResumeSiteGenerator errors.
/// </summary>
public class ResumeGeneratorException : Exception
{
    public ResumeGeneratorException(string message) : base(message) { }
    public ResumeGeneratorException(string message, Exception inner) : base(message, inner) { }
}

/// <summary>
/// Thrown when a template cannot be found or loaded.
/// </summary>
public class TemplateNotFoundException : ResumeGeneratorException
{
    public string TemplateName { get; }

    public TemplateNotFoundException(string templateName)
        : base($"Template '{templateName}' not found. Check that the template folder exists in TemplateFiles/")
    {
        TemplateName = templateName;
    }
}

/// <summary>
/// Thrown when a template is invalid or missing required files.
/// </summary>
public class InvalidTemplateException : ResumeGeneratorException
{
    public string TemplatePath { get; }
    public List<string> MissingFiles { get; }

    public InvalidTemplateException(string templatePath, List<string> missingFiles)
        : base($"Template at '{templatePath}' is invalid. Missing files: {string.Join(", ", missingFiles)}")
    {
        TemplatePath = templatePath;
        MissingFiles = missingFiles;
    }
}

/// <summary>
/// Thrown when resume validation fails.
/// </summary>
public class ResumeValidationException : ResumeGeneratorException
{
    public List<string> ValidationErrors { get; }

    public ResumeValidationException(List<string> errors)
        : base($"Resume validation failed:\n  - {string.Join("\n  - ", errors)}")
    {
        ValidationErrors = errors;
    }
}

/// <summary>
/// Thrown when output generation fails.
/// </summary>
public class OutputGenerationException : ResumeGeneratorException
{
    public string OutputPath { get; }

    public OutputGenerationException(string outputPath, Exception inner)
        : base($"Failed to generate output at '{outputPath}': {inner.Message}", inner)
    {
        OutputPath = outputPath;
    }
}
