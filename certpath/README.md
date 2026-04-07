# CertPath

CertPath is an interactive certification roadmap explorer. Pick an industry, choose a career path, and get a visual flowchart of every certification you need — in the right order — to reach your goal. Progress is tracked locally in the browser with no account required.

## Instructions for Build and Use

Steps to build and run the software:

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. To build a production version:
   ```bash
   npm run build
   npm start
   ```

Instructions for using the software:

1. Select an industry from the homepage grid (e.g. Cybersecurity, Cloud Computing, Healthcare).
2. Choose an occupation within that industry to open its certification roadmap.
3. The roadmap displays an interactive flowchart — each node is a certification, with edges showing prerequisite relationships. Pan and zoom to explore the full path.
4. Click any cert node to open its detail page: cost, exam format, difficulty, prerequisites, and links to the official site.
5. Use "Mark as Completed" on any cert to track your progress. Progress saves in the browser automatically — no account needed.
6. Use `/certs` to browse and filter all 56 certifications by industry, difficulty, or cost.

## Development Environment

To recreate the development environment, you need the following software and/or libraries with the specified versions:

* Node.js 18 or later
* Next.js 16.1.6
* React 18
* Framer Motion 11.1.7
* React Flow (reactflow) 11.11.3
* No database or external services required — all data is stored as JSON files in `data/`

## Useful Websites to Learn More

I found these websites useful in developing this software:

* [Next.js App Router Documentation](https://nextjs.org/docs/app) — Server Components, static generation, and file-based routing
* [React Flow Documentation](https://reactflow.dev/docs/introduction) — building the interactive flowchart with custom nodes and edges
* [Framer Motion Documentation](https://www.framer.com/motion) — animations on industry and occupation cards
* [MDN Web Docs — localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) — browser-side progress persistence

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* [ ] Cloud database integration — move cert and occupation data from JSON files to a hosted database (see `supabase` branch)
* [ ] User accounts — allow progress to sync across devices
* [ ] Live salary data — integrate with O*NET or Bureau of Labor Statistics API for up-to-date salary ranges
* [ ] Shareable roadmap URLs — generate a link to share a specific occupation roadmap
