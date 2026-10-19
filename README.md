# Fleet Mucky Mayhem

Fleet Mucky Mayhem is a website for a social cycling group in Fleet, Hampshire, and the surrounding area. It includes information about the group, Regular and Longer Rides, past adventures, photos, and frequently asked questions.

This is version **2.0.0**, built with Astro and Bootstrap. It keeps the familiar website layout and styling while using a newer build system. This private GitHub repository has its own history, separate from the original website repository.

This guide is for Andy and anyone else who needs to update Longer Rides. You do not need to edit the website layout or learn programming for routine ride updates.

## The file you will normally edit

Open **[public/data/longer-rides.json](public/data/longer-rides.json)**.

This file holds the ride details shown in the Ride Diary and supplies the next upcoming ride in **Where To Next**. JSON is simply a structured text format: labels such as `"title"` identify the information that follows.

When there are no future dated Longer Rides, Where To Next displays only the festive **Muckies Midwinter Celebration** image alongside the section heading. All separate event details, the ride countdown, introduction, and route-map caption are hidden. Adding a future dated ride restores the normal ride display after refreshing. The celebration is a fixed fallback in the website code, not an entry in this ride file; it stays until a future ride is available or the maintainer updates it. A data-loading error still uses the existing TBD display.

There are two lists inside the file:

| List | What it contains |
| --- | --- |
| `"longerRides"` | The active Longer Rides programme, now 2027, including rides that have already happened. |
| `"archivedRides"` | Past programmes, currently displayed under the 2026, 2025 and 2024 archive choices. |

The top-level `"programmeYear": 2027` identifies the programme being prepared. While `longerRides` is empty, the diary displays “The 2027 Longer Rides programme will be published here soon.” Adding rides replaces that message automatically. Archive choices are generated from the years present in `archivedRides`, newest year first; no template or JavaScript changes are needed when another year is added. Rides within each programme stay in calendar order, with undecided dates last.

Regular Rides are maintained separately in the website templates. Changing this JSON file does not change Regular Rides.

## Before you start

1. Open the project folder in your editor. On the current computer it is `P:\bootstraprefactor\astro-prototype`; another computer may use a different location.
2. Make sure you have the latest version from GitHub. If you use GitHub Desktop, click **Fetch origin**, then **Pull origin** if offered. If you already have unfinished changes, ask the maintainer for help before pulling.
3. Open `public`, then `data`, then `longer-rides.json`.
4. Make one small change at a time. Save and check it before continuing.

Use a plain-text code editor, such as the editor already used for this project. Do not use Word or another word processor, which may replace ordinary quotation marks with curly ones.

## Change an existing ride

1. Use the editor’s Find command (**Ctrl+F** on Windows) to find the ride title.
2. Check the date as well: some titles appear more than once.
3. Change only the values you need. Leave the labels on the left unchanged.
4. Save the file with **Ctrl+S**.
5. Follow **Check your changes** below before saving the change to GitHub.

For example, to change a departure to 09:00, edit:

```json
"startTime": "09:00"
```

For an earlier or different meeting point, also update the meeting-point name, map link, and optional note where appropriate.

### What each field means

| Field | What to enter |
| --- | --- |
| `id` | A unique internal name, for example `canal-cafe-2027-11-14`. Use lowercase letters and hyphens. Do not reuse another ride’s ID, including archived rides. Leave it unchanged for routine edits; when copying a ride, give the copy a new ID. |
| `title` | The ride name visitors see, for example `"Canal Café"`. |
| `date` | A date in year-month-day order: `"2027-11-14"` means 14 November 2027. Use `null` without quotation marks when the date is undecided. |
| `year` | The programme year as a number, for example `2027`. It must match the year in the date; for an undecided date, use the intended programme year. |
| `startTime` | Departure time using a 24-hour clock, such as `"09:30"` or `"08:30"`. Times are UK local time, including summer time. Always supply this for the diary. |
| `destination` | Where the ride goes. |
| `distanceMiles` | A number only, such as `36` or `36.5`. The website adds “miles”. |
| `overallTime` | The whole outing, including stops, for example `"5.5 hours"`. |
| `rideTime` | Time spent cycling, excluding café stops and other breaks, for example `"4 hours"`. Use `"TBC"` if unknown; leaving this field out also displays TBC. |
| `meetPoint.name` | The meeting location, inside the `meetPoint` block. |
| `meetPoint.googleMapsUrl` | The Google Maps link to that meeting location. Check it opens the right place. |
| `meetPoint.note` | Optional extra instruction, such as `"NOTE EARLIER START"`. Delete this whole field when there is no note; do not leave an empty string. Keep a map link if using a meeting-point note: the current diary displays the note alongside that link. |
| `guidance` | Route advice, train arrangements, food/water requirements, or other information for riders. |
| `notes` | An account of the ride afterwards. Use `[]` when there are no notes. |
| `photosUrl` | The shared photos-folder link. Keep a valid, usable link; the diary currently renders a Photos link even if this field is missing. Ask the maintainer if no folder is available. |
| `routeMapImage` | Optional route-map picture for Where To Next. See **Route maps and photos** below. |
| `reliveUrl` | Optional link to a Relive recording. Delete the whole field if there is no recording. |

Keep Destination, Distance, Departure Time, Overall Time, Guidance, and the photo link filled in. Although the automatic check permits some missing fields, the diary needs these details to display useful information.

The website supplies headings, the “Timings below are for guidance only!” message, and units such as “miles”. Do not add those labels to the values yourself.

## Add a Longer Ride

The simplest method is to copy an existing ride in the correct list, then change its details.

1. In `"longerRides"`, select one complete ride, from its opening `{` to its matching closing `}`. A ride includes a smaller `meetPoint` block, so do not stop at that block’s closing brace.
2. Copy and paste the complete ride into the same list.
3. Put a comma **between** the old ride and the new one. There must be no comma after the final ride in a list.
4. Give the new ride a unique `id`, then update the title, date, year, times, destination, distance, meeting point, guidance, and links.
5. Clear copied reports by setting `"notes": []`. Remove any copied Relive link or meeting-point note that does not apply.
6. Check any copied map or photo link belongs to the new ride.
7. Save, validate, and preview as described below.

Here is an example of one complete ride. It is an illustration, **not a scheduled event**. Replace its details and supply the real photos-folder link before using it.

```json
{
  "id": "canal-cafe-2027-11-14",
  "title": "Canal Café",
  "date": "2027-11-14",
  "year": 2027,
  "startTime": "09:30",
  "destination": "Woking",
  "distanceMiles": 36,
  "overallTime": "5.5 hours",
  "rideTime": "4 hours",
  "meetPoint": {
    "name": "Reading Road Canal Wharf",
    "googleMapsUrl": "https://maps.app.goo.gl/Rz6o6LjYwvr6974ZA"
  },
  "guidance": "Towpath ride to Woking. Bring water and check the train arrangements.",
  "notes": [],
  "photosUrl": "REPLACE_WITH_THE_REAL_SHARED_PHOTOS_LINK"
}
```

The file must keep this overall structure. The words below are an explanation, not text to paste into the JSON:

```text
{
  "_schema": { ...leave this existing block unchanged... },
  "longerRides": [
    { ...first complete ride... },
    { ...next complete ride... }
  ],
  "archivedRides": [
    { ...first archived ride... },
    { ...next archived ride... }
  ]
}
```

Rides are displayed in date order within each supported year, with undecided dates at the end. You do not need to move entries around to change their displayed order.

An additional reference is [public/data/ride-template.json](public/data/ride-template.json). Copy only the ride object inside `newRide`, not the whole template file or its instructions. Replace every placeholder. The template contains `"note": ""`: remove that field unless you enter a real note, because empty notes fail validation.

### A date that is not yet confirmed

Set the date to `null`, keep the intended `year`, and use a unique ID such as `"canal-cafe-2027-tbd"`:

```json
"date": null,
"year": 2027
```

The diary displays **TBD**. Undated rides are excluded from the next-ride countdown. When the date is agreed, change `date` and check `year`; you can also update the ID to match, provided it remains unique.

## Add guidance or notes after a ride

Keep guidance about the planned route in `guidance`. Put the account of what actually happened in `notes`.

For several notes, use a list of quoted entries:

```json
"notes": [
  "09:30 Ten riders set off in excellent weather.",
  "11:20 Food at the café was excellent.",
  "14:20 Arrived back in Fleet."
]
```

The site separates entries with line breaks or paragraphs, depending on their length. Guidance can also be a list of quoted entries when you want separate paragraphs.

Use ordinary text rather than HTML tags. If your text needs double quotation marks, put a backslash before each one: `"We used the \"broom wagon\" for the return."` Apostrophes, such as in `"Andy's ride"`, do not need a backslash.

## Remove a ride or keep it as history

To remove an entry completely:

1. Find the correct title **and date**.
2. Delete the entire ride from its opening `{` to its matching closing `}`, including its meeting point, guidance, notes, and links.
3. Repair the comma between neighbouring rides. If you deleted the last ride, remove the comma after the ride that is now last. If a list becomes empty, leave it as `[]`.
4. Keep the outer `"longerRides"` and `"archivedRides"` lists and the `_schema` block.
5. Save, validate, and preview.

Deleting a future ride may change Where To Next and its countdown. Deleting an archived ride removes its diary entry and links, but does not delete its external photo folder.

If you want to preserve a ride’s history, leave it in the programme after it has happened and add notes/photos. It will automatically stop being eligible for Where To Next at its departure time. Moving a ride into the archive is a manual action when the client closes the programme; it does not depend on the calendar date.

Do not delete image files as part of a routine ride removal: another ride may share the same map.

## Start a new annual programme

1. Move the completed programme’s entire ride entries from `longerRides` to `archivedRides`. Preserve their IDs, dates, years, notes and links, and keep the older archive entries.
2. Set the top-level `programmeYear` to the next programme year. Leave `longerRides` as `[]` until the new schedule is available.
3. Add the new schedule to `longerRides`, with new unique IDs and matching dates/years. Do not change an archived ride’s year to reuse it.
4. Validate and preview Longer Rides, each archive year, and Where To Next before publishing.

The archive dropdown updates automatically. Where To Next only selects future dated entries from `longerRides`; archived rides never become upcoming rides. While the new list is empty, the existing Midwinter Celebration fallback remains in place. That seasonal image is maintained separately from the programme rollover.

## Route maps and photos

- **Meeting-point map:** paste the Google Maps share link into `meetPoint.googleMapsUrl`. This is separate from the route-map picture.
- **Route-map picture:** place the image in `public/img/ride-maps/`. Use a simple filename with lowercase letters and hyphens, such as `canal-cafe.png`. Set `"routeMapImage": "img/ride-maps/canal-cafe.png"` in the ride. Notice that the data path starts with `img/`, **not** `public/`. Match the filename and capital letters exactly.
- **No route map:** omit `routeMapImage`; Where To Next uses the existing “no map provided” picture.
- **Photos:** paste the shared folder’s full URL into `photosUrl`. Check the folder’s sharing settings and test the link as a visitor, ideally while signed out.
- **Relive:** add `"reliveUrl": "YOUR_REAL_RELIVE_LINK"` only when there is a recording.

Route-map pictures are used by Where To Next; they are not currently displayed inside the Longer Ride’s General Info table. Add any new image to the same GitHub commit as the data change.

## Check your changes

These instructions use Windows PowerShell and the local project setup. The maintainer should help with the initial installation of Node.js, GitHub access, and the editor. This project has been verified with Node.js 24.14.1.

Open the editor’s terminal in the project folder—the folder containing `package.json`. If it opens somewhere else, on the current computer enter:

```powershell
Set-Location 'P:\bootstraprefactor\astro-prototype'
```

On the first setup only, install the project dependencies:

```powershell
npm.cmd ci
```

After every ride edit, save the file and run:

```powershell
npm.cmd run validate:data
```

Success looks like `Validated site data: { rides: 31 }`. The number changes when rides are added or removed. If an error appears, fix it before continuing.

Then build the website:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run build
```

The build repeats the data check. Once it succeeds, start a preview:

```powershell
npm.cmd run preview
```

Open the local address printed in the terminal, normally [http://127.0.0.1:4321/](http://127.0.0.1:4321/). If another copy is already running, stop it with **Ctrl+C** in its terminal or use the different address printed by the new preview.

Check:

- Ride Diary → Longer Rides, or the appropriate archive year: title, date, all General Info values, guidance, and notes.
- Google Maps, Photos, and Relive links, where supplied.
- Where To Next if the change affects the next future ride. It selects the earliest future dated ride from `longerRides`, based on UK departure time; it does not select archived or undated rides.
- The layout on a narrow browser window as well as a wide one.

Stop the preview with **Ctrl+C** when finished. After further edits, stop the preview, rebuild, then start it again. A production preview does not rebuild your changes automatically.

If a previously deleted ride still appears, refresh the page. If needed, use **Ctrl+F5** to refresh without using the browser’s cached copy.

### Common problems

| Problem | What to check |
| --- | --- |
| An error mentioning JSON, a comma, or an unexpected character | Check the edited area and the line before it. Use double quotation marks, commas between entries, and no trailing comma before `}` or `]`. Do not add comments to JSON. |
| `duplicate IDs` | Two rides share an `id`. Give the copied/new ride a unique ID. |
| `year/date mismatch`, invalid date, or invalid time | Use a real date in `YYYY-MM-DD` format, a matching numeric year, and a 24-hour time in `HH:MM` format. |
| `expected nonempty text` | A field was left as `""`. Fill it in, or remove the whole field if it is optional. For an unknown ride time use `"TBC"`. |
| The error names `longerRides[2]` | Entries are counted from zero: `[0]` is the first ride, `[1]` the second, `[2]` the third. |
| A new year does not appear | The diary needs code support for that year. Ask the maintainer; the data check does not test year-section availability. |
| A map is missing or a link opens the wrong place | Check the filename/path and open the actual URL. Data validation does not check image existence, link destinations, or photo-folder permissions. |
| The data check passes but a value is missing or says `undefined` | Restore the display fields listed above. Some fields are technically optional but still needed by the diary layout. |
| `npm` is not recognised, or installation/build fails | Ask the maintainer to check Node.js and the local setup. Keep the full error message. |

For JSON, remember: text is quoted (`"Woking"`); numbers are not (`36`); an undecided date is `null`; an empty notes list is `[]`. Do not leave out a required field just because its value is not known.

## Save the checked update to GitHub

A **commit** is a saved checkpoint with a short description. **Push** uploads that checkpoint to the shared GitHub repository.

If using GitHub Desktop:

1. Select the `fleet-mucky-mayhem-astro` repository.
2. Review **Changes**. Select only the files for this update—usually `public/data/longer-rides.json` and any new route-map images.
3. Enter a clear summary, such as `Update Canal Café departure time`.
4. Click **Commit to main**, then **Push origin**. If you are working on another branch, follow the maintainer’s agreed review process instead.
5. Open GitHub and confirm the update is there.

If GitHub reports conflicting changes, ask the maintainer for help rather than overwriting somebody else’s work.

**Pushing to GitHub saves the project; it does not by itself guarantee the public website has been updated.** The live site needs the agreed build/deployment process. Confirm with the maintainer when the checked update should go live.

If you spot a mistake after committing, make a correcting edit, repeat the checks, and create another commit. The maintainer can also recover earlier versions from Git history.

## Project reference for the maintainer

| Location | Purpose |
| --- | --- |
| `src/components/` | Website sections and layout content. |
| `src/layouts/`, `src/pages/` | Shared page layout and homepage. |
| `src/scss/` | Website styling. |
| `src/js/`, `src/scripts/`, `src/lib/` | Browser interactions, ride rendering, countdown, validation, and date handling. |
| `public/data/` | Longer Ride programme and authoring template. |
| `public/img/` | Static images and route maps. |
| `tests/`, `scripts/` | Unit tests, data validation, and browser/visual verification tools. |
| `baseline/` | Historical migration comparison copy; not the active content to edit. |
| `dist/`, `.astro/`, `node_modules/`, `artifacts/` | Generated builds, cache, installed dependencies, and local test evidence. Do not edit these to change a ride. |

Useful commands: `npm.cmd run dev` for a development server, `npm.cmd run check` for Astro/TypeScript diagnostics, and `npm.cmd test` for the unit tests. `npm.cmd run build` validates ride data and builds the static site; `npm.cmd run preview` serves that build locally.

The full browser check is `scripts/verify-full-browser.mjs`; countdown and populated General Info checks are in `scripts/verify-countdown.mjs` and `scripts/verify-general-info.mjs`. These need a separately available Playwright installation and Edge. Screenshot comparison uses `scripts/compare-screenshots.py` with Python/Pillow. See [VERIFICATION.md](VERIFICATION.md) for historical migration evidence and its limits.
