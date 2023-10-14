import React, { PropsWithChildren } from 'react';
import { ConfigProvider, ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#179aeb',
  },
  components: {
    Layout: {
      headerHeight: 40,
      headerColor: '#f7fcff',
      headerBg: '#179aeb',
      headerPadding: '0 16px',
      footerPadding: '16px 50px',
    },
  },
};

type SettingsProps = PropsWithChildren;

const Settings = ({ children }: SettingsProps) => (
  <ConfigProvider theme={theme}>{children}</ConfigProvider>
);

export default Settings;
