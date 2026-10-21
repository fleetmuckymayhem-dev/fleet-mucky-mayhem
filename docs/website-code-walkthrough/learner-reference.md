# Fleet Mucky Mayhem: website code reference

## Where to start

The project folder for this lesson is `P:\bootstraprefactor\astro-prototype`. All shorter paths below start inside it. This workspace also contains the original website in `fleet-mucky-mayhem`. The `baseline` folder inside the Astro project is a historical comparison copy.

| What you want to change | Where to begin |
| --- | --- |
| Opening welcome text | `src/components/Hero.astro` |
| About Us text or carousel images | `src/components/AboutUs.astro` |
| Contact words, email links or QR image | `src/components/ContactUs.astro` |
| FAQ wording | `src/components/Faq.astro` |
| Navigation links | `src/components/Navigation.astro` |
| Regular ride wording | `src/components/RideDiary.astro` |
| Longer or archived ride details | `public/data/longer-rides.json` |
| Links in the Photos menus | `public/data/photos.json` |
| Page section order | `src/pages/index.astro` |
| Browser tab title and shared page wrapper | `src/layouts/SiteLayout.astro` |
| Shared appearance | `src/scss/styles.scss` and the files it loads |
| Section-specific appearance | Sometimes a `<style>` block inside its component |
| Navigation click behaviour | `src/js/navlink.js` |
| Longer ride display and controls | `src/js/ride-diary.js` |
| Upcoming ride and countdown display | `src/scripts/where-to-next.ts` |
| Photo year menu selection | `src/scripts/photos.ts` |
| Ride checks and loading | `src/lib/data.ts` |
| Date calculations | `src/lib/dates.ts` |
| Photo checks and year helpers | `src/lib/photos.ts` |
| Static pictures and route maps | `public/img/` |

Search for the exact visible phrase if you are unsure. It can appear in several files, so check each match before changing it. Generated folders such as `dist`, `.astro` and `node_modules` are not the source for content edits.

## Reading a component

`src/pages/index.astro` lists the sections in page order. Each named component supplies a piece of the page. `SiteLayout.astro` supplies the surrounding HTML document.

Some Astro files begin with code between two `---` lines. This area prepares the template, for example by importing a component or reading data. The markup underneath describes its page content. That preparation code is separate from browser interactions in a `<script>` element or an imported browser script.

`<slot />` in the layout marks where the sections inside `<SiteLayout>...</SiteLayout>` go.

## HTML patterns

```html
<h2 class="brand-text display-2">Contact Us</h2>
```

`h2` marks a heading. The visible words sit between the opening and closing tags. `class` supplies labels that styles or scripts can use.

```html
<a href="#contact-us">Contact Us</a>
```

`a` creates a link. `href` is its destination. The hash in `#contact-us` points to the element with `id="contact-us"` on this page. A complete `https://...` address points to a web address. A `mailto:...` address asks the browser to open an email application.

An ID identifies one element on the page. A class can appear on many elements. Scripts and Bootstrap controls can depend on IDs, so keep the matching references together.

```html
<img src="img/mm-qr-code.jpg" alt="QR Code for WhatsApp Group">
```

This simplified example points to `public/img/mm-qr-code.jpg`. The URL omits `public/`. Match spelling and letter case exactly. `alt` supplies a text description. When replacing an image, check whether its description also needs to change.

## CSS and Bootstrap

A CSS rule chooses elements and applies appearance settings:

```css
.brand-text {
  color: var(--bs-warning);
}
```

This shortened rule selects the `brand-text` class and uses Bootstrap’s warning colour. The source rule also sets the font. A shared class change may affect headings and links throughout the page.

Bootstrap supplies common classes such as `container`, `row`, `col`, `btn` and `btn-warning`. The project imports both its styles and its browser behaviour.

A media query applies styling under particular conditions, such as a narrow browser width. Check the affected section at a narrow width as well as a wide one. An Astro component’s `<style>` block usually applies to that component; explicit global selectors can reach more widely.

## JSON patterns

JSON stores named values. These are fragments to explain the syntax, not complete ride records.

| Example | Meaning |
| --- | --- |
| `"title": "Canal Café"` | Text in double quotes |
| `"distanceMiles": 30` | A number without quotes |
| `"date": null` | No date set |
| `"notes": []` | An empty list |
| `{ ... }` | One object or record |
| `[ ... ]` | A list of values or records |

Names use double quotes. Commas separate neighbouring fields and neighbouring list items. Do not add a comma after the final item. JSON does not allow comments.

## Ride data

`longer-rides.json` contains the active `longerRides` list and the `archivedRides` list. `programmeYear` labels the active programme. At preparation time it is 2027 and the active list is empty.

The browser loads the ride file through `src/lib/data.ts`. The diary script creates the longer and archived ride entries in the area supplied by `RideDiary.astro`. Regular rides have their content directly in that component.

Where To Next reuses the active ride data. It chooses the earliest future departure with a date, using UK time. Archived rides and undated rides do not qualify. Its current no-future-ride fallback is a separately coded Midwinter Celebration for 1 December 2026 at 19:00. This seasonal fallback needs deliberate maintenance.

### A complete practice record

This is invented training data for a separate scratch file. It is not an agreed ride to add to the client programme.

```json
{
  "id": "training-canal-cafe-2027-tbd",
  "title": "Training Canal Café",
  "date": null,
  "year": 2027,
  "startTime": "09:30",
  "destination": "Fleet",
  "distanceMiles": 30,
  "overallTime": "4 hours",
  "rideTime": "TBC",
  "meetPoint": {
    "name": "Reading Road Canal Wharf"
  },
  "guidance": "Training example only.",
  "notes": []
}
```

A dated ride uses a real `YYYY-MM-DD` date, a matching numeric year and a 24-hour `HH:MM` departure time. Each ride ID must be unique across both lists.

`ride-template.json` contains guidance and several objects. Copy only the `newRide` object when preparing a real entry. Replace the date placeholder, give it a unique ID, and remove the empty optional `meetPoint.note` if it is unused. Replace placeholder URLs with real shared links, or remove unused optional URL fields. The template is not ready to use unchanged.

Include the display information the diary needs, including destination, departure time and overall time. Use `"rideTime": "TBC"` when the cycling time is unknown. A route-map image path, if supplied, starts with `img/ride-maps/`; the file itself lives under `public/img/ride-maps/`.

The data checks catch many structural mistakes, including duplicate IDs and invalid dates. They cannot confirm that an image exists or that a shared album is accessible to a visitor.

## Photo data

`photos.json` has a year-independent Loan Bikes URL and a list of yearly collections. A collection can include regular ride photos, statistics and labelled album links.

The Photos component prepares collections from this data. The browser script uses the current UK calendar year to place them in the current or archived menus. Future years stay hidden. Empty archive years stay hidden, and an empty current year gets a coming-soon message. Photo years are separate from the ride programme year.

A ride’s `photosUrl` and the Photos menu’s album URL are separate entries. If the same shared folder appears in both, update both when the link changes. Open shared links as a visitor to confirm access.

## JavaScript patterns

A variable names a value. A function groups instructions under a name. An event is something that happens, such as a click.

`document.querySelectorAll('.nav-link')` finds page elements with that class. `addEventListener('click', ...)` registers code to run when a click happens. `classList.add('active')` adds a class label.

Bootstrap controls also depend on matching attributes. For a FAQ, `data-bs-target="#question-one"` connects the button to the answer with `id="question-one"`. Renaming one side alone breaks the connection.

## If something looks wrong

| Symptom | First check |
| --- | --- |
| Wrong wording | Search for the exact phrase in source |
| Missing image | Compare the URL with the file path and filename |
| Link goes to the wrong place | Check `href` or the relevant JSON URL |
| Accordion opens the wrong answer | Compare its target and the corresponding unique ID |
| JSON syntax error | Inspect the edited line and the line before it for quotes and commas |
| A field displays `undefined` | Compare the ride with a complete record and check the display fields |
| Script stops responding | Inspect the browser Console and keep the full error text |
| Preview looks unchanged | Confirm the correct practice project and preview workflow with the maintainer |

Browser developer tools let you inspect the current page. Edits made only in their Elements panel are temporary and do not update the source files.

When asking for help, include the file path, what you changed, what you expected, what happened and the full error message.

## Small glossary

| Term | Plain-language meaning |
| --- | --- |
| Source | The files we edit to change the site |
| Browser | The application displaying the page |
| Editor | The application used to edit source files |
| Component | A named piece of a page |
| Layout | The shared wrapper around page content |
| Tag | An HTML label such as `<p>` or `<h2>` |
| Attribute | A named detail on an element, such as `href` |
| Selector | A pattern choosing page elements, such as `.brand-text` |
| Responsive | Able to adapt to different screen widths |
| Library | Reusable code that supplies common features |
| Array | A list |
| Object | A set of named values |
| Render | Turn structure or data into a visible result |
| DOM | The browser’s representation of the page elements |
| TypeScript | JavaScript with extra type descriptions that help catch mistakes |
| Validation | Checking information against rules |

The project README contains fuller maintenance instructions. Build and deployment are topics for a separate session.
