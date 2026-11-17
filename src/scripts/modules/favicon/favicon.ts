import { Placement, type Site } from '../../../persistence';

const IconSize = 32;
const BadgeRadius = IconSize * 0.3;
const BadgeFont = `bold ${BadgeRadius * 1.5}px sans-serif`;
const BadgeText = '֍';

type Point = { x: number; y: number };

const BadgeCenters: Record<Placement, Point> = {
  [Placement.TopLeft]: { x: BadgeRadius, y: BadgeRadius },
  [Placement.TopRight]: { x: IconSize - BadgeRadius, y: BadgeRadius },
  [Placement.BottomLeft]: { x: BadgeRadius, y: IconSize - BadgeRadius },
  [Placement.BottomRight]: {
    x: IconSize - BadgeRadius,
    y: IconSize - BadgeRadius,
  },
};

const findIconLinks = (): HTMLLinkElement[] => [
  ...document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'),
];

const loadImage = (url: string): Promise<HTMLImageElement | undefined> =>
  new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(undefined);
    image.src = url;
  });

const drawIcon = (
  site: Site,
  center: Point,
  image: HTMLImageElement | undefined
): string | undefined => {
  const canvas = document.createElement('canvas');
  canvas.width = IconSize;
  canvas.height = IconSize;

  const context = canvas.getContext('2d');
  if (!context) {
    return undefined;
  }

  if (image) {
    context.drawImage(image, 0, 0, IconSize, IconSize);
  }

  context.beginPath();
  context.arc(center.x, center.y, BadgeRadius, 0, 2 * Math.PI);
  context.fillStyle = site.color;
  context.fill();

  context.fillStyle = site.labelColor;
  context.font = BadgeFont;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(BadgeText, center.x, center.y);

  return canvas.toDataURL('image/png');
};

const replaceIcon = (href: string): void => {
  for (const link of findIconLinks()) {
    link.remove();
  }

  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = href;
  document.head.appendChild(link);
};

const updateFavicon = async (site: Site): Promise<void> => {
  const center: Point | undefined = BadgeCenters[site.placement];
  if (!center) {
    console.error('Unexpected placement received', site.placement);
    return;
  }

  const original =
    findIconLinks()[0]?.href ??
    new URL('/favicon.ico', window.location.origin).href;
  const image = await loadImage(original);
  const icon = drawIcon(site, center, image);
  if (icon) {
    replaceIcon(icon);
  }
};

const favicon = { updateOnPage: updateFavicon };

export default favicon;
