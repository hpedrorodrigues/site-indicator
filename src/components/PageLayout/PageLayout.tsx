import type { PropsWithChildren, CSSProperties } from 'react';
import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

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
  height: '100%',
};

const footerStyle: CSSProperties = {
  textAlign: 'center',
};

type PopupHeaderProps = PropsWithChildren & {
  title: string;
  copyright: string;
};

const PageLayout = ({ title, copyright, children }: PopupHeaderProps) => (
  <Layout style={layoutStyle}>
    <Header style={headerStyle}>
      <img src="icon-48.png" alt="" style={iconStyle} />
      {title}
    </Header>
    <Content style={contentStyle}>{children}</Content>
    <Footer style={footerStyle}>{copyright}</Footer>
  </Layout>
);

export default PageLayout;
