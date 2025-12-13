using System;

namespace ResumeSiteGenerator.Input
{
    public abstract class ResumeBuilderBase : IResumeBuilder
    {
        public abstract Resume Build();

        protected bool Confirm(string prompt)
        {
            Console.Write(prompt);
            return (Console.ReadLine()?.Trim().ToLower() == "y");
        }

        protected string Prompt(string label)
        {
            Console.Write(label);
            return Console.ReadLine() ?? "";
        }
    }
}
