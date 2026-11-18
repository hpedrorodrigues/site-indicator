import browser from 'webextension-polyfill';
import { MatchRule, Placement, Shape, Size } from './persistence';

export const DefaultFileName = 'site-indicator-configuration.json';

const message = (key: string, substitutions?: string | string[]): string =>
  browser.i18n.getMessage(key, substitutions);

export const Labels = {
  AppName: 'Site Indicator',
  RefreshPage: message('refresh_page'),
  Site: {
    NoSite: message('site_no_site'),
    Field: {
      Label: message('site_field_label'),
      Value: message('site_field_value'),
      Color: message('site_field_color'),
      LabelColor: message('site_field_label_color'),
      Shape: message('site_field_shape'),
      Placement: message('site_field_placement'),
      MatchRule: message('site_field_match_rule'),
      TitlePrefix: message('site_field_title_prefix'),
      Enabled: message('site_field_enabled'),
      Size: message('site_field_size'),
      Opacity: message('site_field_opacity'),
      Priority: message('site_field_priority'),
    },
    Shape: {
      Ribbon: message('site_shape_ribbon'),
      Triangle: message('site_shape_triangle'),
      Frame: message('site_shape_frame'),
    },
    MatchRule: {
      Exact: message('site_match_rule_exact'),
      ContainsWords: message('site_match_rule_contains_words'),
      StartsWith: message('site_match_rule_starts_with'),
      EndsWith: message('site_match_rule_ends_with'),
      RegEx: message('site_match_rule_regex'),
      CidrV4: message('site_match_rule_cidr_v4'),
      CidrV6: message('site_match_rule_cidr_v6'),
      Description: {
        Exact: message('site_match_rule_description_exact'),
        ContainsWords: message('site_match_rule_description_contains_words'),
        StartsWith: message('site_match_rule_description_starts_with'),
        EndsWith: message('site_match_rule_description_ends_with'),
        RegEx: message('site_match_rule_description_regex'),
        CidrV4: message('site_match_rule_description_cidr_v4'),
        CidrV6: message('site_match_rule_description_cidr_v6'),
      },
    },
    Errors: {
      Value: {
        Exact: message('site_errors_value_exact'),
        ContainsWords: message('site_errors_value_contains_words'),
        StartsWith: message('site_errors_value_starts_with'),
        EndsWith: message('site_errors_value_ends_with'),
        RegEx: message('site_errors_value_regex'),
        CidrV4: message('site_errors_value_cidr_v4'),
        CidrV6: message('site_errors_value_cidr_v6'),
      },
    },
    Placement: {
      TopLeft: message('site_placement_top_left'),
      TopRight: message('site_placement_top_right'),
      BottomLeft: message('site_placement_bottom_left'),
      BottomRight: message('site_placement_bottom_right'),
    },
    Size: {
      Small: message('site_size_small'),
      Medium: message('site_size_medium'),
      Large: message('site_size_large'),
    },
    Opacity: {
      Description: message('site_opacity_description'),
    },
    Priority: {
      Drag: message('site_priority_drag'),
      Locked: message('site_priority_locked'),
    },
    CopyLabel: (label: string) => message('site_copy_label', [label]),
    TitlePrefix: {
      Placeholder: message('site_title_prefix_placeholder'),
      Description: message('site_title_prefix_description'),
    },
  },
  Settings: {
    Indicators: {
      Label: message('settings_indicators_label'),
      Description: message('settings_indicators_description'),
    },
    DnsOverHttps: {
      Label: message('settings_dns_over_https_label'),
      Description: message('settings_dns_over_https_description'),
    },
  },
  Popup: {
    OnThisPage: message('popup_on_this_page'),
  },
  Action: {
    Title: message('action_title'),
    Add: message('action_add'),
    AddNow: message('action_add_now'),
    Delete: message('action_delete'),
    ConfirmDelete: message('action_confirm_delete'),
    Edit: message('action_edit'),
    Clone: message('action_clone'),
    Preferences: message('action_preferences'),
    Import: message('action_import'),
    Export: message('action_export'),
    Search: message('action_search'),
    Reset: message('action_reset'),
    SearchByLabel: message('action_search_by_label'),
    SearchByMatchRule: message('action_search_by_match_rule'),
    SearchByValue: message('action_search_by_value'),
    SearchSites: message('action_search_sites'),
  },
  Form: {
    SectionTitle: message('form_section_title'),
  },
  Footer: {
    Version: (version: string) => message('footer_version', [version]),
    Repository: message('footer_repository'),
    ReportIssue: message('footer_report_issue'),
  },
  Storage: {
    Usage: (count: number, percent: number) =>
      count === 1
        ? message('storage_usage_one', [String(percent)])
        : message('storage_usage_other', [String(count), String(percent)]),
    Limits: message('storage_limits'),
    Errors: {
      Title: message('storage_errors_title'),
      QuotaExceeded: message('storage_errors_quota_exceeded'),
    },
  },
  Configuration: {
    Errors: {
      InvalidFile: message('configuration_errors_invalid_file'),
      CouldNotUpload: message('configuration_errors_could_not_upload'),
      InvalidSite: (label: string) =>
        message('configuration_errors_invalid_site', [label]),
    },
  },
  Modal: {
    Title: {
      Add: message('modal_title_add'),
      Edit: message('modal_title_edit'),
    },
    Ok: message('modal_ok'),
    Save: message('modal_save'),
    Cancel: message('modal_cancel'),
  },
  Selection: {
    ModalTitle: message('selection_modal_title'),
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
