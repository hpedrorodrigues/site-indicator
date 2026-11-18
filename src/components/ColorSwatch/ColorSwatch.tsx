import type { CSSProperties } from 'react';

const swatchStyle: CSSProperties = {
  display: 'inline-block',
  width: 28,
  height: 18,
  borderRadius: 4,
  boxShadow: 'inset 0 0 0 1px rgba(128, 128, 128, 0.45)',
  verticalAlign: 'middle',
};

type ColorSwatchProps = {
  color: string;
};

const ColorSwatch = ({ color }: ColorSwatchProps) => (
  <span title={color} style={{ ...swatchStyle, backgroundColor: color }} />
);

export default ColorSwatch;
