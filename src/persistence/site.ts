export enum Shape {
  Ribbon = 'RIBBON',
  Triangle = 'TRIANGLE',
}

export enum MatchRule {
  Exact = 'EXACT',
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
