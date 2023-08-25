import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { createElement, removeEmptyTags } from '../../scripts/common.js';

export default function decorate(block) {
  // all items are inside a ul list with classname called 'v2-images-grid-items'
  const ul = createElement('ul', { classes: 'v2-images-grid-items' });
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    // If cell contain any element, we add them in the ul
    if (cell.childElementCount) {
      const li = createElement('li', { classes: ['v2-images-grid-item', 'border'] });
      li.append(...cell.childNodes);
      ul.append(li);
    }
    cell.remove();
  });

  block.firstElementChild.append(ul);

  // give format to the list items
  [...ul.children].forEach((li) => {
    const section = createElement('div');
    const headings = li.querySelectorAll('h1, h2, h3, h4, h5, h6');
    [...headings].forEach((heading) => heading.classList.add('v2-images-grid-title'));
    let picture = li.querySelector('picture');

    if (picture) {
      const img = picture.lastElementChild;
      // no width provided because we are using object-fit, we need the biggest option
      const newPicture = createOptimizedPicture(img.src, img.alt, false);
      picture.replaceWith(newPicture);
      picture = newPicture;
    }

    // Move image outside of the wrapper
    section.prepend(picture);

    // Add wrapper around the text content
    const container = createElement('div', { classes: 'v2-images-grid-itemtext' });
    container.innerHTML = li.innerHTML;
    li.innerHTML = '';
    section.append(container);
    li.append(section);
  });

  // remove empty tags
  removeEmptyTags(block);
}
