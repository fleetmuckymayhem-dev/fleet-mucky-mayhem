import { currentPhotoYear } from '../lib/photos.ts';

/** The build supplies all collections; the visitor's UK date selects the menus. */
export function initPhotos(): void {
  const section = document.getElementById('photos');
  const source = section?.querySelector<HTMLTemplateElement>('#photoCollections');
  const current = section?.querySelector<HTMLUListElement>('#currentPhotosMenu');
  const archived = section?.querySelector<HTMLUListElement>('#archivePhotosMenu');
  const currentButton = section?.querySelector<HTMLButtonElement>('#currentPhotosBtn');
  const archiveButton = section?.querySelector<HTMLButtonElement>('#archivePhotosBtn');
  if (!section || !source || !current || !archived || !currentButton || !archiveButton) return;

  const year = currentPhotoYear();
  const label = section.querySelector('#currentPhotosYear');
  if (label) label.textContent = ` for ${year}`;
  const headingItem = document.createElement('li');
  const heading = document.createElement('h3');
  heading.className = 'dropdown-header';
  heading.textContent = `${year} Photos`;
  headingItem.append(heading);
  current.replaceChildren(headingItem);
  archived.replaceChildren();

  let hasCurrentLinks = false;
  for (const collection of source.content.querySelectorAll<HTMLLIElement>('[data-photo-year]')) {
    const collectionYear = Number(collection.dataset.photoYear);
    if (collection.dataset.hasLinks !== 'true') continue;
    if (collectionYear === year) {
      const links = collection.querySelector('ul');
      if (links) current.append(...Array.from(links.children, link => link.cloneNode(true)));
      hasCurrentLinks = true;
    } else if (collectionYear < year) {
      archived.append(collection.cloneNode(true));
    }
  }
  if (!hasCurrentLinks) {
    const item = document.createElement('li');
    const message = document.createElement('p');
    message.className = 'px-3 py-2 mb-0';
    message.textContent = `Photos for ${year} will be available here soon.`;
    item.append(message);
    current.append(item);
  }
  currentButton.disabled = false;
  archiveButton.disabled = !archived.children.length;
  section.dataset.photosReady = String(year);
}

initPhotos();
window.addEventListener('pageshow', initPhotos);
