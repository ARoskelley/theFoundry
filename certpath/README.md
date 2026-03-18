# CertPath

An interactive certification roadmap explorer. Pick an industry, explore occupations, and see a visual flowchart of the certifications needed — in order — to reach your career goals.

---

## Quick Start

### 1. Install dependencies

```bash
cd certpath
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

The app hot-reloads on file save, so changes to source files and JSON data are reflected immediately.

### 3. Build for production

```bash
npm run build
npm start
```

> The app uses Next.js static generation (`generateStaticParams`). All pages are pre-rendered at build time using the JSON files in `data/`. After adding new certs or occupations, re-run `npm run build` for a production deploy.

---

## Navigation

| URL | What you see |
|---|---|
| `/` | Industry grid (pick a field to explore) |
| `/industry/[id]` | Occupation cards for that industry |
| `/occupation/[id]` | Visual cert roadmap flowchart + progress bar |
| `/cert/[id]` | Cert detail — cost, exam info, prerequisites, linked roles |
| `/certs` | Searchable, filterable directory of all certifications |
| `/request` | Form to suggest a new industry |

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js (App Router) |
| UI | React + inline styles |
| Animations | Framer Motion |
| Flowchart | React Flow |
| Data | JSON files on disk |

---

## Project Structure

```
certpath/
├── data/
│   ├── certs/
│   │   ├── index.json                  # List of all cert IDs (must be updated when adding certs)
│   │   └── [cert-id].json             # One file per certification
│   └── occupations/
│       ├── index.json                  # Occupation IDs + industry map (must be updated)
│       └── [occupation-id].json       # One file per occupation
│
├── src/
│   ├── app/
│   │   ├── layout.jsx                 # Root layout (Navbar + globals)
│   │   ├── globals.css                # CSS variables and resets
│   │   ├── page.jsx                   # Landing page — industry grid
│   │   ├── industry/[id]/page.jsx     # Occupation explorer for an industry
│   │   ├── occupation/[id]/page.jsx   # Cert roadmap flowchart
│   │   ├── cert/[id]/page.jsx         # Cert detail page
│   │   ├── certs/page.jsx             # Searchable cert directory
│   │   └── request/page.jsx           # "Request an Industry" form
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   ├── industry/
│   │   │   └── IndustryCard.jsx       # Clickable card on landing page
│   │   ├── occupation/
│   │   │   └── OccupationCard.jsx     # Clickable card on industry page
│   │   ├── cert/
│   │   │   └── CertDirectory.jsx      # Search + filter UI for /certs
│   │   ├── roadmap/
│   │   │   ├── RoadmapFlow.jsx        # React Flow canvas (client component)
│   │   │   └── RoadmapNode.jsx        # Custom node rendered inside the flow
│   │   └── progress/
│   │       ├── RoadmapProgress.jsx    # Progress bar on occupation page
│   │       ├── ProgressToggle.jsx     # "Mark as Completed" button per cert
│   │       └── useCompletedCerts.js   # localStorage hook (syncs across tabs)
│   │
│   └── lib/
│       ├── getCert.js                 # Reads cert JSON files by ID
│       ├── getOccupation.js           # Reads occupation JSON files by ID
│       └── buildRoadmapNodes.js       # Converts cert data into React Flow nodes/edges
```

---

## How the Data Works

### Cert files (`data/certs/[cert-id].json`)

Each cert has a unique `id` matching its filename. Key fields:

- `prerequisites` — cert IDs that should be completed first
- `leads_to` — cert IDs this unlocks (used on the cert detail page)
- `useful_for_occupations` — occupation IDs this cert appears in
- `sources` — array of URLs; `sources[0]` is used as the "Official Site" link
- `exam_details` — optional object; any field can be `null` if not applicable

```json
{
  "id": "comptia-security-plus",
  "name": "CompTIA Security+",
  "issuer": "CompTIA",
  "cost": 392,
  "difficulty": "beginner",
  "duration_weeks": 8,
  "description": "Entry-level security certification...",
  "prerequisites": [],
  "leads_to": ["comptia-cysa-plus", "comptia-pentest-plus"],
  "useful_for_occupations": ["security-analyst"],
  "industry": "cybersecurity",
  "exam_details": {
    "questions": 90,
    "passing_score": 750,
    "time_minutes": 90
  },
  "last_updated": "2026-01",
  "sources": ["https://www.comptia.org/certifications/security"]
}
```

### Occupation files (`data/occupations/[occupation-id].json`)

`suggested_certs` lists cert IDs in recommended order. The roadmap flowchart is built automatically from these IDs plus any pulled-in prerequisite chains.

```json
{
  "id": "security-analyst",
  "title": "Security Analyst",
  "industry": "cybersecurity",
  "level": "entry",
  "avg_salary": 75000,
  "description": "Monitors systems and networks from cyber threats.",
  "suggested_certs": ["comptia-security-plus", "comptia-cysa-plus"],
  "last_updated": "2026-01",
  "sources": ["https://www.bls.gov/ooh/..."]
}
```

### Index files

`data/certs/index.json` — every cert ID must be listed here:
```json
{ "certs": ["comptia-security-plus", "comptia-cysa-plus"] }
```

`data/occupations/index.json` — occupations grouped by industry:
```json
{
  "industries": {
    "cybersecurity": ["security-analyst"]
  },
  "occupations": ["security-analyst"]
}
```

**Always update both index files when adding new certs or occupations.**

---

## Adding a New Industry

1. Create occupation JSON files in `data/occupations/`
2. Create cert JSON files in `data/certs/`
3. Update `data/occupations/index.json` — add the industry key and its occupation IDs
4. Update `data/certs/index.json` — add the new cert IDs
5. Add an icon for the industry in `src/components/industry/IndustryCard.jsx` (`industryIcons` map)
6. If the industry name doesn't title-case cleanly (e.g. "devops" → "DevOps"), add it to `industryLabels` in the same file

---

## Current Industries

| Industry | Occupations |
|---|---|
| Cybersecurity | Security Analyst, Penetration Tester, IT Auditor, Threat Intelligence Analyst, Cloud Security Engineer |
| Cloud Computing | Cloud Engineer, Cloud Architect, Solutions Architect |
| Networking | Network Admin, Network Engineer |
| DevOps | DevOps Engineer, Site Reliability Engineer |
| Data Science | Data Analyst, Data Engineer |
| Healthcare | Medical Biller, Medical Coder, Health Information Manager, Revenue Cycle Specialist |
| Welding | Welder, Welding Inspector, Welding Supervisor |
| Construction | Construction Manager, Site Superintendent, Safety Officer, Green Building Consultant |
| HVAC | HVAC Technician, HVAC Service Manager |
| Electrical | Electrician, Solar PV Installer |
| Project Management | Project Manager, Scrum Master, Program Manager |

---

## How the Roadmap Flowchart Works

`src/lib/buildRoadmapNodes.js` converts an occupation's `suggested_certs` into a React Flow graph:

1. Loads each cert file and recursively collects prerequisites
2. Calculates each cert's "depth" based on its prerequisite chain (no prerequisites = depth 0)
3. Groups certs into vertical columns by depth
4. Generates React Flow nodes with x/y positions and edges from prerequisite relationships

The canvas in `RoadmapFlow.jsx` renders these with pan, zoom, minimap, and animated edges. Each node links to the cert detail page on click.

---

## Progress Tracking

Progress is stored in `localStorage` under the key `certpath-completed-certs`. It persists across sessions and syncs across browser tabs via a custom storage event. No account or backend needed.

- **Occupation page** — shows a progress bar ("X of Y roadmap certs completed")
- **Cert detail page** — "Mark as Completed" toggle button
- **Cert directory** — compact toggle button on each card

---

## Styling

CSS custom properties defined in `globals.css`:

| Variable | Use |
|---|---|
| `--bg` | Page background |
| `--surface` | Card/panel background |
| `--border` | Card borders |
| `--accent` | Primary indigo |
| `--accent-light` | Lighter accent for links |
| `--text` | Primary text |
| `--text-muted` | Secondary/label text |
| `--success` | Green (salaries, entry level) |
| `--warning` | Amber (intermediate difficulty) |

---

## Planned Features

- [x] Cert search / filter by industry, difficulty, cost (`/certs`)
- [x] Progress tracking — mark certs as completed (localStorage)
- [x] Reverse path: start from a cert, see linked occupations (`/cert/[id]`)
- [x] Official Site links per cert (sources field → external button)
- [x] "Request an Industry" form (`/request`)
- [ ] User accounts + cloud-synced roadmap saving
- [ ] Live job trend / job posting data via O*NET or Adzuna API
- [ ] Salary range (min/max) in addition to average
- [ ] Compare two certs side-by-side
- [ ] Shareable roadmap URLs

---

## Developer Notes

- All data reading happens server-side using Node `fs` in `src/lib/`. Never import `getCert` or `getOccupation` in client components.
- Components marked `'use client'` use browser APIs or React hooks. Server components pass data to them as props.
- React Flow requires `'use client'` and its CSS must be imported: `import 'reactflow/dist/style.css'`
- Framer Motion's `motion` components only work in client components.
- All IDs use kebab-case and must exactly match their filenames and index entries.
- `exam_details` fields (`questions`, `passing_score`, `time_minutes`) can be `null` for performance-based or state-variable credentials — the UI handles nulls gracefully.
