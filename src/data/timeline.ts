import type { Timeline } from '../types';

// A working document. Edit freely.
// Add new lanes by pushing into `lanes` and new events by pushing into `nodes`.
// Each node MUST reference a valid `laneId`.
//
// Conventions:
//   - `year` + `yearEnd` => rendered as a bar (a span of time).
//   - `uncertain: true` => rendered with a translucent range behind it; tooltip prefixed with "c."
//   - `url` => click opens in a new tab and the dialog does NOT appear.
//   - Otherwise, click opens a dialog that always shows the node's sources.
//   - `joinsInto` => draws a curve from this node to the target lane at `atYear`.
//   - `confidence` => 1 speculative, 2 partial, 3 well-cited. Defaults to 1.
//   - `placeId` => references src/data/locations.ts for the geo-map pin.
//   - `imageUrl` + `imageAlt` => thumbnail shown in the dialog.
//
// Placeholder source `{ label: 'PDF: Harder migrations' }` is on every node.
// Replace with real citations (1851 Census, Aldborough land petition, etc.) as you go.

export const timeline: Timeline = {
  minYear: 1670,
  maxYear: 1900,
  lanes: [
    {
      id: 'harder',
      label: 'Harder',
      color: '#e0b46c',
      segments: [{ fromYear: 1670, toYear: 1900, style: 'solid' }],
    },
    {
      id: 'rowe',
      label: 'Rowe',
      color: '#8fb3ff',
      segments: [
        { fromYear: 1775, toYear: 1830, style: 'solid' },
        // After Catharine Rowe marries Adam Harder, Rowe continues as a sub-thread.
        { fromYear: 1830, toYear: 1869, style: 'sub' },
      ],
    },
    {
      id: 'graves',
      label: 'Graves',
      color: '#9c88ff',
      segments: [{ fromYear: 1830, toYear: 1900, style: 'dotted' }],
    },
  ],
  nodes: [
    // ─────────────────────────── HARDER ───────────────────────────
    {
      id: 'harter-michael-birth',
      laneId: 'harder',
      title: 'Joh. Michael Harter born',
      year: 1672,
      description: 'Born in Rheinland-Pfalz, Germany.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 1,
      placeId: 'rheinland-pfalz',
    },
    {
      id: 'harter-peter-birth',
      laneId: 'harder',
      title: 'Joh. Peter Harter born',
      year: 1703,
      description: 'Born in Rheinland-Pfalz, Germany.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 1,
      placeId: 'rheinland-pfalz',
    },
    {
      id: 'harter-michael-death',
      laneId: 'harder',
      title: 'Joh. Michael Harter dies',
      year: 1716,
      description: 'Dies in Columbia County, NY.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 1,
      placeId: 'columbia-county-ny',
    },
    {
      id: 'jacob-birth',
      laneId: 'harder',
      title: 'Jacob P. Harter born',
      year: 1748,
      description: 'Born in Germantown, NY.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'germantown-ny',
    },
    {
      id: 'lt-john-birth',
      laneId: 'harder',
      title: 'Lt. John Harder born',
      year: 1750,
      description:
        'Born in Columbia County, NY. Later married Elisabeth Rockefeller. A member of Butler\u2019s Rangers; refused to sign the "general association" (i.e. refused to rebel against the Crown). Taken prisoner by Americans.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'columbia-county-ny',
    },
    {
      id: 'john-jr-birth',
      laneId: 'harder',
      title: 'John Harder "Jr." born',
      year: 1768,
      description:
        'Born in Germantown, NY. Called "Jr." because he took after his uncle John (a Lieutenant in the Continental Army who married a Rockefeller).',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'germantown-ny',
    },
    {
      id: 'michael-birth',
      laneId: 'harder',
      title: 'Michael Harder born',
      year: 1770,
      yearEnd: 1773,
      uncertain: true,
      description:
        'May have been born 1770\u20131773 in Columbia County, New York. Seems to move to Canada in or before 1802.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 1,
      placeId: 'columbia-county-ny',
    },
    {
      id: 'william-birth',
      laneId: 'harder',
      title: 'William Harder born',
      year: 1773,
      description:
        'Born in 1773, sponsored by his aunt and uncle. (Appears to have been baptized in 1773 at Gallatin Reformed Dutch Church in New York.)',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'columbia-county-ny',
    },
    {
      id: 'harter-peter-death',
      laneId: 'harder',
      title: 'Joh. Peter Harter dies',
      year: 1780,
      description: 'Dies in Columbia County, NY.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 1,
      placeId: 'columbia-county-ny',
    },
    {
      id: 'adam-birth',
      laneId: 'harder',
      title: 'Adam Harder born',
      year: 1792,
      description:
        'Per Canadian Census, born in 1792 in "New York State." Definitely connected to Michael, though parentage hasn\u2019t been proven.',
      sources: [
        { label: 'PDF: Harder migrations' },
        { label: 'Canadian Census (per PDF reference)' },
      ],
      confidence: 2,
      placeId: 'columbia-county-ny',
    },
    {
      id: 'michael-moves-canada',
      laneId: 'harder',
      title: 'Michael moves to Canada; oath of allegiance',
      year: 1802,
      description:
        'Michael Harder moves to Canada in or before 1802 and swears an oath of allegiance to the Crown.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'mosa-on',
    },
    {
      id: 'john-jr-rainham-1811',
      laneId: 'harder',
      title: 'John Jr. petitions for land in Rainham',
      year: 1811,
      description:
        'Submits a land lease petition for Rainham, Ontario. Mentions that he\u2019s coming from the town of Thorold, in the Niagara region.',
      sources: [
        { label: 'PDF: Harder migrations' },
        { label: '1811 Rainham land petition (Upper Canada Land Petitions)' },
      ],
      confidence: 3,
      placeId: 'rainham-on',
    },
    {
      id: 'war-1812',
      laneId: 'harder',
      title: 'War of 1812 \u2014 2nd Lincoln Militia',
      year: 1812,
      yearEnd: 1815,
      description:
        'Michael and John Jr. serve in the 2nd Lincoln Militia. John Jr. served as a volunteer in the Flank Company. Both are captured at some point during the war.',
      sources: [
        { label: 'PDF: Harder migrations' },
        { label: '2nd Lincoln Militia muster records (per PDF reference)' },
      ],
      confidence: 2,
      placeId: 'rainham-on',
    },
    {
      id: 'john-jr-rainham-1818',
      laneId: 'harder',
      title: 'John Jr. petitions for land in Rainham',
      year: 1818,
      description:
        '"A native of the United States of America, is 25 years old, has resided in this province eighteen years, and is married." Married to Lucy Westover. Mentions having "resided three years in the Township of Rainham"\u2014likely living with Michael after the War of 1812. "Having resided in this province eighteen years" suggests he came to Canada around when Michael did and was likely traveling with him.',
      sources: [
        { label: 'PDF: Harder migrations' },
        { label: '1818 Rainham land petition (Upper Canada Land Petitions)' },
      ],
      confidence: 3,
      placeId: 'rainham-on',
    },
    {
      id: 'lt-john-death',
      laneId: 'harder',
      title: 'Lt. John Harder dies',
      year: 1824,
      description: 'Dies in Columbia County, NY.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'columbia-county-ny',
    },
    {
      id: 'jacob-death',
      laneId: 'harder',
      title: 'Jacob P. Harter dies',
      year: 1825,
      description:
        'Dies in Little Falls, Herkimer County, NY. Jacob\u2019s will doesn\u2019t mention John Jr. (assumed because he was more under his uncle) and doesn\u2019t mention Michael, despite Michael being mentioned in his brother\u2019s will.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'little-falls-ny',
    },
    {
      id: 'michael-mosa-1826',
      laneId: 'harder',
      title: 'Michael in Mosa, 1 boy and 3 women',
      year: 1826,
      description:
        'Michael is in Mosa by 1826. He has 1 boy and 3 women with him. Given this household composition, it seems plausible that Catharine could be one of these women, and thus a daughter of Michael.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'mosa-on',
    },
    {
      id: 'john-jr-1828',
      laneId: 'harder',
      title: 'John Jr. in Rainham census',
      year: 1828,
      description:
        'Residing in Rainham in 1828 with 3 males over 16 and his wife, Catherine.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'rainham-on',
    },
    {
      id: 'michael-death',
      laneId: 'harder',
      title: 'Michael Harder dies',
      year: 1830,
      yearEnd: 1850,
      uncertain: true,
      description:
        'Dies between 1830 and 1850 in Mosa, Ontario, Canada. John Jr. mentions "our brother Michael" and his "only heir/child" in his will\u2014uncertain of Michael\u2019s heir\u2019s gender\u2014and believes Michael to be dead by that point.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 1,
      placeId: 'mosa-on',
    },
    {
      id: 'michael-ekfrid-1832',
      laneId: 'harder',
      title: 'Michael buys land in Ekfrid Township',
      year: 1832,
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'ekfrid-on',
    },
    {
      id: 'john-jr-mosa-1832',
      laneId: 'harder',
      title: 'John Jr. petitions for land in Mosa',
      year: 1832,
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'mosa-on',
    },
    {
      id: 'michael-mosa-1833',
      laneId: 'harder',
      title: 'Michael buys land in Mosa',
      year: 1833,
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'mosa-on',
    },
    {
      id: 'michael-ekfrid-1835',
      laneId: 'harder',
      title: 'Michael sells land in Ekfrid Township',
      year: 1835,
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'ekfrid-on',
    },
    {
      id: 'john-jr-militia-1837',
      laneId: 'harder',
      title: 'John Jr. re-enters the militia',
      year: 1837,
      description: 'Re-enters the militia in response to a small uprising.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 1,
      placeId: 'rainham-on',
    },
    {
      id: 'haldimand-1838',
      laneId: 'harder',
      title: 'Sells property in Haldimand County',
      year: 1838,
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'haldimand-on',
    },
    {
      id: 'michael-sells-mosa-1839',
      laneId: 'harder',
      title: 'Michael sells land in Mosa',
      year: 1839,
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'mosa-on',
    },
    {
      id: 'john-jr-aldborough-1840',
      laneId: 'harder',
      title: 'John Jr. in Aldborough',
      year: 1840,
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'aldborough-on',
    },
    {
      id: 'john-jr-death',
      laneId: 'harder',
      title: 'John Harder "Jr." dies',
      year: 1843,
      description: 'Dies in Germantown, NY.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'germantown-ny',
    },
    {
      id: 'michael-alive-1850',
      laneId: 'harder',
      title: 'Michael alive in Mosa (Adam testifies)',
      year: 1850,
      description:
        'Michael is alive in 1850, living in Mosa. Per a testimony from Adam, Michael served in the War of 1812. Michael also petitions for land again, claiming to have never received the land he was owed for serving in the War of 1812.',
      sources: [
        { label: 'PDF: Harder migrations' },
        { label: 'October 11, 1850 Land Inquiry' },
      ],
      confidence: 3,
      placeId: 'mosa-on',
    },
    {
      id: 'adam-census-1851',
      laneId: 'harder',
      title: '1851 Aldborough Census',
      year: 1851,
      description: 'Adam recorded in the 1851 Aldborough Census.',
      sources: [
        { label: 'PDF: Harder migrations' },
        { label: '1851 Aldborough Census' },
      ],
      confidence: 3,
      placeId: 'aldborough-on',
    },
    {
      id: 'john-fred-sell-1859',
      laneId: 'harder',
      title: 'John and Frederick sell land in Aldborough',
      year: 1859,
      description:
        'In 1859, John and Frederick sell land in Aldborough. They are living in Mosa as they write this\u2014likely on what was Michael\u2019s land, though without direct evidence.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'aldborough-on',
    },
    {
      id: 'adam-census-1861',
      laneId: 'harder',
      title: '1861 Aldborough Census',
      year: 1861,
      sources: [
        { label: 'PDF: Harder migrations' },
        { label: '1861 Aldborough Census' },
      ],
      confidence: 3,
      placeId: 'aldborough-on',
    },
    {
      id: 'adam-bayport-1862',
      laneId: 'harder',
      title: 'Adam in Wild Fowl Bay / Bayport / Ora Labora',
      year: 1862,
      description:
        'Adam is in Wild Fowl Bay / Bayport / Ora Labora by 1862. Adam and Catherine will be buried there.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'bay-port-mi',
    },
    {
      id: 'adam-death',
      laneId: 'harder',
      title: 'Adam Harder dies',
      year: 1869,
      description: 'Dies in Bay Port, Michigan.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'bay-port-mi',
    },

    // ─────────────────────────── ROWE ───────────────────────────
    {
      id: 'frederick-rowe-grant',
      laneId: 'rowe',
      title: 'Frederick Rowe (U.E. Loyalist) \u2014 land grant, Humberstone',
      year: 1790,
      uncertain: true,
      description:
        'Frederick Rowe, United Empire Loyalist, receives a land grant in Humberstone. Exact year not yet confirmed.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 1,
      placeId: 'humberstone-on',
    },
    {
      id: 'catharine-rowe-birth',
      laneId: 'rowe',
      title: 'Catharine Rowe born',
      year: 1809,
      yearEnd: 1813,
      uncertain: true,
      description:
        'The 1851 Census estimates her birth year as 1809 in New York State; the 1861 Census puts it at 1811 in Upper Canada; her tombstone puts it at 1813. Possibly born in New York per the 1851 Census, but much more likely born in Canada per 1861. Definitely born to a United Empire Loyalist family.',
      sources: [
        { label: 'PDF: Harder migrations' },
        { label: '1851 Aldborough Census' },
        { label: '1861 Aldborough Census' },
      ],
      confidence: 2,
      placeId: 'humberstone-on',
    },
    {
      id: 'catharine-rowe-marries-adam',
      laneId: 'rowe',
      title: 'Catharine Rowe marries Adam Harder',
      year: 1830,
      uncertain: true,
      description:
        'Catharine Rowe marries Adam Harder (date approximate; placed here for the line join). Rowe continues as a sub-thread on its own lane.',
      sources: [{ label: 'PDF: Harder migrations' }],
      joinsInto: { laneId: 'harder', atYear: 1830 },
      confidence: 1,
      placeId: 'mosa-on',
    },
    {
      id: 'catharine-rowe-death',
      laneId: 'rowe',
      title: 'Catharine Rowe Harder dies',
      year: 1869,
      description: 'Dies in Bay Port, Michigan.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 2,
      placeId: 'bay-port-mi',
    },

    // ─────────────────────────── GRAVES ───────────────────────────
    {
      id: 'catharine-graves-branches-off',
      laneId: 'graves',
      title: 'Catharine Harder marries John B. Graves',
      year: 1830,
      uncertain: true,
      description:
        'Approximate date placeholder for the Graves line branching off from the Harder line. Adjust once the marriage date is sourced.',
      sources: [{ label: 'PDF: Harder migrations' }],
      joinsInto: { laneId: 'harder', atYear: 1830 },
      confidence: 1,
      placeId: 'mosa-on',
    },
    {
      id: 'catharine-graves-death',
      laneId: 'graves',
      title: 'Catharine Harder Graves dies',
      year: 1866,
      description:
        'Died September 15th, 1866. Buried in Big Bend-Depew cemetery, Mosa, Ontario.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 3,
      placeId: 'mosa-on',
    },
    {
      id: 'alexander-graves',
      laneId: 'graves',
      title: 'Alexander Graves',
      year: 1860,
      uncertain: true,
      description:
        'Definitely a descendant of a Catherine Harder and John B. Graves, per his death certificate. Dates TBD.',
      sources: [{ label: 'PDF: Harder migrations' }],
      confidence: 1,
      placeId: 'mosa-on',
    },
  ],
};
