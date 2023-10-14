import { Placement, Shape } from '../../../persistence';

const RibbonElementId = 'site-indicator-extension-ribbon';

const removeElement = () => {
  const element = document.getElementById(RibbonElementId);
  if (!!element) {
    element.remove();
  }
};

const insertElement = (site) => {
  removeElement();

  const config = {
    zIndex: '99999',
    delay: 5000,
  };

  switch (site.shape) {
    case Shape.Ribbon:
      config.height = 40;
      config.distanceToCorner = 80;
      config.alignItems = 'center';
      break;
    case Shape.Triangle:
      config.height = 100;
      config.distanceToCorner = 50;
      config.alignItems = 'end';
      config.padding = '16px';
      break;
    default:
      console.error('Unexpected shape received', site.shape);
  }

  const verticalOffset =
    config.distanceToCorner / Math.sqrt(2) - config.height / 2;
  const width = config.distanceToCorner * 2 + config.height;
  const horizontalOffset = config.distanceToCorner / Math.sqrt(2) - width / 2;

  const styles = {
    zIndex: config.zIndex,
    display: 'flex',
    justifyContent: 'center',
    alignItems: config.alignItems,
    transformOrigin: 'center',
    position: 'fixed',
    backgroundColor: site.color,
    color: site.labelColor,
    height: config.height + 'px',
    width: width + 'px',
    fontSize: '14px',
    padding: config.padding,
  };

  switch (site.placement) {
    case Placement.TopLeft:
      styles.transform = 'rotate(-45deg)';
      styles.top = verticalOffset + 'px';
      styles.left = horizontalOffset + 'px';
      break;
    case Placement.TopRight:
      styles.transform = 'rotate(45deg)';
      styles.top = verticalOffset + 'px';
      styles.right = horizontalOffset + 'px';
      break;
    case Placement.BottomLeft:
      styles.transform = 'rotate(45deg)';
      styles.bottom = verticalOffset + 'px';
      styles.left = horizontalOffset + 'px';
      break;
    case Placement.BottomRight:
      styles.transform = 'rotate(-45deg)';
      styles.bottom = verticalOffset + 'px';
      styles.right = horizontalOffset + 'px';
      break;
    default:
      console.error('Unexpected placement received', site.placement);
  }

  const div = document.createElement('div');
  div.id = RibbonElementId;
  div.innerText = site.label;
  div.onmouseover = () => {
    div.style.display = 'none';
    setTimeout(() => (div.style.display = styles.display), config.delay);
  };

  Object.keys(styles).forEach((key) => (div.style[key] = styles[key]));

  document.body.appendChild(div);
  return div;
};

const ribbon = { insertOnPage: insertElement };

export default ribbon;
