# Martin and Lleizar: local acceptance session

5 November 2026 | **Human acceptance pending** | [Version record](acceptance-version.md)

Work in the shared [FMM-Dev workspace](shared-workspace.md). Martin operates his devices/accounts; Lleizar reads the steps and records results. Ines can assist with local builds, simulated browsers and issue investigation. One writer at a time: coordinate builds, edits and commits; no branch switching, push, publication, clean handover copy or IONOS changes.

## Checks Ines can perform

1. Confirm folder, branch, website SHA and documentation candidate using the version-record commands. Review docs/PDF consistency and confirm no application/configuration changes in the candidate.
2. Run installation, code checks, 18 tests and production/staging builds when needed and coordinated; exercise simulated layouts, JSON/image loading, ride states and browser diagnostics. Existing website results are in [final-local-acceptance.md](final-local-acceptance.md); they are not physical-device acceptance.
3. Check public link availability and prepare the destination inventory. The recorded 55 HTTP responses include 43 Box shares; HTTP 200 does not establish contents or user permissions.

## Checks Martin and Lleizar perform together

1. **Identify the version and open the local build.** Confirm `pwd`, `git status --short --branch` and `git rev-parse HEAD` in FMM-Dev. Record the documentation SHA and tested website SHA. Coordinate `npm run build` then `npm run preview` with the current writer. Open `http://localhost:4321/` on Martin's desktop. A phone's `localhost` is the phone, not the laptop: arrange a temporary trusted-LAN preview with Ines if needed, and stop it afterwards. Do not substitute the older rehearsal deployment for this candidate.
2. **Physical-device layouts.** On Martin's phone and desktop browser, check portrait/landscape, readable text/images/QR, every navigation destination and menu opening/closing, section headings, Photos/FAQ/contact layouts and no horizontal scrolling. Record actual model, OS, browser and viewport if known.
3. **Keyboard and mobile-menu focus.** On desktop at a narrow window width, use Tab to reach the menu toggle, Enter to open, Tab to a link and Enter to follow it. After the menu closes, use Tab and Shift+Tab: focus must be visible and reach sensible controls, with no hidden focus or trap. Also operate all Ride Diary modes, archives, photo-year menus and FAQs. The simulated browser reported `BODY` focus after mobile navigation; the next focus position still needs this human check.
4. **Rides and FAQs.** Check Regular Rides, the empty 2027 Longer Rides message, archives 2026/2025/2024 and ride details/notes/maps. Ask Ines to demonstrate a populated upcoming ride/countdown using a temporary browser fixture, without editing published programme data. Read all 13 FAQs. Check there are no browser console errors during ordinary local use.
5. **All Box shares.** Complete B01–B43 below, using a private/signed-out window or an ordinary intended user's account, not only the folder owner. Verify the folder/year/ride is correct and open a representative photo or statistics document. Record expected-empty folders explicitly for client approval; an inaccessible or wrong folder is an issue. Do not change permissions without separate agreement.
6. **Maps and other external links.** Complete M01–M04 below: confirm each pin/meeting point is correct, not merely that Maps opens. Check sponsor links, the two cycling articles and the Relive recording for intended content using the [external inventory](external-destinations.json).
7. **Contact on Martin's phone.** Open the WhatsApp invitation and confirm the intended group without joining or sending a message. Scan the displayed QR with the physical camera and compare its destination. Activate the email link and confirm the configured mail app opens a draft addressed to `fleetmuckymayhem@gmail.com`; no email needs sending. Record camera/app/account restrictions as issues, not passes.
8. **Client content approval.** Martin records the authorised client's confirmation of ride dates/times, meeting points, notes, sponsors, Photos/Loan Bikes access, all FAQ/contact/disclaimer wording and the celebration artwork/date. Martin and Lleizar's technical testing does not imply client approval. Record approver, exact version and approval date; keep private contact details outside this public repository.
9. **Decide readiness.** Report results to Ines using the table, agree fixes/accepted exceptions and rerun affected checks. Leave unresolved checks pending. Approve and freeze an exact source version before separately authorising creation of the clean copy. Fully test that copy before new-client-account GitHub Pages remote acceptance; agree IONOS-domain cutover only afterwards.

## Results

Use `Pending`, `Pass`, `Fail` or `Blocked`. Leave the date as `—` until the check occurs. Include the actual device/OS/browser and issue reference; do not infer success from automated checks or earlier Notes-exercise acceptance. Append separate rows for additional devices rather than overwriting evidence.

| Check | Device / OS / browser or account context | Result | Issue / evidence | Date |
| --- | --- | --- | --- | --- |
| H1 Version/local preview | Pending | Pending | Martin to report candidate SHA and opened URL | — |
| H2 Physical phone layouts | Pending | Pending | Model, OS, browser, portrait/landscape | — |
| H2 Desktop layouts | Pending | Pending | Browser/version and window size | — |
| H3 Keyboard/mobile-menu focus | Pending | Pending | Next Tab/Shift+Tab after menu closure | — |
| H4 Ride modes/upcoming fixture/FAQs | Pending | Pending | Include all archives and 13 FAQs | — |
| H5 All 43 Box shares | Pending | Pending | Complete B01–B43; no blanket pass | — |
| H6 Maps/other destinations | Pending | Pending | Complete M01–M04 and other external links | — |
| H7 WhatsApp invitation | Pending | Pending | Correct group without joining | — |
| H7 Physical QR scan | Pending | Pending | Correct destination and readable artwork | — |
| H7 Email handling | Pending | Pending | Mail app and recipient; no send required | — |
| H8 Client content approval | Pending | Pending | Named approver, exact candidate/version | — |
| H9 Local acceptance decision | Pending | Pending | Open issues/accepted exceptions and sign-off | — |

## Box results: every unique share

Labels below come from the source photo/ride data; duplicates use the same unique URL. All entries remain pending regardless of the earlier HTTP 200 result.

| ID / expected content | Share | Device / browser / account context | Result | Issue / opened content | Date |
| --- | --- | --- | --- | --- | --- |
| B01 Loan Bikes | [Open share](https://app.box.com/s/yg7tl246oz2p3kvby9ugw5jj5yu1gced) | Pending | Pending | — | — |
| B02 2026 Regular Rides | [Open share](https://app.box.com/s/8mqv8gzaw2dbvaxe5l90tkrycbsi3qrv) | Pending | Pending | — | — |
| B03 2026 Ride Statistics; 2025 Ride Statistics | [Open share](https://app.box.com/s/wyoa7e4tru3j6bem3drywgan7h2m7ul4) | Pending | Pending | — | — |
| B04 2026 21 Feb : Lock, Stock and Barrel; 2026 Lock, Stock and Barrel | [Open share](https://app.box.com/s/mh9gribpzx08fvdjnwrc4d8pmw9uu3o8) | Pending | Pending | — | — |
| B05 2026 14 Mar : War of the Worlds; 2026 War of the Worlds | [Open share](https://app.box.com/s/u5sz0hy6c6au68ssj1w5k81o2ckj5sdh) | Pending | Pending | — | — |
| B06 2026 04 Apr : Rags to Riches; 2026 Rags to Riches | [Open share](https://app.box.com/s/g11rapmp6fh8z6isod45wjmofxb6incf) | Pending | Pending | — | — |
| B07 2026 02-May : Burnt Cakes; 2026 Burnt Cakes | [Open share](https://app.box.com/s/96w2tcq1fze7g8pzi2tti4us1w4q17x3) | Pending | Pending | — | — |
| B08 2026 23-May : Jabberwocky; 2026 Jabberwocky | [Open share](https://app.box.com/s/gc245750rnjhvd0orhznkxdlr19fs50p) | Pending | Pending | — | — |
| B09 2026 13-Jun : City Slickers; 2026 City Slickers | [Open share](https://app.box.com/s/5tc7qy9i3ub56gpm6y9gal7x27e8x7at) | Pending | Pending | — | — |
| B10 2026 04-Jul : DDOTTS; 2026 DDOTTS - Daft Day Out To The Seaside | [Open share](https://app.box.com/s/gfkf8ix5kqwougtlctinz0881o8hoe8i) | Pending | Pending | — | — |
| B11 2026 01-Aug : Lunch at the Palace; 2026 Lunch at the Palace | [Open share](https://app.box.com/s/cg0xogfvppq4at6206wz2zwfc9tu1gij) | Pending | Pending | — | — |
| B12 2026 29-Aug : Marmalade Sandwich; 2026 Marmalade Sandwich | [Open share](https://app.box.com/s/23nb4ga0b6r30rw60l1v9tlo3jaj34bb) | Pending | Pending | — | — |
| B13 2026 26-Sep : War of the Worlds; 2026 War of the Worlds | [Open share](https://app.box.com/s/6v8glpyoab278vx16s1v3f3uhjnkb62f) | Pending | Pending | — | — |
| B14 2026 17-Oct : Lock, Stock and Barrel; 2026 Lock, Stock and Barrel | [Open share](https://app.box.com/s/mmbst4de8uo3mu4vex1ntno5j547i8vg) | Pending | Pending | — | — |
| B15 2026 01 Dec : 2026 Xmas Awards | [Open share](https://app.box.com/s/x0a8vbl4n74n335wz60h0pygmj1g2wbr) | Pending | Pending | — | — |
| B16 2026 19 Dec : Xmas Ride | [Open share](https://app.box.com/s/w4rk37a3x6l9u2gd3ovu6ve7j3bflutn) | Pending | Pending | — | — |
| B17 2025 Regular Rides | [Open share](https://app.box.com/s/tr4kih7u7bv0oc77j676uyo8yym2ui29) | Pending | Pending | — | — |
| B18 2025 22 Feb : Lock, Stock and Barrel; 2025 Lock, Stock and Barrel | [Open share](https://app.box.com/s/fbb01vczxd4oplyxle46kcv59qsrqhh2) | Pending | Pending | — | — |
| B19 2025 15 Mar : War of the Worlds; 2025 War of the Worlds | [Open share](https://app.box.com/s/o6959e72y4g2n62rbuxwj9kalsz1crlj) | Pending | Pending | — | — |
| B20 2025 12 Apr : Rags to Riches; 2025 Rags to Riches | [Open share](https://app.box.com/s/100h2z8uoaoi5zwrfvu4esx55a1mtacf) | Pending | Pending | — | — |
| B21 2025 10 May : One Hell of a ride!; 2025 One Hell of a ride! | [Open share](https://app.box.com/s/5r6ezdrlzju8bdwgwgmll98arzqg2jor) | Pending | Pending | — | — |
| B22 2025 24 May : City Slickers; 2025 City Slickers | [Open share](https://app.box.com/s/o9qiyb2xk7li8p8qep2t0yd6di2i8tan) | Pending | Pending | — | — |
| B23 2025 14 Jun : Alice in Wonderland; 2025 Alice in Wonderland | [Open share](https://app.box.com/s/8x8r3uwnpdknokz5fbxnmq03pouj3e9x) | Pending | Pending | — | — |
| B24 2025 05 Jul : Lunch at the Palace; 2025 Lunch at the Palace | [Open share](https://app.box.com/s/o6t5wckuuywuk3kfyloxey8mlzq0w4fl) | Pending | Pending | — | — |
| B25 2025 09 Aug : DDOTTS; 2025 DDOTTS - Daft Day Out To The Seaside | [Open share](https://app.box.com/s/w0kwzcy37fgpcgdplzf0gk5m9ezvb6m8) | Pending | Pending | — | — |
| B26 2025 23 Aug : Burnt Cakes!; 2025 Burnt Cakes | [Open share](https://app.box.com/s/sa25qfyzasbu3iiuf7o3ih1vj4y1c9b8) | Pending | Pending | — | — |
| B27 2025 20 Sep : Through the Looking Glass; 2025 Through the Looking Glass | [Open share](https://app.box.com/s/fgr2mlftwqb1ce2ioun3s6djmmjsr9ok) | Pending | Pending | — | — |
| B28 2025 09 Dec : 2025 Xmas Awards | [Open share](https://app.box.com/s/aadz9ukflz87007kbyqs0lkeaktjkbua) | Pending | Pending | — | — |
| B29 2025 20 Dec : Xmas Ride | [Open share](https://app.box.com/s/rus4slg4qrpl93jxuybv18t5oh6pjleb) | Pending | Pending | — | — |
| B30 2024 Regular Rides | [Open share](https://app.box.com/s/b8yenw53hvckgvfw16194qaksmtla7te) | Pending | Pending | — | — |
| B31 2024 Ride Statistics | [Open share](https://app.box.com/s/hsibez1hhnnpy0rgzip6dy1ktsi7wqhb) | Pending | Pending | — | — |
| B32 2024 17 Feb : Lock, Stock and Barrel; 2024 Lock, Stock and Barrel | [Open share](https://app.box.com/s/pyjj7jaceavybr0tw3ux262y343375as) | Pending | Pending | — | — |
| B33 2024 09 Mar : War of the Worlds; 2024 War of the Worlds | [Open share](https://app.box.com/s/qil8kw6fy0f6xy3cl7nywbtpogqebho3) | Pending | Pending | — | — |
| B34 2024 13 Apr : Rags to Riches; 2024 Rags to Riches | [Open share](https://app.box.com/s/qzlko84svemdp5bps2t8pydq5qmwk5we) | Pending | Pending | — | — |
| B35 2024 11 May : Burnt Cakes!; 2024 Burnt Cakes! | [Open share](https://app.box.com/s/aud8hf9piwiuteaba4mcl4w4up7mt56h) | Pending | Pending | — | — |
| B36 2024 08 Jun : City Slickers; 2024 City Slickers | [Open share](https://app.box.com/s/yty6xulhhzsh4300snjrw32q2ryjj197) | Pending | Pending | — | — |
| B37 2024 20 Jul : Alice in Wonderland; 2024 Alice in Wonderland | [Open share](https://app.box.com/s/x2u7pwv2zm0lry2x6f2b7ib2iaes2kww) | Pending | Pending | — | — |
| B38 2024 24 Aug : Lunch at the Palace; 2024 Lunch at the Palace | [Open share](https://app.box.com/s/onkidr5w34wdoo7si3jca5lyzakz68p0/folder/284986540494) | Pending | Pending | — | — |
| B39 2024 31 Aug : DDOTTS; 2024 DDOTTS - Daft Day Out To The Seaside | [Open share](https://app.box.com/s/tg0uryd83iq3pti7fmfygzwzlhy4byg5) | Pending | Pending | — | — |
| B40 2024 28 Sep : Through the Looking Glass; 2024 Through the Looking-Glass | [Open share](https://app.box.com/s/hd5mqhr6h2n5rn85slw9dbueacf2yeqo) | Pending | Pending | — | — |
| B41 2024 26 Oct : War of the Worlds; 2024 War of the Worlds | [Open share](https://app.box.com/s/uotful1umddlfpp9654yumomua67n7re) | Pending | Pending | — | — |
| B42 2024 03 Dec : 2024 Xmas Awards | [Open share](https://app.box.com/s/73dmhqp1o2oq05apc6vd31uw6aeddbub) | Pending | Pending | — | — |
| B43 2024 21 Dec : Xmas Ride | [Open share](https://app.box.com/s/j0nzlny1es0kieym1nj27wgo5pdzfe57) | Pending | Pending | — | — |

## Map results

Confirm each intended meeting point and any approach/parking details with Martin/client. A successful redirect is not destination approval.

| ID / expected meeting point | Map | Device / browser | Result | Issue / confirmed destination | Date |
| --- | --- | --- | --- | --- | --- |
| M01 Reading Road Canal Wharf | [Open map](https://maps.app.goo.gl/Rz6o6LjYwvr6974ZA) | Pending | Pending | — | — |
| M02 Reading Road Canal Wharf (homepage) | [Open map](https://maps.app.goo.gl/N667QXAJJztYRDLq9) | Pending | Pending | — | — |
| M03 Guildford Railway Station, Main entrance | [Open map](https://maps.app.goo.gl/yP8CiCuyrYRzgzus7) | Pending | Pending | — | — |
| M04 Reading | [Open map](https://maps.app.goo.gl/cXQeQQU3Hvym1SAj9) | Pending | Pending | — | — |
