export const ElementId = 'site-indicator-extension-indicator';
export const ZIndex = '99999';

const HideDelay = 5000;

export const hideOnHover = (element: HTMLElement): void => {
  element.onmouseover = () => {
    const display = element.style.display;
    element.style.display = 'none';
    setTimeout(() => (element.style.display = display), HideDelay);
  };
};

export const removeElement = (): void => {
  document.getElementById(ElementId)?.remove();
};
