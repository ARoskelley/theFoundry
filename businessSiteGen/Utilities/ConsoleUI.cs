namespace BusinessSiteGenerator.Utilities;

public static class ConsoleUI
{
    public static void WriteHeader(string title)
    {
        Console.WriteLine();
        Console.WriteLine("== " + title + " ==");
        Console.WriteLine();
    }

    public static void WriteSection(string title)
    {
        Console.WriteLine();
        Console.WriteLine("-- " + title + " --");
        Console.WriteLine();
    }

    public static void WriteSuccess(string message)
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("[OK] " + message);
        Console.ResetColor();
    }

    public static void WriteError(string message)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("[ERROR] " + message);
        Console.ResetColor();
    }

    public static void WriteWarning(string message)
    {
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("[WARN] " + message);
        Console.ResetColor();
    }

    public static void WriteInfo(string message)
    {
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("[INFO] " + message);
        Console.ResetColor();
    }

    public static void WriteList(IEnumerable<string> items, string bullet = "*")
    {
        foreach (var item in items)
        {
            Console.WriteLine($"  {bullet} {item}");
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
}
