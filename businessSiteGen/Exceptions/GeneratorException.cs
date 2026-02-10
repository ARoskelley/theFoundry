namespace BusinessSiteGenerator.Exceptions;

public class GeneratorException : Exception
{
    public GeneratorException(string message) : base(message) { }
    public GeneratorException(string message, Exception inner) : base(message, inner) { }
}

public class TemplateNotFoundException : GeneratorException
{
    public TemplateNotFoundException(string name)
        : base($"Template '{name}' was not found.") { }
}

public class InvalidTemplateException : GeneratorException
{
    public InvalidTemplateException(string folder, IEnumerable<string> expectedFiles)
        : base($"Template in '{folder}' is invalid or missing files: {string.Join(", ", expectedFiles)}") { }
}

public class OutputGenerationException : GeneratorException
{
    public OutputGenerationException(string path, Exception inner)
        : base($"Failed to write output to '{path}'.", inner) { }
}
