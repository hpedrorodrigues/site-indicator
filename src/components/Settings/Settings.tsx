import { type PropsWithChildren, useMemo } from 'react';
import { ConfigProvider, theme, type ThemeConfig } from 'antd';
import { usePrefersDark } from '../../hooks';

const createTheme = (isDark: boolean): ThemeConfig => ({
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: '#179aeb',
  },
  components: {
    Layout: {
      headerHeight: 40,
      headerColor: '#f7fcff',
      headerBg: '#179aeb',
      headerPadding: '0 16px',
      footerPadding: '8px 16px',
    },
  },
});

type SettingsProps = PropsWithChildren;

const Settings = ({ children }: SettingsProps) => {
  const isDark = usePrefersDark();
  const themeConfig = useMemo(() => createTheme(isDark), [isDark]);

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
};

export default Settings;
