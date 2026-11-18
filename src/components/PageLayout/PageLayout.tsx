import type { PropsWithChildren, CSSProperties } from 'react';
import { Divider, Layout, Space, Typography } from 'antd';
import browser from 'webextension-polyfill';
import { Labels } from '../../labels';
import { Links } from '../../links';

const { Header, Footer, Content } = Layout;
const { Link, Text } = Typography;

const layoutStyle: CSSProperties = {
  width: '100%',
  height: '100%',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const iconStyle: CSSProperties = {
  width: 24,
  height: 24,
};

const contentStyle: CSSProperties = {
  margin: '16px 16px 0',
  overflowX: 'hidden',
  overflowY: 'auto',
};

const footerStyle: CSSProperties = {
  textAlign: 'center',
};

const footerTextStyle: CSSProperties = {
  fontSize: 12,
};

type PageLayoutProps = PropsWithChildren & {
  title: string;
};

const PageLayout = ({ title, children }: PageLayoutProps) => {
  const { version } = browser.runtime.getManifest();

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <img src="icon-48.png" alt="" style={iconStyle} />
        {title}
      </Header>
      <Content style={contentStyle}>{children}</Content>
      <Footer style={footerStyle}>
        <Space size="small" split={<Divider vertical />}>
          <Text type="secondary" style={footerTextStyle}>
            {Labels.Footer.Version(version)}
          </Text>
          <Link href={Links.Repository} target="_blank" style={footerTextStyle}>
            {Labels.Footer.Repository}
          </Link>
          <Link href={Links.Issues} target="_blank" style={footerTextStyle}>
            {Labels.Footer.ReportIssue}
          </Link>
        </Space>
      </Footer>
    </Layout>
  );
};

export default PageLayout;
