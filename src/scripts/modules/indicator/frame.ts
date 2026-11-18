import { Placement, type Site } from '../../../persistence';
import { hideOnHover, ZIndex } from './element';

const Thickness = 6;
const Radius = '4px';

const tabPlacementStyles = (
  placement: Placement
): Partial<CSSStyleDeclaration> | undefined => {
  const offset = `${Thickness}px`;
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
  const tabPlacement = tabPlacementStyles(site.placement);
  if (!tabPlacement) {
    return undefined;
  }

  const frameStyles: Partial<CSSStyleDeclaration> = {
    zIndex: ZIndex,
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    boxShadow: `inset 0 0 0 ${Thickness}px ${site.color}`,
  };

  const tabStyles: Partial<CSSStyleDeclaration> = {
    position: 'absolute',
    pointerEvents: 'auto',
    backgroundColor: site.color,
    color: site.labelColor,
    fontSize: '12px',
    lineHeight: '20px',
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
