export enum Shape {
  Ribbon = 'RIBBON',
  Triangle = 'TRIANGLE',
}

export enum MatchRule {
  Exact = 'EXACT',
  ContainsWords = 'CONTAINS_WORDS',
  StartsWith = 'STARTS_WITH',
  EndsWith = 'ENDS_WITH',
  RegEx = 'REGULAR_EXPRESSION',
  CidrV4 = 'CIDR_V4',
  CidrV6 = 'CIDR_V6',
}

export enum Placement {
  TopLeft = 'TOP_LEFT',
  TopRight = 'TOP_RIGHT',
  BottomLeft = 'BOTTOM_LEFT',
  BottomRight = 'BOTTOM_RIGHT',
}

export type Site = {
  id?: number;
  label: string;
  value: string;
  color: string;
  labelColor: string;
  shape: Shape;
  matchRule: MatchRule;
  placement: Placement;
};

const SiteProperties: Array<keyof Site> = [
  'id',
  'label',
  'value',
  'color',
  'labelColor',
  'shape',
  'matchRule',
  'placement',
];

export type Configuration = {
  version: 1;
  data: Site[];
};

export const isConfiguration = (value: any): value is Configuration => {
  if (!value) {
    return false;
  }
  const hasValidVersion = value.version === 1;
  const hasValidData =
    Array.isArray(value.data) &&
    value.data.length >= 1 &&
    value.data.every((innerValue: any) => {
      const keys = Object.keys(innerValue);
      return SiteProperties.every((property) => keys.includes(property));
    });

  return hasValidVersion && hasValidData;
};
