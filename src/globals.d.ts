declare module '*.css';

declare module 'favico.js' {
  export type FavicoPosition = 'upleft' | 'upright' | 'downleft' | 'downright';

  export type FavicoOptions = {
    bgColor?: string;
    textColor?: string;
    type?: 'circle' | 'rectangle';
    position?: FavicoPosition;
    animation?: 'slide' | 'fade' | 'pop' | 'popFade' | 'none';
  };

  export default class Favico {
    constructor(options?: FavicoOptions);
    badge(value: number | string): void;
    reset(): void;
  }
}
