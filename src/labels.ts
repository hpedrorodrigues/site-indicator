import { MatchRule, Placement, Shape } from './persistence';

export const DefaultFileName = 'site-indicator-settings.json';

export const Labels = <const>{
  AppName: 'Site Indicator',
  Copyright: 'Site Indicator ©2023',
  RefreshPage: 'Please, refresh the page!',
  Site: {
    NoSite: 'No sites configured!',
    Field: {
      Label: 'Label',
      Value: 'Value',
      Color: 'Color',
      LabelColor: 'Label Color',
      Shape: 'Shape',
      Placement: 'Placement',
      MatchRule: 'Match Rule',
    },
    Shape: {
      Ribbon: 'Ribbon',
      Triangle: 'Triangle',
    },
    MatchRule: {
      Exact: 'Exact',
      StartsWith: 'Starts with',
      EndsWith: 'Ends with',
      RegEx: 'Regular Expression',
      CidrV4: 'CIDR v4 (Experimental)',
      CidrV6: 'CIDR v6 (Experimental)',
      Description: {
        Exact:
          '"Exact" will perform equality to match the page domain (ignoring "www.").',
        StartsWith:
          '"Starts with" will check whether the page domain begins with the given value (ignoring "www.").',
        EndsWith:
          '"Ends with" will check whether the page domain ends with the given value (ignoring "www.").',
        RegEx:
          '"Regular Expression" will check whether the provided patterns match the page domain.',
        CidrV4:
          '"CIDR v4 (Experimental)" will check whether the page IPv4 address it\'s inside an IP range expressed in CIDR notation. Address resolution may be performed using Cloudflare or Google nameservers or native Browser API.',
        CidrV6:
          '"CIDR v6 (Experimental)" will check whether the page IPv6 address it\'s inside an IP range expressed in CIDR notation. Address resolution may be performed using Cloudflare or Google nameservers or native Browser API.',
      },
    },
    Placement: {
      TopLeft: 'Top Left',
      TopRight: 'Top Right',
      BottomLeft: 'Bottom Left',
      BottomRight: 'Bottom Right',
    },
  },
  Action: {
    Title: 'Actions',
    Add: 'Add site',
    AddNow: 'Create now',
    Delete: 'Delete',
    ConfirmDelete: 'Are you sure?',
    Edit: 'Edit',
    Preferences: 'Preferences',
    Enabled: 'Enabled',
    Disabled: 'Disabled',
    Export: 'Export',
  },
  Form: {
    SectionTitle: 'Indicator',
  },
  Modal: {
    Title: {
      Add: 'Add new site',
      Edit: 'Edit site',
    },
    Save: 'Save',
    Cancel: 'Cancel',
  },
  Export: {
    ModalTitle: 'Export Sites',
  },
};

export const Shapes: Record<Shape, string> = <const>{
  [Shape.Ribbon]: Labels.Site.Shape.Ribbon,
  [Shape.Triangle]: Labels.Site.Shape.Triangle,
};

export const MatchRules: Record<MatchRule, string> = <const>{
  [MatchRule.Exact]: Labels.Site.MatchRule.Exact,
  [MatchRule.StartsWith]: Labels.Site.MatchRule.StartsWith,
  [MatchRule.EndsWith]: Labels.Site.MatchRule.EndsWith,
  [MatchRule.RegEx]: Labels.Site.MatchRule.RegEx,
  [MatchRule.CidrV4]: Labels.Site.MatchRule.CidrV4,
  [MatchRule.CidrV6]: Labels.Site.MatchRule.CidrV6,
};

export const MatchRuleDescriptions: Record<MatchRule, string> = <const>{
  [MatchRule.Exact]: Labels.Site.MatchRule.Description.Exact,
  [MatchRule.StartsWith]: Labels.Site.MatchRule.Description.StartsWith,
  [MatchRule.EndsWith]: Labels.Site.MatchRule.Description.EndsWith,
  [MatchRule.RegEx]: Labels.Site.MatchRule.Description.RegEx,
  [MatchRule.CidrV4]: Labels.Site.MatchRule.Description.CidrV4,
  [MatchRule.CidrV6]: Labels.Site.MatchRule.Description.CidrV6,
};

export const Placements: Record<Placement, string> = <const>{
  [Placement.TopLeft]: Labels.Site.Placement.TopLeft,
  [Placement.TopRight]: Labels.Site.Placement.TopRight,
  [Placement.BottomLeft]: Labels.Site.Placement.BottomLeft,
  [Placement.BottomRight]: Labels.Site.Placement.BottomRight,
};
