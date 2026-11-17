import Favico, { type FavicoPosition } from 'favico.js';
import { Placement, type Site } from '../../../persistence';

const Positions: Record<Placement, FavicoPosition> = {
  [Placement.TopLeft]: 'upleft',
  [Placement.TopRight]: 'upright',
  [Placement.BottomLeft]: 'downleft',
  [Placement.BottomRight]: 'downright',
};

const updateFavicon = (site: Site): void => {
  const position: FavicoPosition | undefined = Positions[site.placement];
  if (!position) {
    console.error('Unexpected placement received', site.placement);
    return;
  }

  const favicon = new Favico({
    bgColor: site.color,
    textColor: site.labelColor,
    type: 'circle',
    position,
    animation: 'none',
  });

  favicon.badge('֍');
};

const favicon = { updateOnPage: updateFavicon };

export default favicon;
