namespace ResumeSiteGenerator.Utilities;

/// <summary>
/// Helper class for console UI interactions.
/// Provides consistent styling and input handling.
/// </summary>
public static class ConsoleUI
{
    // ---------------------------------------------------------
    // Output Methods
    // ---------------------------------------------------------

    public static void WriteHeader(string title)
    {
        Console.WriteLine();
        Console.WriteLine($"╔{'═'.Repeat(title.Length + 2)}╗");
        Console.WriteLine($"║ {title} ║");
        Console.WriteLine($"╚{'═'.Repeat(title.Length + 2)}╝");
        Console.WriteLine();
    }

    public static void WriteSection(string title)
    {
        Console.WriteLine();
        Console.WriteLine($"── {title} ──");
        Console.WriteLine();
    }

    public static void WriteSuccess(string message)
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"✓ {message}");
        Console.ResetColor();
    }

    public static void WriteError(string message)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"✗ {message}");
        Console.ResetColor();
    }

    public static void WriteWarning(string message)
    {
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine($"⚠ {message}");
        Console.ResetColor();
    }

    public static void WriteInfo(string message)
    {
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine($"ℹ {message}");
        Console.ResetColor();
    }

    public static void WriteList(IEnumerable<string> items, string bullet = "•")
    {
        foreach (var item in items)
        {
            Console.WriteLine($"  {bullet} {item}");
        }
    }

    // ---------------------------------------------------------
    // Input Methods
    // ---------------------------------------------------------

    public static string Prompt(string label, string? defaultValue = null)
    {
        if (defaultValue != null)
        {
            Console.Write($"{label} [{defaultValue}]: ");
        }
        else
        {
            Console.Write($"{label}: ");
        }

        var input = Console.ReadLine()?.Trim() ?? "";

        return string.IsNullOrEmpty(input) && defaultValue != null
            ? defaultValue
            : input;
    }

    public static string PromptRequired(string label)
    {
        while (true)
        {
            Console.Write($"{label}: ");
            var input = Console.ReadLine()?.Trim() ?? "";

            if (!string.IsNullOrWhiteSpace(input))
                return input;

            WriteWarning("This field is required. Please enter a value.");
        }
    }

    public static bool Confirm(string message, bool defaultValue = false)
    {
        var defaultHint = defaultValue ? "[Y/n]" : "[y/N]";
        Console.Write($"{message} {defaultHint}: ");

        var input = Console.ReadLine()?.Trim().ToLowerInvariant() ?? "";

        return input switch
        {
            "y" or "yes" => true,
            "n" or "no" => false,
            "" => defaultValue,
            _ => defaultValue
        };
    }

    public static int PromptChoice(string message, IList<string> options, int defaultIndex = 0)
    {
        Console.WriteLine(message);

        for (int i = 0; i < options.Count; i++)
        {
            var marker = i == defaultIndex ? "*" : " ";
            Console.WriteLine($"  {marker} {i + 1}. {options[i]}");
        }

        while (true)
        {
            Console.Write($"Choice [1-{options.Count}]: ");
            var input = Console.ReadLine()?.Trim() ?? "";

            if (string.IsNullOrEmpty(input))
                return defaultIndex;

            if (int.TryParse(input, out int choice) && choice >= 1 && choice <= options.Count)
                return choice - 1;

            WriteWarning($"Please enter a number between 1 and {options.Count}");
        }
    }

    public static List<string> PromptList(string label, string separator = ",")
    {
        Console.Write($"{label} (comma-separated): ");
        var input = Console.ReadLine() ?? "";

        return input
            .Split(separator, StringSplitOptions.RemoveEmptyEntries)
            .Select(s => s.Trim())
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .ToList();
    }

    public static void Pause(string message = "Press Enter to continue...")
    {
        Console.WriteLine();
        Console.WriteLine(message);
        Console.ReadLine();
    }

    public static void Clear()
    {
        try
        {
            Console.Clear();
        }
        catch
        {
            // Some terminals don't support clearing
            Console.WriteLine("\n\n\n");
        }
    }
}

// Extension method for string repetition
public static class StringExtensions
{
    public static string Repeat(this char c, int count) =>
        new string(c, count);
}
