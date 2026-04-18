# Harder / Rowe / Graves Migrations

A horizontal, scrollable family-history timeline with per-node confidence indicators, a bottom minimap scrubber, a geographic mini-map, deep-linkable events, image slots, and per-node comments backed by Cloudflare D1.

## Run locally (Vite only, no comments API)

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). Everything works
except the comments section, which requires the full Pages + D1 setup below.

## Run locally with comments (wrangler pages dev)

```bash
# After completing the D1 setup below:
npx wrangler pages dev dist --d1=DB
```

This boots a local Cloudflare Pages emulator with the D1 binding. Rebuild first
(`npm run build`) any time you change source code.

## Build for production

```bash
npm run build     # TypeScript check + Vite bundle → ./dist
npm run preview   # Preview the production bundle locally
```

---

## Deploying to Cloudflare Pages (with comments)

### Step 1 — One-time D1 database setup

```bash
# Log in to Cloudflare:
npx wrangler login

# Create the D1 database:
npx wrangler d1 create harder-timeline
# Copy the `database_id` from the output.

# Paste it into wrangler.toml — replace REPLACE_WITH_YOUR_DATABASE_ID.

# Create the schema:
npx wrangler d1 execute harder-timeline --file=./schema.sql
```

### Step 2 — Turnstile sitekey + secret

1. Go to [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile).
2. Create a new site. Choose **Managed** challenge type.
3. Copy the **Site Key** and the **Secret Key**.

### Step 3 — Cloudflare Pages project (Git-based, recommended)

1. Push this folder to a new GitHub repository.
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo; framework preset: **Vite**.
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Under **Environment variables (Production + Preview)**:

| Variable | Type | Value |
|---|---|---|
| `NODE_VERSION` | Plain | `20` |
| `VITE_TURNSTILE_SITE_KEY` | Plain | your Turnstile **Site Key** |
| `TURNSTILE_SECRET` | **Secret** | your Turnstile **Secret Key** |

7. Under **Functions → D1 database bindings**:
   - Variable name: `DB`
   - D1 database: `harder-timeline`

8. Click **Save and deploy**. Every `git push` redeploys automatically.

### Step 3 (alternative) — One-shot deploy with Wrangler

```bash
npm run build
npx wrangler pages deploy dist --project-name=harder-timeline

# Set secret env vars (only needed once):
npx wrangler pages secret put TURNSTILE_SECRET --project-name=harder-timeline
# Paste the secret key when prompted.
```

After the first deploy, go to the project's **Settings → Functions → D1 database
bindings** in the dashboard and bind `DB` to `harder-timeline`.

---

## Editing the timeline data

Everything the page renders is in two files:

- `src/data/timeline.ts` — events, lanes, joins
- `src/data/locations.ts` — geographic place registry

### Add an event

Push a `TimelineNode` into `timeline.nodes`:

```ts
{
  id: 'unique-kebab-id',
  laneId: 'harder',          // must match a lane id
  title: 'What happened',
  year: 1826,
  // Optional:
  yearEnd: 1828,             // renders as a ranged bar
  uncertain: true,           // shaded range + "c." in labels
  confidence: 2,             // 1 speculative | 2 partial | 3 well-cited
  placeId: 'mosa-on',        // links to a src/data/locations.ts entry
  description: 'Full sentence description for the dialog.',
  imageUrl: 'https://…',     // thumbnail in dialog; click opens lightbox
  imageAlt: 'Caption text',
  url: 'https://…',          // if set, click opens in new tab (no dialog)
  sources: [
    { label: '1826 Mosa petition', url: 'https://…' },
  ],
  joinsInto: { laneId: 'harder', atYear: 1830 }, // draws a bezier curve
}
```

### Add a lane

Push a `Lane` into `timeline.lanes`:

```ts
{
  id: 'westover',
  label: 'Westover',
  color: '#8ae3a5',
  segments: [{ fromYear: 1780, toYear: 1850, style: 'solid' }],
}
```

Segment styles: `'solid'` | `'sub'` (thinner sub-thread) | `'dotted'`.

### Add a location for the geo-map

Push a `Location` into `locations` in `src/data/locations.ts`:

```ts
{ id: 'ancaster-on', name: 'Ancaster, ON', lat: 43.22, lng: -79.98, region: 'Upper Canada' }
```

Then reference it with `placeId: 'ancaster-on'` on any node.

### Add an image to a node

Set `imageUrl` on the node to any publicly accessible URL:

```ts
imageUrl: 'https://example.com/tombstone.jpg',
imageAlt: 'Tombstone of Adam Harder, Bay Port MI',
```

A thumbnail appears in the dialog; clicking it opens a full-screen lightbox.

---

## Confidence filter

The three-dot indicator below each node reflects how well-cited the event is:

| Dots | Meaning | Set |
|---|---|---|
| ●●● | Well-cited | `confidence: 3` |
| ●●○ | Partially cited | `confidence: 2` |
| ●○○ | Speculative | `confidence: 1` (default) |

Use the **Filter** pill in the header to hide less-cited events without
removing them from the data.

## Deep-linking

Any event is shareable. Click the **link icon** in its dialog to copy a URL
like `https://your-site.pages.dev/#michael-moves-canada`. The page will
scroll to and flash the node on load.

## Comment moderation

Comments are stored in the `comments` table in your D1 database. The
`hidden` column (default `0`) is the soft-delete flag. To hide a comment
from Cloudflare's D1 Studio in the dashboard:

```sql
UPDATE comments SET hidden = 1 WHERE id = 'some-uuid';
```

A moderation UI is left as a future enhancement.

---

## Project structure

```
src/
  data/
    timeline.ts      The main working document — lanes, nodes, joins.
    locations.ts     Place registry for the geographic mini-map.
  state/
    ui.ts            Zustand store — hovered/flashing node, minConfidence.
    scroll.ts        React context for the shared scroll-container ref.
  hooks/
    useDeepLink.ts   Hash → scroll + flash on page load / hashchange.
  components/
    Timeline.tsx     Scroll container + layout constants.
    YearRuler.tsx    Sticky top year ruler.
    LaneRow.tsx      One lane's baseline + its nodes.
    TimelineNode.tsx Node circle with pulse, confidence dots, flash.
    NodeDialog.tsx   Dialog with description, image, sources, comments.
    ConfidenceDots.tsx  Three-dot citation indicator.
    FilterBar.tsx    Segmented confidence filter control.
    Minimap.tsx      Bottom scrubber with draggable viewport rect.
    GeoMap.tsx       Bottom-right corner MapLibre map with place markers.
    ImageLightbox.tsx   Full-screen image overlay (Radix Dialog).
    Comments.tsx     Per-node notes + Turnstile-gated post form.
    JoinsLayer.tsx   SVG bezier curves for lane merges.
  env.d.ts           Global ambient types (Vite env, Turnstile widget).
  types.ts           Timeline / Lane / TimelineNode / Location / Source.
functions/
  api/
    comments.ts      Cloudflare Pages Function (GET + POST).
  tsconfig.json      TS config for the functions directory.
schema.sql           D1 schema — run once per environment.
wrangler.toml        Cloudflare project config (fill in database_id).
```
