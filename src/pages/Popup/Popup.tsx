import React, { CSSProperties } from 'react';
import { Button, Space } from 'antd';
import { PageLayout, Settings, SiteList, NoSite } from '../../components';
import { useDeleteSite, useListSites } from '../../hooks';
import { Labels } from '../../labels';
import { Tabs } from '../../tabs';

const spaceStyles: CSSProperties = {
  width: '100%',
};

const Popup = () => {
  const { data: sites, reload: reloadSites } = useListSites();
  const { mutate: deleteSite } = useDeleteSite({ onSuccess: reloadSites });

  return (
    <Settings>
      <PageLayout title={Labels.AppName} copyright={Labels.Copyright}>
        {!sites || sites.length === 0 ? (
          <NoSite addSite={() => Tabs.openOptionsPage('?modal=true')} />
        ) : (
          <>
            <Space
              direction="vertical"
              size="middle"
              align="end"
              style={spaceStyles}
            >
              <Button onClick={() => Tabs.openOptionsPage()}>
                {Labels.Action.Preferences}
              </Button>
            </Space>
            <SiteList
              sites={sites}
              onDelete={deleteSite}
              onEdit={({ id }) => Tabs.openOptionsPage(`?id=${id}&modal=true`)}
            />
          </>
        )}
      </PageLayout>
    </Settings>
  );
};

export default Popup;
