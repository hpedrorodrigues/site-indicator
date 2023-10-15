import React, { CSSProperties } from 'react';
import { Button, Col, Row, Space, Switch, message } from 'antd';
import { PageLayout, Settings, SiteList, NoSite } from '../../components';
import {
  useDeleteSite,
  useListSites,
  useLoadItem,
  useSaveItem,
} from '../../hooks';
import { Labels } from '../../labels';
import { Tabs } from '../../tabs';
import { StorageKey } from '../../persistence';
import { isEmpty } from '../../util';

const spaceStyles: CSSProperties = {
  width: '100%',
};

const Popup = () => {
  const { data: sites, reload: reloadSites } = useListSites();
  const { mutate: deleteSite } = useDeleteSite({ onSuccess: reloadSites });

  const { data: isEnabled, reload: reloadIsEnabled } = useLoadItem<boolean>({
    key: StorageKey.IsEnabled,
  });
  const { mutate: saveItem } = useSaveItem<boolean>({
    onSuccess: reloadIsEnabled,
  });

  return (
    <Settings>
      <PageLayout title={Labels.AppName} copyright={Labels.Copyright}>
        {isEmpty(sites) ? (
          <NoSite onAddSite={() => Tabs.openOptionsPage('?modal=true')} />
        ) : (
          <Space direction="vertical" size="middle" style={spaceStyles}>
            <Row gutter={42} justify="space-around" align="middle">
              <Col flex="50%">
                <Switch
                  checkedChildren={Labels.Action.Enabled}
                  unCheckedChildren={Labels.Action.Disabled}
                  checked={isEnabled === undefined || isEnabled}
                  onChange={(checked) => {
                    saveItem(StorageKey.IsEnabled, checked);
                    message.open({
                      type: 'info',
                      content: Labels.RefreshPage,
                      duration: 5,
                    });
                  }}
                />
              </Col>
              <Col
                flex="50%"
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button onClick={() => Tabs.openOptionsPage()}>
                  {Labels.Action.Preferences}
                </Button>
              </Col>
            </Row>
            <SiteList
              sites={sites}
              onDelete={deleteSite}
              onEdit={({ id }) => Tabs.openOptionsPage(`?id=${id}&modal=true`)}
            />
          </Space>
        )}
      </PageLayout>
    </Settings>
  );
};

export default Popup;
