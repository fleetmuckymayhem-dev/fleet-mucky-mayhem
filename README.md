# Fleet Mucky Mayhem

Fleet Mucky Mayhem is a website for a social cycling group in Fleet, Hampshire, and the surrounding area. It includes information about the group, Regular and Longer Rides, past adventures, photos, and frequently asked questions.

This is version **2.0.0**, built with Astro and Bootstrap. It keeps the familiar website layout and styling while using a newer build system. The public client source repository is [fleetmuckymayhem-dev/fleet-mucky-mayhem](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem), with its own history separate from the original website repository. The original maintainer's Astro repository remains a separate private copy.

This guide is for Andy, the client's developer, and anyone else who needs to maintain the website. For routine ride updates, start with **The file you will normally edit** below. For a first introduction to the website code, start with the walkthrough and file guide here.

## Client update and release guides

The client has approved a public source repository and confirmed **fleetmuckymayhem.com** as the production domain, managed through IONOS. The planned client setup uses a client representative's GitHub account, individual collaborators, `main` and `staging` source branches, and a separate staging publishing repository.

| Guide | Purpose | Printable copy |
| --- | --- | --- |
| [Update, preview and publish](docs/client-handover/update-preview-publish.md) | Who requests, develops, tests, approves and publishes a change, including our support team's role throughout. | [PDF](docs/client-handover/update-preview-publish.pdf) |
| [Undo a release](docs/client-handover/undo-release.md) | Reporting a problem, authorising a reversal, publishing it and keeping staging aligned. | [PDF](docs/client-handover/undo-release.pdf) |

**Setup status, 23 October 2026:** the public client source repository has `main` and `staging` branches. Automatic staging publication is installed on `staging`, its dedicated deployment key is configured, and GitHub Pages is enabled in [staging-fleet-mucky-mayhem](https://github.com/fleetmuckymayhem-dev/staging-fleet-mucky-mayhem). The first build, tests, file publication and Pages deployment succeeded. The [client staging preview](https://fleetmuckymayhem-dev.github.io/staging-fleet-mucky-mayhem/) is available. See [staging setup](docs/client-handover/staging-setup.md) and the [readiness checklist](docs/client-handover/readiness-checklist.md) for evidence and outstanding work.

**Production is on hold.** The existing IONOS-hosted website, hosting configuration, domain, DNS, redirects, email records and certificates must remain untouched while we finish building, testing and documenting the replacement. No production deployment workflow has been installed. Production cutover requires a separate agreed plan and explicit client authorisation after readiness review. The client controls the eventual production release.

Branch protection, the remaining testing and an isolated release/undo rehearsal are still pending. The support contact and named client release approver also need recording. Use merge commits for release PRs so the documented Revert procedure can be rehearsed, and retain the permanent `main` and `staging` branches. The printable release and undo guides describe the future production process; they do not authorise publication now.

For supported updates, the client requests the work and tests the staging version. We handle development, checks, staging publication and preparation of the release PR. The client approves the tested version and merges the release PR into `main` to trigger automatic production deployment, then tells us so we can verify the live result. Any required GitHub approving review is completed before merging. The same ownership applies to an undo: we prepare and check the reversal PR; the client merges it to publish the reversal.

## Beginner website code walkthrough

The client presentation, **Fleet Mucky Mayhem: A beginner's guide to the website code**, covers this Astro project. It assumes no previous web development experience and explains the code using examples from the actual website. Build, publishing and deployment are outside the presentation's scope; their maintenance instructions remain later in this README.

The current presentation has **27 slides**, numbered consecutively. The latest revision removes the session-agenda slide and both dedicated Guided edit slides. The cover contains only the website name and presentation subtitle. The final **The file choices to remember** slide contains the file reference list, without the closing question. Small code examples remain in the walkthrough.

Allow up to 90 minutes for explanation, demonstrations and discussion. The supporting presenter guide suggests pacing; there is no timed agenda slide or dedicated exercise section in the presentation.

The editable presentation remains attached to the Codex chat where it was prepared. Downloadable PowerPoint and PDF copies, together with the supporting materials, are also included in [docs/website-code-walkthrough/](docs/website-code-walkthrough/):

| File | Purpose |
| --- | --- |
| [PowerPoint presentation](docs/website-code-walkthrough/fleet-mucky-mayhem-code-walkthrough.pptx) | Editable 27-slide deck with speaker notes. |
| [PDF presentation](docs/website-code-walkthrough/fleet-mucky-mayhem-code-walkthrough.pdf) | The same 27 slides for viewing or printing. |
| [presenter-guide.md](docs/website-code-walkthrough/presenter-guide.md) | Notes matching the current 27-slide order, explanation prompts and suggested pacing. |
| [learner-reference.md](docs/website-code-walkthrough/learner-reference.md) | A beginner's file guide, code explanations and glossary. |
| [walkthrough-content.json](docs/website-code-walkthrough/walkthrough-content.json) | The current slide text and speaker notes for maintaining the presentation. |
| [verify-walkthrough.mjs](docs/website-code-walkthrough/verify-walkthrough.mjs) | Checks the presentation content, source references and example ride data. Run `node docs/website-code-walkthrough/verify-walkthrough.mjs` from the project folder. |

These handover files are included when cloning this repository. The presentation materials describe the code and do not change the website. After revising the live deck, refresh both exported formats, the slide source and the supporting notes together.

### Which file controls which part of the website?

All paths below start at the project root, the folder containing `package.json`. The client's clone is named `fleet-mucky-mayhem`; the maintainer's original checkout is named `astro-prototype`.

| Change or question | Where to begin |
| --- | --- |
| Homepage section order | [src/pages/index.astro](src/pages/index.astro) lists the components in page order. |
| Browser tab title and shared page structure | [src/layouts/SiteLayout.astro](src/layouts/SiteLayout.astro) wraps the sections, loads styles and starts the main browser scripts. |
| Welcome, About Us, FAQ, contact details or other section wording | [src/components/](src/components/) contains the matching named section files. |
| Navigation links | [src/components/Navigation.astro](src/components/Navigation.astro). Links such as `#contact-us` must match the destination section's `id`. |
| Regular ride wording | [src/components/RideDiary.astro](src/components/RideDiary.astro). |
| Longer and archived ride information | [public/data/longer-rides.json](public/data/longer-rides.json). |
| Photo menu links | [public/data/photos.json](public/data/photos.json), independently of each ride's `photosUrl`. |
| Shared colours, fonts and spacing | [src/scss/styles.scss](src/scss/styles.scss) and the stylesheets it loads. Some components also have their own `<style>` block. |
| Navigation and Ride Diary interactions | [src/js/](src/js/); the main imports are in [src/scripts/site.ts](src/scripts/site.ts). |
| Upcoming ride/countdown or photo-year menu behaviour | [src/scripts/where-to-next.ts](src/scripts/where-to-next.ts) and [src/scripts/photos.ts](src/scripts/photos.ts). |
| Shared data checks and date calculations | [src/lib/](src/lib/). |
| Pictures and route maps | [public/img/](public/img/). A page reference such as `img/mm-qr-code.jpg` omits the `public/` folder name. |

HTML describes the content and structure. CSS/SCSS controls appearance. JavaScript/TypeScript handles behaviour. JSON stores structured information such as ride details. Bootstrap supplies shared styles and interactive controls. A component is a named piece of the page.

The homepage assembles the components inside the shared layout. Longer rides load from JSON through `src/lib/data.ts`; `src/js/ride-diary.js` creates their displayed entries. Regular rides remain directly in `RideDiary.astro`. Photos uses its own JSON file, component and browser script, so its year menus are independent of the ride programme.

Use `src/` and `public/` for source changes. `baseline/` is a historical comparison copy; `dist/`, `.astro/` and `node_modules/` are generated output, cache or installed dependencies. The sibling `fleet-mucky-mayhem/` folder contains the original website rather than this refactored site.

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

1. Open the client project in Windows VS Code through WSL. In Ubuntu, run `cd ~/projects/fleet-mucky-mayhem`, then `code .`. VS Code should show **WSL: Ubuntu-24.04** in the bottom-left corner.
2. Make sure you have the latest agreed working branch from GitHub. Work on a separate change branch based on `staging`, then open a PR into `staging`. If you already have unfinished changes, ask the maintainer for help before switching branches or pulling.
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

The client setup uses Windows VS Code connected to Ubuntu 24.04 through WSL. Run these commands in the **Ubuntu terminal**, using `npm`, not `npm.cmd`. Node.js 24.22.1 and npm 11.19.1 have passed the code check, all 18 tests and the production build there. Keep the project and its installed dependencies in Ubuntu's filesystem. Windows Smart App Control blocked Astro's native Windows compiler; the Ubuntu setup works with that protection left enabled.

Open the editor's terminal in the project folder containing `package.json`:

```bash
cd ~/projects/fleet-mucky-mayhem
```

On the first setup only, install the project dependencies:

```bash
npm ci
```

After every ride edit, save the file and run:

```bash
npm run validate:data
```

Success looks like `Validated site data: { rides: 31, photoYears: 3 }`. The counts change when the data changes. If an error appears, fix it before continuing.

Then build the website:

```bash
npm run check
npm test
npm run build
```

The build repeats the data check. Once it succeeds, start a preview:

```bash
npm run preview
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
| A new year does not appear | For the Ride Diary, check that rides are in the intended active/archive list with the correct year. For Photos, years follow the current UK date. Future years stay hidden; an archive year needs at least one real link. Rebuild after editing the links, then refresh. |
| A map is missing or a link opens the wrong place | Check the filename/path and open the actual URL. Data validation does not check image existence, link destinations, or photo-folder permissions. |
| The data check passes but a value is missing or says `undefined` | Restore the display fields listed above. Some fields are technically optional but still needed by the diary layout. |
| `npm` is not recognised, or installation/build fails | Ask the maintainer to check Node.js and the local setup. Keep the full error message. |

For JSON, remember: text is quoted (`"Woking"`); numbers are not (`36`); an undecided date is `null`; an empty notes list is `[]`. Do not leave out a required field just because its value is not known.

## Update Photos and add a new photo year

Edit **[public/data/photos.json](public/data/photos.json)**. The Photos section has three controls: Loan Bikes, Photos (the selected current year), and Archive Photos (older years). Archive years expand on click/tap or Enter/Space to show their links inside the same scrollable menu. They are generated from this file, newest first, independently of the Longer Rides programme.

The Photos year is determined when the page loads, using the UK calendar date (Europe/London), consistently for all visitors. There is no year setting to maintain. On 1 January, the previous year automatically moves into Archive Photos, without a rebuild. The Ride Diary programme remains independent.
- `loanBikesUrl` is the year-independent Loan Bikes folder.
- `years` holds one object per year. Each object has a numeric `year`, optional `regularRidesUrl` and `statisticsUrl`, and an `albums` list.
- Each album has a `label` (the complete button-menu text, including its date if wanted) and a shared HTTPS `url`. Albums appear in the order entered; keep them in calendar order.
- Omit an optional folder URL until it is available. Empty archive years stay hidden. An empty or missing current year displays a coming-soon message. Years later than the current UK year stay hidden while you prepare their links. Do not add placeholder URLs. Existing links, including prepared seasonal folders, remain visible until you remove them.

To add 2027, add an object to `years`, separated from its neighbour by a comma. This is a draft you can paste as a starting point:

```json
{
  "year": 2027,
  "albums": []
}
```

When a real collection is ready, add `regularRidesUrl`, `statisticsUrl`, or an album object such as `{ "label": "20 Feb : Ride name", "url": "https://app.box.com/s/YOUR_REAL_SHARED_LINK" }`. Replace the example link with the actual shared link before publishing. The links automatically appear in Photos when their year begins. If no links are ready, Photos displays a short coming-soon message for that year. Keep previous years in the list; they automatically appear under Archive Photos. Repeat the same steps for 2028 and later; no year setting or page-template changes are required.

Run `npm run validate:data`, then rebuild and preview as described above. Photos are rendered during the build, so changing this JSON requires a rebuild before publishing. Check every year dropdown and verify the changed links open the intended shared folders. Validation checks the structure and HTTPS URLs, but cannot confirm folder contents or sharing permissions.

Photos data is maintained separately from ride data: changing a ride's `photosUrl` does not update the Photos section. If the same album is linked in both places, update both when its URL changes.

## Save the checked update to GitHub

A **commit** is a saved checkpoint with a short description. **Push** uploads that checkpoint to the shared GitHub repository.

In the client's WSL-connected VS Code project:

1. Confirm you are on the agreed change branch based on `staging`.
2. Open **Source Control** and review the changes. Stage only files for this update, usually `public/data/longer-rides.json` and any new route-map images.
3. Commit with a clear message, such as `Update Canal Café departure time`, then push or publish the change branch.
4. Open a PR in `fleetmuckymayhem-dev/fleet-mucky-mayhem`, with **base: staging** and your change branch as the head.
5. Wait for **Check, test and build** and the agreed review. The support team merges the PR into `staging`; the staging workflow then builds and publishes the preview.
6. Check both the source workflow and the publishing repository's Pages deployment. Confirm the published version before sending the preview to the client.

If GitHub reports conflicting changes, ask the maintainer for help rather than overwriting somebody else’s work.

Pushing a change branch saves it to GitHub; merging into `staging` starts preview publication. Neither action changes the current IONOS production website. Production remains on hold until the replacement is built, tested and documented and a separate cutover is authorised.

If you spot a mistake after committing, make a correcting edit, repeat the checks, and create another commit. The maintainer can also recover earlier versions from Git history.

## Project reference for the maintainer

### Client staging preview

The client preview is **[staging-fleet-mucky-mayhem](https://fleetmuckymayhem-dev.github.io/staging-fleet-mucky-mayhem/)**. Changes merged into the public client source repository's `staging` branch run `.github/workflows/staging.yml`. After checks, tests and a successful build, `scripts/publish-client-staging.sh` copies the generated files to the separate staging repository's `main` branch. GitHub Pages publishes from that branch's root. Leave its custom domain empty.

The source workflow uses the `FMM_STAGING_DEPLOY_KEY` Actions secret; its public deploy key has write access only to the staging publishing repository. PR checks do not receive this key. Never commit either private keys or tokens. See [staging setup](docs/client-handover/staging-setup.md) for setup and replacement instructions.

The public preview has a `noindex, nofollow` tag, which discourages indexing but is not access control. Its `staging-version.json` records the source commit and workflow run. Check those against the successful deployment before requesting client approval.

To prepare a client staging build locally in Ubuntu without publishing:

```bash
FMM_STAGING_SITE=https://fleetmuckymayhem-dev.github.io npm run build:staging
```

This writes to `artifacts/staging-site/`, separate from the normal `dist/` build. A successful source workflow confirms that files were pushed; the separate Pages deployment must also succeed before the preview is current.

### Maintainer's historical preview

The original preview at https://martin-ferrero-thompson.github.io/staging-fleet-mucky-mayhem/ remains separate. Its Windows script `scripts/publish-staging.ps1` is tied to Martin's original private repository and account. Do not use it to publish the client's preview. Without `FMM_STAGING_SITE`, a local staging build retains that historical site's origin for compatibility.

`scripts/verify-staging.mjs` checks the preview with Playwright/Edge at mobile and desktop widths. Set `STAGING_QA_URL` to the live preview URL to verify an actual deployment, or serve the staging build locally under `/staging-fleet-mucky-mayhem/` first. Like the other browser scripts, it accepts `QA_PACKAGE_ROOT` for an externally installed Playwright package.

| Location | Purpose |
| --- | --- |
| `src/components/` | Website sections and layout content. |
| `src/layouts/`, `src/pages/` | Shared page layout and homepage. |
| `src/scss/` | Website styling. |
| `src/js/`, `src/scripts/`, `src/lib/` | Browser interactions, ride rendering, countdown, validation, and date handling. |
| `public/data/` | Longer Ride programme, authoring template, and yearly Photos links. |
| `public/img/` | Static images and route maps. |
| `tests/`, `scripts/` | Unit tests, data validation, and browser/visual verification tools. |
| `baseline/` | Historical migration comparison copy; not the active content to edit. |
| `dist/`, `.astro/`, `node_modules/`, `artifacts/` | Generated builds, cache, installed dependencies, and local test evidence. Do not edit these to change a ride. |

Useful commands in Ubuntu: `npm run dev` for a development server, `npm run check` for Astro/TypeScript diagnostics, and `npm test` for the unit tests. `npm run build` validates site data and builds the static site; `npm run preview` serves that build locally. These local commands do not publish a website.

The full browser check is `scripts/verify-full-browser.mjs`; countdown and populated General Info checks are in `scripts/verify-countdown.mjs` and `scripts/verify-general-info.mjs`. These need a separately available Playwright installation and Edge. Screenshot comparison uses `scripts/compare-screenshots.py` with Python/Pillow. See [VERIFICATION.md](VERIFICATION.md) for historical migration evidence and its limits.
