The Foundry is a collection of content generators and automation programs made by and for use by Aiden Roskelley.

This README focuses on `resumeGen2.0`, a resume website generator that produces a multi-page HTML site and an optional PDF.

**Requirements**
1. .NET SDK 8.0 or newer

**Quick Start**
1. Open a terminal at the repo root.
2. Change into the generator directory:

```powershell
cd resumeGen2.0
```

3. Run with the base command:

```powershell
dotnet run -- -t modern -j example-resume.json --pdf --clean
```

**What the Base Command Does**
1. `-t modern` selects the Modern template.
2. `-j example-resume.json` loads resume data from the example file.
3. `--pdf` generates a PDF in addition to the website.
4. `--clean` clears the output directory before generating.

**Output**
1. Website files are written to `resumeGen2.0/Output` by default.
2. A generated `resume.json` is saved alongside the HTML output.
3. If `--pdf` is used, a PDF named like `Your_Name_Resume.pdf` is created in the output folder.

**Command Reference**
```text
dotnet run -- [OPTIONS]
```

Options:
1. `-h`, `--help` shows the help message.
2. `-t`, `--template NAME` selects a template by folder name.
3. `-j`, `--json PATH` loads resume data from a JSON file.
4. `-o`, `--output PATH` writes output to a custom folder.
5. `--clean` deletes the output folder contents before generating.
6. `--pdf` generates a PDF in addition to the website.
7. `--pdf-only` generates only the PDF, skipping HTML output.

**Examples**
```powershell
dotnet run
dotnet run -- -t editorial -j example-resume.json
dotnet run -- -t slate -j example-resume.json --clean
dotnet run -- -t citrus -j example-resume.json --pdf
dotnet run -- -j example-resume.json --pdf-only
dotnet run -- -o .\\Output\\MyResume -t modern -j example-resume.json
```

**Templates**
Templates are auto-discovered from `resumeGen2.0/TemplateFiles`.
Each subfolder with HTML files is treated as a template.

Current templates:
1. `modern`
2. `minimal`
3. `editorial`
4. `slate`
5. `citrus`

**JSON Data**
The example file at `resumeGen2.0/example-resume.json` is the best starting point.
Copy it, edit the values, and pass it to `-j`.

**Troubleshooting**
1. If you see "Templates folder not found", run the command from `resumeGen2.0`.
2. If images do not appear, put them in `resumeGen2.0/Output/images` after generation.
3. If you update `resume.json`, rerun the command to regenerate the site.
