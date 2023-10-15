import Favico from 'favico.js';
import { Placement } from '../../../persistence';

const updateFavicon = (site) => {
  const config = {
    badge: '֍',
    bgColor: site.color,
    textColor: site.labelColor,
    type: 'circle',
    animation: 'none',
  };

  switch (site.placement) {
    case Placement.TopLeft:
      config.position = 'upleft';
      break;
    case Placement.TopRight:
      config.position = 'upright';
      break;
    case Placement.BottomLeft:
      config.position = 'downleft';
      break;
    case Placement.BottomRight:
      config.position = 'downright';
      break;
    default:
      console.error('Unexpected placement received', site.placement);
  }

  const favicon = new Favico({
    bgColor: config.bgColor,
    textColor: config.textColor,
    type: config.type,
    position: config.position,
    animation: config.animation,
  });

  favicon.badge(config.badge);
};

const favicon = { updateOnPage: updateFavicon };

export default favicon;
