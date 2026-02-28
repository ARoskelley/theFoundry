# CertPath

An interactive certification roadmap explorer. Users pick an industry, explore occupations, and see a visual flowchart of the certifications they need — in order — to reach their career goals.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
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
│   │   ├── index.json                  # List of all cert IDs
│   │   └── [cert-id].json             # One file per certification
│   └── occupations/
│       ├── index.json                  # List of all occupation IDs + industry map
│       └── [occupation-id].json       # One file per occupation
│
├── src/
│   ├── app/
│   │   ├── layout.jsx                 # Root layout (Navbar + globals)
│   │   ├── globals.css                # CSS variables and resets
│   │   ├── page.jsx                   # Landing page — industry grid
│   │   ├── industry/[id]/page.jsx     # Occupation explorer for an industry
│   │   ├── occupation/[id]/page.jsx   # Cert roadmap flowchart
│   │   └── cert/[id]/page.jsx         # Cert detail page
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   ├── industry/
│   │   │   └── IndustryCard.jsx       # Clickable card on landing page
│   │   ├── occupation/
│   │   │   └── OccupationCard.jsx     # Clickable card on industry page
│   │   └── roadmap/
│   │       ├── RoadmapFlow.jsx        # React Flow canvas (client component)
│   │       └── RoadmapNode.jsx        # Custom node rendered inside the flow
│   │
│   └── lib/
│       ├── getCert.js                 # Reads cert JSON files by ID
│       ├── getOccupation.js           # Reads occupation JSON files by ID
│       └── buildRoadmapNodes.js       # Converts cert data into React Flow nodes/edges
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How the Data Works

### Cert files (`data/certs/[id].json`)

Each cert has a unique `id` that matches its filename. The key fields are:

- `prerequisites` — array of cert IDs that should be completed first
- `leads_to` — array of cert IDs this unlocks
- `useful_for_occupations` — array of occupation IDs this cert helps with

```json
{
  "id": "comptia-security-plus",
  "name": "CompTIA Security+",
  "issuer": "CompTIA",
  "cost": 392,
  "difficulty": "beginner",
  "duration_weeks": 8,
  "prerequisites": [],
  "leads_to": ["comptia-cysa-plus"],
  "useful_for_occupations": ["security-analyst"],
  "industry": "cybersecurity",
  "last_updated": "2025-02",
  "sources": ["https://www.comptia.org/certifications/security"]
}
```

### Occupation files (`data/occupations/[id].json`)

Each occupation lists its `suggested_certs` in recommended order. The roadmap flowchart is built automatically from these IDs + the cert prerequisite chains.

```json
{
  "id": "security-analyst",
  "title": "Security Analyst",
  "industry": "cybersecurity",
  "level": "entry",
  "avg_salary": 75000,
  "description": "Monitors systems and networks from cyber threats.",
  "suggested_certs": ["comptia-security-plus", "comptia-cysa-plus"],
  "last_updated": "2025-02"
}
```

### Index files

`data/certs/index.json` lists all cert IDs:
```json
{ "certs": ["comptia-security-plus", "comptia-cysa-plus"] }
```

`data/occupations/index.json` lists occupations grouped by industry:
```json
{
  "industries": {
    "cybersecurity": ["security-analyst"]
  },
  "occupations": ["security-analyst"]
}
```

**When you add a new cert or occupation, you must also add its ID to the appropriate index file.**

---

## Adding a New Industry

1. Create occupation files in `data/occupations/` for each role in the industry
2. Create cert files in `data/certs/` for each certification
3. Update `data/occupations/index.json` — add the new industry key and list its occupation IDs
4. Update `data/certs/index.json` — add the new cert IDs
5. Add an icon for the industry in `src/components/industry/IndustryCard.jsx` in the `industryIcons` map

---

## Using Gemini Deep Research to Generate Data Files

The recommended workflow for populating new industries:

1. Use this prompt template in Gemini Deep Research:

```
Research the most in-demand certifications in the [INDUSTRY] industry.
For each certification, provide:
- Full name and issuing organization
- Estimated cost (USD)
- Difficulty level (beginner / intermediate / advanced)
- Estimated study duration in weeks
- Prerequisites (other certifications typically required first)
- Which job titles benefit most from this cert
- A brief description

Also provide a list of common job titles/occupations in this industry with:
- Typical entry/mid/senior classification
- Average salary (USD)
- The recommended certification order for someone entering this field

Format the output so it can be directly converted to JSON files matching the schema above.
```

2. Use Claude to format Gemini's output into properly structured JSON matching the schemas above.
3. Drop the files into the correct folders and update both index files.

---

## How the Roadmap Flowchart Works

`src/lib/buildRoadmapNodes.js` is the brain of the visualization.

It takes an occupation's `suggested_certs` array and:
1. Loads each cert file
2. Calculates each cert's "depth" in the chain based on prerequisites
3. Positions certs in columns by depth (no prerequisites = column 0)
4. Builds React Flow `nodes` (each cert = one node) and `edges` (prerequisite arrows)

The React Flow canvas in `RoadmapFlow.jsx` renders these with pan, zoom, and an animated minimap. Each node is a `RoadmapNode` that links to the cert detail page on click.

---

## Styling

The app uses CSS custom properties defined in `globals.css`. The core palette:

| Variable | Use |
|---|---|
| `--bg` | Page background |
| `--surface` | Card/panel background |
| `--border` | Card borders |
| `--accent` | Primary purple (indigo) |
| `--accent-light` | Lighter accent for links |
| `--text` | Primary text |
| `--text-muted` | Secondary/label text |
| `--success` | Green (salaries, beginner difficulty) |
| `--warning` | Amber (intermediate difficulty) |

To adjust the visual theme, change the values in `:root` in `globals.css`.

---

## Planned Features (Not Yet Built)

- [ ] Cert search / filter by industry, difficulty, cost
- [ ] Reverse path: start from a cert, find occupations
- [ ] User accounts + personal roadmap saving
- [ ] Progress tracking (mark certs as completed)
- [ ] Affiliate links per cert (monetization)
- [ ] Live job trend data via Adzuna or O*NET APIs
- [ ] "Request an industry" form

---

## Notes for Codex

- All data reading happens server-side using Node `fs` in the `lib/` helpers. Never import these in client components.
- Components marked `'use client'` (IndustryCard, OccupationCard, RoadmapFlow, RoadmapNode) use browser APIs or React hooks. Server components pass data to them as props.
- React Flow requires `'use client'` and its CSS must be imported: `import 'reactflow/dist/style.css'`
- Framer Motion's `motion` components only work in client components.
- IDs use kebab-case and must exactly match filenames and index entries.
