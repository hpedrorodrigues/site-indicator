import React, { CSSProperties } from 'react';
import { Empty, Button } from 'antd';
import { Labels } from '../../labels';

const emptyStyle: CSSProperties = {
  position: 'relative',
  top: '25%',
};

type NoSiteOptions = {
  onAddSite?: () => void;
};

const NoSite = ({ onAddSite }: NoSiteOptions) => (
  <Empty style={emptyStyle} description={Labels.Site.NoSite}>
    <Button type="primary" onClick={onAddSite}>
      {Labels.Action.AddNow}
    </Button>
  </Empty>
);

export default NoSite;
