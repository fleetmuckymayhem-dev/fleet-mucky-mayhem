// One-time, reproducible extraction from the immutable source baseline.
import { readFileSync, writeFileSync } from 'node:fs';
const html = readFileSync('baseline/src/index.html', 'utf8');
const sections = {
  AboutUs: 'about-us', WhatWeDo: 'what-we-do', WhereToNext: 'where-to-next',
  Sponsors: 'sponsors', RideDiary: 'ride-diary', Photos: 'photos',
  ContactUs: 'contact-us', Disclaimer: 'group-ride-disclaimer',
};
for (const [name, id] of Object.entries(sections)) {
  let markup = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`))[0];
  // Match browser repairs for paragraphs surrounding block headings.
  markup = markup.replace(/<p>(\s*)(<h[1-6]\b)/g, '<p></p>$1$2')
    .replace(/(<\/h[1-6]>)(\s*)<\/p>/g, '$1$2<p></p>')
    .replaceAll('</br>', '<br />')
    .replaceAll('</a></i>', '</i></a>');
  // An opening <li> used as a closing tag yields an empty list item in browsers.
  if (name === 'Photos') markup = markup.replace(/(<\/i><\/a>\s*)<li>(\s*)<li>/g, '$1</li>$2<li></li>$2<li>')
    .replace(/(<\/a>\s*)(<\/ul>)/g, '$1</li>$2');
  if (name === 'RideDiary') markup = markup.replace('</section>', '  </div>\n  </section>');
  writeFileSync(`src/components/${name}.astro`, markup + '\n');
}
writeFileSync('src/components/Footer.astro', html.match(/<footer\b[\s\S]*?<\/footer>/)[0].replace('Fleet Mucky Mayhem</span>', 'Fleet Mucky Mayhem').replace('v1.11.2', 'v2.0.0') + '\n');
// Keep the calendar and its modal as one disabled source comment.
writeFileSync('src/components/EventCalendar.astro', html.match(/<!-- EVENT CALENDAR SECTION - TEMPORARILY DISABLED[\s\S]*?-->/)[0] + '\n');
const components = ['Navigation', 'Hero', 'AboutUs', 'WhatWeDo', 'WhereToNext', 'Sponsors', 'EventCalendar', 'RideDiary', 'Photos', 'Faq', 'ContactUs', 'Disclaimer', 'Footer'];
writeFileSync('src/pages/index.astro', `---\nimport SiteLayout from '../layouts/SiteLayout.astro';\n${components.map(name => `import ${name} from '../components/${name}.astro';`).join('\n')}\n---\n<SiteLayout>\n${components.map(name => `  <${name} />`).join('\n')}\n</SiteLayout>\n`);
