import { MatchRule, Placement, Shape, Size } from './persistence';

export const DefaultFileName = 'site-indicator-configuration.json';

export const Labels = {
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
      TitlePrefix: 'Title prefix',
      Enabled: 'Enabled',
      Size: 'Size',
      Opacity: 'Opacity',
    },
    Shape: {
      Ribbon: 'Ribbon',
      Triangle: 'Triangle',
      Frame: 'Frame',
    },
    MatchRule: {
      Exact: 'Exact',
      ContainsWords: 'Contains words',
      StartsWith: 'Starts with',
      EndsWith: 'Ends with',
      RegEx: 'Regular Expression',
      CidrV4: 'CIDR v4 (Experimental)',
      CidrV6: 'CIDR v6 (Experimental)',
      Description: {
        Exact:
          '"Exact" will perform equality to match the page domain (ignoring "www.").',
        ContainsWords:
          '"Contains words" will check whether the page domain contains any of the given words. Please, provide words separated by comma.',
        StartsWith:
          '"Starts with" will check whether the page domain begins with the given value (ignoring "www.").',
        EndsWith:
          '"Ends with" will check whether the page domain ends with the given value (ignoring "www.").',
        RegEx:
          '"Regular Expression" will check whether the provided patterns match the page domain.',
        CidrV4:
          '"CIDR v4 (Experimental)" will check whether the page IPv4 address it\'s inside an IP range expressed in CIDR notation. Hostnames are resolved only when "DNS over HTTPS" is enabled in Preferences, and the resolver may answer with a different address than the one the browser used. Prefer a domain rule when possible.',
        CidrV6:
          '"CIDR v6 (Experimental)" will check whether the page IPv6 address it\'s inside an IP range expressed in CIDR notation. Hostnames are resolved only when "DNS over HTTPS" is enabled in Preferences, and the resolver may answer with a different address than the one the browser used. Prefer a domain rule when possible.',
      },
    },
    Errors: {
      Value: {
        Exact: 'Enter a domain such as example.com.',
        ContainsWords: 'Enter at least one word. Separate words with commas.',
        StartsWith:
          'Enter the beginning of a domain, using letters, digits, dots and hyphens.',
        EndsWith:
          'Enter the end of a domain, using letters, digits, dots and hyphens.',
        RegEx: 'Enter a valid regular expression.',
        CidrV4: 'Enter an IPv4 range in CIDR notation, such as 10.0.0.0/8.',
        CidrV6: 'Enter an IPv6 range in CIDR notation, such as 2001:db8::/32.',
      },
    },
    Placement: {
      TopLeft: 'Top Left',
      TopRight: 'Top Right',
      BottomLeft: 'Bottom Left',
      BottomRight: 'Bottom Right',
    },
    Size: {
      Small: 'Small',
      Medium: 'Medium',
      Large: 'Large',
    },
    Opacity: {
      Description: 'How visible the indicator is. 100% is fully opaque.',
    },
    CopyLabel: (label: string) => `${label} copy`,
    TitlePrefix: {
      Placeholder: '[PROD]',
      Description:
        'Shown before the page title in the tab strip. Leave it empty to keep the title.',
    },
  },
  Settings: {
    Indicators: {
      Label: 'Indicators',
      Description:
        'Shows the configured indicators on matching pages. Refresh open pages after changing it.',
    },
    DnsOverHttps: {
      Label: 'DNS over HTTPS',
      Description:
        'Resolves page hostnames through Cloudflare or Google nameservers when a CIDR rule needs an IP address. The hostnames of the pages you visit are sent to those providers. Disabled by default.',
    },
  },
  Popup: {
    OnThisPage: 'On this page',
  },
  Action: {
    Title: 'Actions',
    Add: 'Add site',
    AddNow: 'Create now',
    Delete: 'Delete',
    ConfirmDelete: 'Are you sure?',
    Edit: 'Edit',
    Clone: 'Clone',
    Preferences: 'Preferences',
    Enabled: 'Enabled',
    Disabled: 'Disabled',
    Import: 'Import',
    Export: 'Export',
    Search: 'Search',
    Reset: 'Reset',
    SearchByLabel: 'Search by label...',
    SearchByMatchRule: 'Search by match rule...',
    SearchByValue: 'Search by value...',
    SearchSites: 'Search sites...',
  },
  Form: {
    SectionTitle: 'Indicator',
  },
  Storage: {
    Usage: (count: number, percent: number) =>
      `${count} ${count === 1 ? 'site' : 'sites'}, ${percent}% of sync storage`,
    Limits:
      'Chrome syncs at most 512 items and 100 KB in total. Each site takes one item and about 250 bytes.',
    Errors: {
      Title: 'Storage error',
      QuotaExceeded:
        'Chrome sync storage is full. It holds at most 512 items and 100 KB in total.',
    },
  },
  Configuration: {
    Errors: {
      InvalidFile:
        'Invalid file uploaded! This file does not have the expected format!',
      CouldNotUpload: 'An error occurred uploading the selected file!',
      InvalidSite: (label: string) =>
        `Site "${label}" has an invalid value for its match rule.`,
    },
  },
  Modal: {
    Title: {
      Add: 'Add new site',
      Edit: 'Edit site',
    },
    Ok: 'Ok',
    Save: 'Save',
    Cancel: 'Cancel',
  },
  Selection: {
    ModalTitle: 'Select Sites',
  },
} as const;

export const Shapes: Record<Shape, string> = {
  [Shape.Ribbon]: Labels.Site.Shape.Ribbon,
  [Shape.Triangle]: Labels.Site.Shape.Triangle,
  [Shape.Frame]: Labels.Site.Shape.Frame,
} as const;

export const Sizes: Record<Size, string> = {
  [Size.Small]: Labels.Site.Size.Small,
  [Size.Medium]: Labels.Site.Size.Medium,
  [Size.Large]: Labels.Site.Size.Large,
} as const;

export const MatchRules: Record<MatchRule, string> = {
  [MatchRule.Exact]: Labels.Site.MatchRule.Exact,
  [MatchRule.ContainsWords]: Labels.Site.MatchRule.ContainsWords,
  [MatchRule.StartsWith]: Labels.Site.MatchRule.StartsWith,
  [MatchRule.EndsWith]: Labels.Site.MatchRule.EndsWith,
  [MatchRule.RegEx]: Labels.Site.MatchRule.RegEx,
  [MatchRule.CidrV4]: Labels.Site.MatchRule.CidrV4,
  [MatchRule.CidrV6]: Labels.Site.MatchRule.CidrV6,
} as const;

export const MatchRuleDescriptions: Record<MatchRule, string> = {
  [MatchRule.Exact]: Labels.Site.MatchRule.Description.Exact,
  [MatchRule.ContainsWords]: Labels.Site.MatchRule.Description.ContainsWords,
  [MatchRule.StartsWith]: Labels.Site.MatchRule.Description.StartsWith,
  [MatchRule.EndsWith]: Labels.Site.MatchRule.Description.EndsWith,
  [MatchRule.RegEx]: Labels.Site.MatchRule.Description.RegEx,
  [MatchRule.CidrV4]: Labels.Site.MatchRule.Description.CidrV4,
  [MatchRule.CidrV6]: Labels.Site.MatchRule.Description.CidrV6,
} as const;

export const ValueErrors: Record<MatchRule, string> = {
  [MatchRule.Exact]: Labels.Site.Errors.Value.Exact,
  [MatchRule.ContainsWords]: Labels.Site.Errors.Value.ContainsWords,
  [MatchRule.StartsWith]: Labels.Site.Errors.Value.StartsWith,
  [MatchRule.EndsWith]: Labels.Site.Errors.Value.EndsWith,
  [MatchRule.RegEx]: Labels.Site.Errors.Value.RegEx,
  [MatchRule.CidrV4]: Labels.Site.Errors.Value.CidrV4,
  [MatchRule.CidrV6]: Labels.Site.Errors.Value.CidrV6,
} as const;

export const Placements: Record<Placement, string> = {
  [Placement.TopLeft]: Labels.Site.Placement.TopLeft,
  [Placement.TopRight]: Labels.Site.Placement.TopRight,
  [Placement.BottomLeft]: Labels.Site.Placement.BottomLeft,
  [Placement.BottomRight]: Labels.Site.Placement.BottomRight,
} as const;
