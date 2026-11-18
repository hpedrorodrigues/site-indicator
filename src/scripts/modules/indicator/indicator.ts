import { getOpacity, Shape, type Site } from '../../../persistence';
import { createCorner } from './corner';
import { ElementId, removeElement } from './element';
import { createFrame } from './frame';

const createElement = (site: Site): HTMLDivElement | undefined =>
  site.shape === Shape.Frame ? createFrame(site) : createCorner(site);

const insertElement = (site: Site): void => {
  removeElement();

  const element = createElement(site);
  if (!element) {
    return;
  }

  element.id = ElementId;
  element.style.opacity = `${getOpacity(site) / 100}`;
  document.body.appendChild(element);
};

const indicator = { insertOnPage: insertElement };

export default indicator;
