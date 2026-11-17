import { Placement, Shape, type Site } from '../../../persistence';

const RibbonElementId = 'site-indicator-extension-ribbon';
const ZIndex = '99999';
const HideDelay = 5000;

type RibbonConfig = {
  height: number;
  distanceToCorner: number;
  alignItems: string;
  padding?: string;
};

const Configs: Record<Shape, RibbonConfig> = {
  [Shape.Ribbon]: { height: 40, distanceToCorner: 80, alignItems: 'center' },
  [Shape.Triangle]: {
    height: 100,
    distanceToCorner: 20,
    alignItems: 'end',
    padding: '16px',
  },
};

const removeElement = (): void => {
  document.getElementById(RibbonElementId)?.remove();
};

const placementStyles = (
  placement: Placement,
  verticalOffset: number,
  horizontalOffset: number
): Partial<CSSStyleDeclaration> | undefined => {
  const vertical = `${verticalOffset}px`;
  const horizontal = `${horizontalOffset}px`;
  switch (placement) {
    case Placement.TopLeft:
      return { transform: 'rotate(-45deg)', top: vertical, left: horizontal };
    case Placement.TopRight:
      return { transform: 'rotate(45deg)', top: vertical, right: horizontal };
    case Placement.BottomLeft:
      return { transform: 'rotate(45deg)', bottom: vertical, left: horizontal };
    case Placement.BottomRight:
      return {
        transform: 'rotate(-45deg)',
        bottom: vertical,
        right: horizontal,
      };
    default:
      console.error('Unexpected placement received', placement);
      return undefined;
  }
};

const insertElement = (site: Site): HTMLDivElement | undefined => {
  removeElement();

  const config: RibbonConfig | undefined = Configs[site.shape];
  if (!config) {
    console.error('Unexpected shape received', site.shape);
    return undefined;
  }

  const verticalOffset =
    config.distanceToCorner / Math.sqrt(2) - config.height / 2;
  const width = config.distanceToCorner * 2 + config.height * 2;
  const horizontalOffset = config.distanceToCorner / Math.sqrt(2) - width / 2;

  const styles: Partial<CSSStyleDeclaration> = {
    zIndex: ZIndex,
    display: 'flex',
    justifyContent: 'center',
    alignItems: config.alignItems,
    transformOrigin: 'center',
    position: 'fixed',
    backgroundColor: site.color,
    color: site.labelColor,
    height: `${config.height}px`,
    width: `${width}px`,
    fontSize: '14px',
    ...(config.padding && { padding: config.padding }),
    ...placementStyles(site.placement, verticalOffset, horizontalOffset),
  };

  const div = document.createElement('div');
  div.id = RibbonElementId;
  div.innerText = site.label;
  div.onmouseover = () => {
    div.style.display = 'none';
    setTimeout(() => (div.style.display = styles.display ?? ''), HideDelay);
  };

  Object.assign(div.style, styles);

  document.body.appendChild(div);
  return div;
};

const ribbon = { insertOnPage: insertElement };

export default ribbon;
