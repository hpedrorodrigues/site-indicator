import React, { CSSProperties } from 'react';
import { Empty, Button, Space } from 'antd';
import { ImportButton } from '../../components';
import { Labels } from '../../labels';
import { Configuration } from '../../persistence';

const emptyStyle: CSSProperties = {
  position: 'relative',
  top: '25%',
};

type NoSiteOptions = {
  onAddSite?: () => void;
  onImport?: (configuration: Configuration) => void;
};

const NoSite = ({ onAddSite, onImport }: NoSiteOptions) => (
  <Empty style={emptyStyle} description={Labels.Site.NoSite}>
    <Space direction="horizontal" size="middle">
      <Button type="primary" onClick={onAddSite}>
        {Labels.Action.AddNow}
      </Button>
      {onImport && <ImportButton onImport={onImport} />}
    </Space>
  </Empty>
);

export default NoSite;
