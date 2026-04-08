# BusinessSiteGen + SiteFoundry

A static website generator for small businesses. Includes a .NET CLI tool that builds complete, ready-to-host websites from JSON data, and a locally hosted web app (SiteFoundry) with a guided wizard for creating sites without touching JSON.

## Instructions for Build and Use

### CLI Tool (.NET)

Steps to build and run:

1. Ensure you have the [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) installed
2. Open a terminal in the `businessSiteGen` directory
3. Run `dotnet run -- -t restaurant -j example-restaurant.json -o ./Output` to generate a site

Instructions for using the CLI:

1. Choose a template: `restaurant`, `contractor`, `realestate`, or `service`
2. Provide a JSON file with your business data (see `example-*.json` files for reference)
3. Run `dotnet run -- -t <template> -j <your-data.json> -o <output-folder>`
4. Open the generated `index.html` in your browser or upload the output folder to any web host

### Web App (SiteFoundry)

Steps to build and run:

1. Ensure you have [Node.js 18+](https://nodejs.org/) installed
2. Open a terminal in the `businessSiteGen/web` directory
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server
5. Open `http://localhost:3000` in your browser

Instructions for using the web app:

1. Click "Start Building" on the landing page
2. Walk through the 12-step wizard: Business Basics, Branding, Hero, About, Services, Industry Details, Testimonials, CTA, Contact, Social Links, Template Selection, and Review
3. Use the live preview panel on the right to see your site update in real time
4. On the Review step, click "Download HTML" to save the generated site or "Export JSON" to save your data for later

## Development Environment

To recreate the development environment, you need the following software and/or libraries with the specified versions:

* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) — for the CLI tool
* [Node.js 18+](https://nodejs.org/) — for the SiteFoundry web app
* Next.js 14, React 18, Tailwind CSS 3 — installed automatically via `npm install` in the `web/` directory
* TypeScript 5 — included in the web app dev dependencies

## Useful Websites to Learn More

I found these websites useful in developing this software:

* [Next.js Documentation](https://nextjs.org/docs) — App Router, API routes, and project structure
* [Tailwind CSS Documentation](https://tailwindcss.com/docs) — Utility-first CSS framework used for the web app UI
* [Schema.org LocalBusiness](https://schema.org/LocalBusiness) — Structured data markup generated for SEO
* [MDN Web Docs - HTML Templates](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) — Reference for template/placeholder patterns

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* [ ] JSON import — drag-and-drop or file picker to load existing business data into the wizard
* [ ] Additional templates beyond the current four (Restaurant, Contractor, Real Estate, Service)
* [ ] Image upload support — allow users to upload images directly instead of providing URLs
* [ ] Multi-page site generation — support for separate About, Services, and Contact pages
* [ ] ZIP download — bundle the generated HTML with CSS, JS, and assets into a single downloadable archive
* [ ] Deploy integration — one-click publish to hosting providers like Netlify or Vercel
