# Fleet Mucky Mayhem: presenter guide

27 slides • Allow up to 90 minutes including discussion • Updated 21 October 2026

Use the live presentation alongside the editor and an already-working local preview. These notes cover the website source code. Build, publishing and deployment belong in a separate session. This version matches the revised deck: the agenda and dedicated Guided edit slides have been removed, along with the cover's session details and the final slide's closing question.

## Before the session

- Open `P:\bootstraprefactor\astro-prototype` in the editor and have its preview ready before the learner arrives.
- Keep the browser and editor ready to switch between. Increase editor text size so the learner can read it.
- Open `src/pages/index.astro`, `src/layouts/SiteLayout.astro`, `src/components/ContactUs.astro`, `src/components/Faq.astro`, `public/data/longer-rides.json` and `public/data/photos.json`.
- Use a disposable local copy if demonstrating a source edit. Restore demonstration changes afterwards.
- Give the learner the companion reference. Use “beginner’s guide” as the client-facing title.

## Teaching approach

Show a familiar part of the page before its source. Introduce one term at a time. Read code aloud in plain language, then let the learner explain it back. If syntax discussion starts to overwhelm them, return to the visible result and the file choice. The presentation contains small code examples without dedicated guided-edit exercises.

## Suggested pacing for the presenter

This pacing is guidance for a session of up to 90 minutes, including questions. It is not a slide in the deck. Use the time freed by the removed exercises for clarification and discussion.

| Minutes | Slides | Activity |
| --- | --- | --- |
| 00–05 | 1 | Welcome and introduction |
| 05–15 | 2–5 | Browser, editor and code types |
| 15–25 | 6–9 | Folders, homepage, layout and components |
| 25–40 | 10–15 | Text, links, images and styling |
| 40–45 | 16 | Recap and short pause |
| 45–60 | 17–22 | JSON, rides, upcoming selection and Photos |
| 60–70 | 23–26 | Events, Bootstrap controls and investigation |
| 70–90 | 27 | File reference recap and discussion |

## Slide-by-slide notes

### 1. Fleet Mucky Mayhem

TIME 00:00–05:00 (5 minutes).

Welcome the developer and explain that no web experience is assumed. Use 'beginner’s guide' with the client. The goal is to recognise familiar patterns, find the right file, and make a small change with support. Explain that it is normal to look things up and that professional developers do too. Ask what programming or editing experience they already have. Keep build, publishing and deployment for a separate session.

PREPARATION: Have the Astro project open in an editor and an already-working preview ready. Use the preview for demonstrations. Do not change client content as part of the lesson.

### 2. The browser displays the website

TIME 05:00–08:00 (3 minutes).

Show the working preview, then the editor, and name each. Scroll the page and point out the navigation, About Us, Ride Diary and Photos. Explain that a page can contain many sections. Clicking About Us moves within this page rather than opening a separate About page. An editor changes the saved source; the browser displays the resulting page. Do not discuss how the site is built or published. CHECK: Ask the learner to point to the browser and then to the editor. Expected answer: browser shows the site, editor changes its source.

Source files, relative to `astro-prototype/`: `src/pages/index.astro`, `src/components/Navigation.astro`.

### 3. Each kind of code has a job

TIME 08:00–11:00 (3 minutes).

Use the Contact Us section as the shared example. HTML says there is a heading and a link. CSS makes the heading yellow and italic. JavaScript helps navigation and interactive controls respond. JSON supplies repeated information elsewhere, such as longer rides. Mention that SCSS is the stylesheet format used in this project and TypeScript is JavaScript with extra descriptions that help catch mistakes. Keep those distinctions light until later slides. CHECK: Which kind of code would you look at for a colour change? CSS/SCSS. For a ride distance? JSON.

Source files, relative to `astro-prototype/`: `src/components/ContactUs.astro`, `src/scss/styles.scss`, `src/scripts/site.ts`, `public/data/longer-rides.json`.

### 4. Reading a little HTML

TIME 11:00–13:00 (2 minutes).

Read the line out loud from left to right. Explain that a tag is a label in angle brackets and that the slash marks the end. The opening and closing heading tags surround the text. Attributes are named details inside the opening tag; class is one example. The quotes surround the attribute value. brand-text is a project style; display-2 is a Bootstrap style. Do not explain CSS implementation yet. Ask the learner to point only to the part they would edit to rename the heading. Expected answer: the words Contact Us between the tags.

Source files, relative to `astro-prototype/`: `src/components/ContactUs.astro`.

### 5. The file endings are clues

TIME 13:00–15:00 (2 minutes).

Explain that a file extension is the part after the final dot. .astro files often look mostly like HTML. Some also have a preparation section between --- lines. .ts files add type information to JavaScript; the learner can first read the variable and function names without understanding every symbol. JSON is data, not instructions that execute. Images are separate files that the page points to. CHECK: If the request is to change a photo album URL, which extension is likely? .json. Avoid presenting these as universal rules for every project: this slide describes this repository.

Source files, relative to `astro-prototype/`: `src/pages/index.astro`, `src/scss/styles.scss`, `src/scripts/site.ts`, `public/data/photos.json`.

### 6. The folders you will use

TIME 15:00–18:00 (3 minutes).

Open this folder tree in the editor and expand only the folders on screen. src means source. A component is a named piece of a page; lib holds reusable helper code. Explain that this workspace also contains the original fleet-mucky-mayhem project, and astro-prototype/baseline is a historical comparison copy. The lesson uses astro-prototype/src and astro-prototype/public. Generated folders such as dist, .astro and node_modules are not the source to edit for content changes. Ask the learner to find components and public/data themselves.

Source files, relative to `astro-prototype/`: `README.md`.

### 7. The homepage sets the section order

TIME 18:00–21:00 (3 minutes).

Open the real file and show the import lines followed by the page content. Explain that import means 'use the piece defined in this other file'. Each capitalised tag refers to a component. Hero is the opening welcome section. This excerpt omits Sponsors, RideDiary, Photos, Faq, ContactUs and Disclaimer to make the pattern readable. Show the complete file in the editor. Do not suggest the learner paste the ellipsis into source. CHECK: Where would you look to understand the order of page sections? src/pages/index.astro.

Source files, relative to `astro-prototype/`: `src/pages/index.astro`.

### 8. The layout wraps the sections

TIME 21:00–23:00 (2 minutes).

Point to SiteLayout in index.astro, then open the layout. Explain that slot is a placeholder for the content inside SiteLayout. The head contains information about the page, including the browser tab title, while body contains the page content. The top imports load Bootstrap CSS and the project's SCSS. data-bs-theme requests Bootstrap's dark theme. Keep the lesson at recognition level: this is usually not the first place to edit ordinary section wording. CHECK: A client asks to change the browser tab title. Which file? SiteLayout.astro.

Source files, relative to `astro-prototype/`: `src/layouts/SiteLayout.astro`, `src/scripts/site.ts`.

### 9. The component names match the page

TIME 23:00–25:00 (2 minutes).

Show a section in the browser, then click the matching component file. A carousel is a rotating set of images. An accordion is content that expands and collapses. Point out the useful naming convention and the two important exceptions to 'everything is text in a component': longer rides arrive from JSON, and Photos also uses JSON. Section templates do not each represent a separate web page. CHECK: Ask where to begin for a change to the contact wording, and then for a change to a longer ride's distance. Expected answers: ContactUs.astro and longer-rides.json.

Source files, relative to `astro-prototype/`: `src/components/Hero.astro`, `src/components/AboutUs.astro`, `src/components/RideDiary.astro`, `src/components/Faq.astro`, `src/components/ContactUs.astro`, `src/components/Photos.astro`.

### 10. A small text edit

TIME 25:00–28:00 (3 minutes).

Use the editor to locate the original sentence. Select only the sentence between the paragraph tags, not the tags themselves. Read the before and after aloud. Demonstrate the edit in a disposable copy or an unsaved buffer and restore it after the lesson. Explain save and undo if needed. Show the change in the prepared preview if the local session already supports it; setup commands remain outside this lesson. CHECK: Ask the learner to explain why the opening and closing tags remain in place.

Source files, relative to `astro-prototype/`: `src/components/ContactUs.astro`.

### 11. Links, IDs and classes

TIME 28:00–31:00 (3 minutes).

Explain that the link's visible words and destination are separate. The source link in Hero also has styling attributes omitted here. The hash links to the section whose ID matches exactly. A full https URL can open another website, while mailto opens an email application if one is configured. IDs also act as hooks for scripts, so casually renaming one can break a connection. Classes can repeat on many elements; IDs should be unique on the page. CHECK: If we change only the visible link words, does the destination change? No.

Source files, relative to `astro-prototype/`: `src/components/Hero.astro`, `src/components/ContactUs.astro`, `src/components/Navigation.astro`.

### 12. Images have a file and a description

TIME 31:00–33:00 (2 minutes).

Show the actual image file and the img element that points to it. The public folder name is not part of this image URL. img-fluid is a Bootstrap class that helps the image fit its container. Explain that an image element does not need a closing </img> tag. For a replacement image, change the filename reference and update alt when the meaning changes. A new WhatsApp invitation can also require a matching new QR code and updates to the text links. CHECK: Where would a missing image investigation start? Compare src with the real file path.

Source files, relative to `astro-prototype/`: `src/components/ContactUs.astro`, `public/img/mm-qr-code.jpg`.

### 13. A CSS rule changes appearance

TIME 33:00–36:00 (3 minutes).

Connect this selector back to the heading from slide 5. Read colour and italic first, leaving font-family details secondary. Explain braces as the boundary of the rule and semicolons as the separators between settings. var(...) reads a named CSS value defined elsewhere. A selector is the part that chooses which elements receive the rule. A global .brand-text change can affect many headings and links at once. CHECK: Would editing this rule affect only Contact Us? No, every matching element can be affected. The actual result also depends on other applicable rules.

Source files, relative to `astro-prototype/`: `src/scss/styles.scss`, `src/components/ContactUs.astro`.

### 14. Bootstrap supplies common styles

TIME 36:00–38:00 (2 minutes).

Explain a library as code someone has already written for a common task. Show a yellow button and the two contact columns. The class attribute can hold multiple class names separated by spaces. Bootstrap is present in this project; the learner does not need to memorise the full library. Resize the prepared browser window to show that layouts can change with available space. Mention that some classes include breakpoint names, such as col-xxl-6 in About Us, so layouts can differ at different widths. CHECK: Which part of btn-warning suggests the colour choice?

Source files, relative to `astro-prototype/`: `src/components/Photos.astro`, `src/components/ContactUs.astro`, `src/components/AboutUs.astro`, `src/layouts/SiteLayout.astro`.

### 15. Styles can apply at different scales

TIME 38:00–40:00 (2 minutes).

Show the @use lines in styles.scss, then the style block at the bottom of Photos.astro. Explain that @use brings another Sass stylesheet into the styling. Most styles in a component's style block are scoped by Astro; Photos also uses :global for a specific selector, so 'usually' matters. Show the @media rule changing .carousel-img height from 400px to 250px on narrow screens. Explain that px means pixels here and max-width tests the available viewport width. Avoid teaching the entire CSS cascade. CHECK: If a style works on desktop but fails on mobile, where might we look? At responsive/media-query rules.

Source files, relative to `astro-prototype/`: `src/scss/styles.scss`, `src/scss/base/base.scss`, `src/components/Photos.astro`.

### 16. Pause and check the file choices

TIME 40:00–45:00 (5 minutes, including a short pause).

Let the learner answer without racing. Answers: ContactUs.astro; src/scss/styles.scss for .brand-text; src/pages/index.astro; compare the image's src path and the file in public/img, including exact spelling and case. Ask them to find one of the files in the editor rather than just repeat its name. Use the remaining time for a short comfort break or clarification. The next part introduces data, so resolve uncertainty about file locations first. Do not treat this as a test of intelligence; use it to adjust the explanation.

Source files, relative to `astro-prototype/`: `src/components/ContactUs.astro`, `src/scss/styles.scss`, `src/pages/index.astro`.

### 17. JSON keeps information in named fields

TIME 45:00–48:00 (3 minutes).

Explain { } as one record or object and [ ] as a list or array. This code is valid JSON, but it is only a teaching fragment and lacks fields required by the site's ride data. Commas separate fields, and there is no comma after the final one. JSON has no comments. A colon separates a field name from its value. Distinguish null from the text "null". Show how a list can contain several ride objects. CHECK: Is 30 a number or text here? A number. What would [] mean for notes? No notes entered yet.

Source files, relative to `astro-prototype/`: `public/data/longer-rides.json`, `src/lib/data.ts`.

### 18. One ride is one record

TIME 48:00–51:00 (3 minutes).

Open the War of the Worlds record in archivedRides. Explain that the selected fields on the slide are an excerpt, not standalone JSON. Distinguish the ride ID from an HTML element ID: both are identifiers, but they belong to different structures. The record's year agrees with the date. Show meetPoint as an object inside the ride object and notes as a list of text entries. The current file has programmeYear 2027, an empty longerRides list, and archived ride records. CHECK: Where is Woking stored? In the destination field.

Source files, relative to `astro-prototype/`: `public/data/longer-rides.json`, `src/lib/data.ts`.

### 19. The Ride Diary reads the ride data

TIME 51:00–54:00 (3 minutes).

Walk through the numbered path while showing the matching files. loadRideData fetches the JSON in the browser and parseRideData checks the shape and required values. ride-diary.js creates the HTML for longer and archived rides and places it into the page. The component already includes the regular ride content. Define rendering as turning information into what a visitor sees. Show the Loading Longer Rides message and target container in the component source. CHECK: To fix the distance of one longer ride, would you start by editing the rendering script? No, start with that ride's JSON record.

Source files, relative to `astro-prototype/`: `public/data/longer-rides.json`, `src/lib/data.ts`, `src/js/ride-diary.js`, `src/components/RideDiary.astro`.

### 20. Where To Next reuses the ride data

TIME 54:00–56:00 (2 minutes).

Explain reuse: updating one longer ride record can affect both the diary and Where To Next. dates.ts contains the selection and time calculations. where-to-next.ts displays the selected ride and updates the clock each second. programmeYear labels the programme, but a ride must still have a future departure to qualify. In the inspected source longerRides is empty, so the seasonal fallback is expected. The fallback is explicitly coded for 1 December 2026 at 19:00 and uses a separate image. It does not automatically roll forward each year. Avoid making claims about the live website's current state. CHECK: Would adding a future date to an archived record make it appear next? No.

Source files, relative to `astro-prototype/`: `src/scripts/where-to-next.ts`, `src/lib/dates.ts`, `public/data/longer-rides.json`.

### 21. Photos has its own data file

TIME 56:00–58:00 (2 minutes).

Explain that Photos links to shared albums rather than storing those album photos in JSON. Photos.astro reads the data to prepare the collections, and scripts/photos.ts chooses the current and archived menus in the browser using the UK year. Future years stay hidden and empty archive years do not appear. A missing or empty current year gets a coming-soon message. Changing a JSON link requires the normal source-to-preview workflow, which the maintainer will cover separately; the calendar selection itself runs when the page loads. This is separate from programmeYear in the rides file. CHECK: Does editing photosUrl in a ride automatically change the Photos menu? No.

Source files, relative to `astro-prototype/`: `public/data/photos.json`, `src/components/Photos.astro`, `src/scripts/photos.ts`, `src/lib/photos.ts`.

### 22. The ride template needs real values

TIME 58:00–60:00 (2 minutes).

Open public/data/ride-template.json. It contains instructions, examples and newRide, so copying the entire file would be wrong. Its empty meetPoint.note and placeholder date are not ready to pass validation unchanged. Use startTime in HH:MM, a matching numeric year, and a non-negative numeric distance. Include destination, startTime and overallTime for useful diary output even where the validator permits omission; rideTime may be TBC. Show that parseRideData checks duplicates and date formats, but cannot confirm image files exist or that a shared folder opens for visitors. The handout has a complete practice record. Save real authoring and review workflow for a supervised task.

Source files, relative to `astro-prototype/`: `public/data/ride-template.json`, `src/lib/data.ts`, `README.md`.

### 23. JavaScript responds to events

TIME 60:00–62:00 (2 minutes).

Return to the menu in the preview and click a navigation item. Name the action as an event. Explain the DOM only if useful: it is the browser's representation of the page elements, which scripts can read and change. A function is like a named set of steps, and a variable is a named value used by those steps. TypeScript adds descriptions such as string or number to help catch mistakes, but the concepts are the same. Avoid an exhaustive syntax lecture. CHECK: What is the event when someone presses a navigation link? A click.

Source files, relative to `astro-prototype/`: `src/js/navlink.js`, `src/scripts/where-to-next.ts`.

### 24. A click changes the active menu item

TIME 62:00–65:00 (3 minutes).

Read this as a story rather than asking the learner to memorise punctuation. document refers to the page; querySelectorAll finds all matches for a CSS selector; forEach repeats the following steps for each link. addEventListener registers what to do later when a click happens. The => notation starts a small function. ?. safely stops the removal if no matching active element exists. classList edits class labels on an element. Explain that navlink.js also contains mobile menu closing code below this block. The shown code selects the first .active element on the page, so do not describe it as a navigation-scoped search. CHECK: Is active visible text or a class name? A class name.

Source files, relative to `astro-prototype/`: `src/js/navlink.js`.

### 25. Bootstrap connects a button to hidden content

TIME 65:00–67:00 (2 minutes).

Open the FAQ and demonstrate one question. Show the matching button target and answer ID in the source. Explain data-bs-* as attributes Bootstrap reads. The full answer container also has data-bs-parent linking it to the accordion, and the actual button has classes and type. The excerpt deliberately omits these details. Renaming only question-one on one side breaks the connection. Bootstrap's JavaScript is imported by scripts/site.ts, which the shared layout loads. CHECK: If a copied FAQ opens the wrong answer, what would you compare? The target and the corresponding unique ID.

Source files, relative to `astro-prototype/`: `src/components/Faq.astro`, `src/scripts/site.ts`, `src/layouts/SiteLayout.astro`.

### 26. A small investigation

TIME 67:00–70:00 (3 minutes).

Demonstrate editor search with the Contact Us sentence and show that searching across files can reveal repeated wording. Introduce browser developer tools briefly: Elements lets you inspect the current page and Console can show script errors. Changes made only in Elements are temporary and do not update saved source. For help, collect the file path, what changed, the expected result, the actual result and the full error text. If the preview still looks old, confirm the correct project and the maintainer's preview workflow before editing more files. No terminal commands are required in this session. CHECK: Does changing text only in browser developer tools save it in ContactUs.astro? No.

Source files, relative to `astro-prototype/`: `src/components/ContactUs.astro`, `src/components/Faq.astro`, `README.md`.

### 27. The file choices to remember

TIME 70:00–90:00 (20 minutes, including discussion).

Ask the learner to explain a content change in their own words: what the visitor sees, which file holds it, and how they would check it. Use remaining time for questions. Recap that index.astro assembles components and SiteLayout.astro wraps them. The main success criterion is finding the right starting point, not reading every line unaided. Ask them to identify one task they feel ready to try with review, such as changing a paragraph or correcting an existing ride record. Agree that new sections, shared behaviour and calendar logic are tasks to pair on. Keep build and deployment questions on a list for the next session.

Source files, relative to `astro-prototype/`: `src/pages/index.astro`, `src/layouts/SiteLayout.astro`, `README.md`.

## Follow-up topics

Keep source-control workflow, local setup, build and deployment for the next agreed lesson. Recheck the seasonal fallback and programme state before repeating this presentation in a later year.
