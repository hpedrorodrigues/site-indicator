import { getSize, Placement, Size, type Site } from '../../../persistence';
import { hideOnHover, ZIndex } from './element';

type FrameConfig = {
  thickness: number;
  fontSize: number;
  lineHeight: number;
};

const Configs: Record<Size, FrameConfig> = {
  [Size.Small]: { thickness: 4, fontSize: 11, lineHeight: 18 },
  [Size.Medium]: { thickness: 6, fontSize: 12, lineHeight: 20 },
  [Size.Large]: { thickness: 9, fontSize: 14, lineHeight: 24 },
};

const Radius = '4px';

const tabPlacementStyles = (
  placement: Placement,
  thickness: number
): Partial<CSSStyleDeclaration> | undefined => {
  const offset = `${thickness}px`;
  switch (placement) {
    case Placement.TopLeft:
      return { top: offset, left: offset, borderBottomRightRadius: Radius };
    case Placement.TopRight:
      return { top: offset, right: offset, borderBottomLeftRadius: Radius };
    case Placement.BottomLeft:
      return { bottom: offset, left: offset, borderTopRightRadius: Radius };
    case Placement.BottomRight:
      return { bottom: offset, right: offset, borderTopLeftRadius: Radius };
    default:
      console.error('Unexpected placement received', placement);
      return undefined;
  }
};

export const createFrame = (site: Site): HTMLDivElement | undefined => {
  const config = Configs[getSize(site)];
  const tabPlacement = tabPlacementStyles(site.placement, config.thickness);
  if (!tabPlacement) {
    return undefined;
  }

  const frameStyles: Partial<CSSStyleDeclaration> = {
    zIndex: ZIndex,
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    boxShadow: `inset 0 0 0 ${config.thickness}px ${site.color}`,
  };

  const tabStyles: Partial<CSSStyleDeclaration> = {
    position: 'absolute',
    pointerEvents: 'auto',
    backgroundColor: site.color,
    color: site.labelColor,
    fontSize: `${config.fontSize}px`,
    lineHeight: `${config.lineHeight}px`,
    padding: '0 10px',
    ...tabPlacement,
  };

  const frame = document.createElement('div');
  Object.assign(frame.style, frameStyles);

  const tab = document.createElement('div');
  tab.innerText = site.label;
  Object.assign(tab.style, tabStyles);
  hideOnHover(tab);

  frame.appendChild(tab);
  return frame;
};
