import { getSize, Placement, Shape, type Site } from '../../../persistence';
import { hideOnHover, ZIndex } from './element';
import { SizeScales } from './size';

type CornerConfig = {
  height: number;
  distanceToCorner: number;
  alignItems: string;
  padding?: number;
};

const FontSize = 14;

const Configs: Partial<Record<Shape, CornerConfig>> = {
  [Shape.Ribbon]: { height: 40, distanceToCorner: 80, alignItems: 'center' },
  [Shape.Triangle]: {
    height: 100,
    distanceToCorner: 20,
    alignItems: 'end',
    padding: 16,
  },
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

export const createCorner = (site: Site): HTMLDivElement | undefined => {
  const config = Configs[site.shape];
  if (!config) {
    console.error('Unexpected shape received', site.shape);
    return undefined;
  }

  const scale = SizeScales[getSize(site)];
  const height = config.height * scale;
  const distanceToCorner = config.distanceToCorner * scale;
  const verticalOffset = distanceToCorner / Math.sqrt(2) - height / 2;
  const width = distanceToCorner * 2 + height * 2;
  const horizontalOffset = distanceToCorner / Math.sqrt(2) - width / 2;

  const styles: Partial<CSSStyleDeclaration> = {
    zIndex: ZIndex,
    display: 'flex',
    justifyContent: 'center',
    alignItems: config.alignItems,
    transformOrigin: 'center',
    position: 'fixed',
    backgroundColor: site.color,
    color: site.labelColor,
    height: `${height}px`,
    width: `${width}px`,
    fontSize: `${FontSize * scale}px`,
    ...(config.padding && { padding: `${config.padding * scale}px` }),
    ...placementStyles(site.placement, verticalOffset, horizontalOffset),
  };

  const div = document.createElement('div');
  div.innerText = site.label;
  Object.assign(div.style, styles);
  hideOnHover(div);

  return div;
};
