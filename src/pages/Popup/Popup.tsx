import { type CSSProperties, useState } from 'react';
import { Button, Col, Row, Space } from 'antd';
import {
  PageLayout,
  Settings,
  SettingSwitch,
  SiteList,
  SiteSearch,
  NoSite,
} from '../../components';
import {
  useActiveTabUrl,
  useDeleteSite,
  useListSites,
  useLoadItem,
  useMatchingSites,
  useSaveItem,
  useSaveSite,
} from '../../hooks';
import { Labels } from '../../labels';
import { showRefreshMessage } from '../../messages';
import { Tabs } from '../../tabs';
import {
  getPageAddress,
  type Site,
  setSiteEnabled,
  StorageKey,
} from '../../persistence';
import { isEmpty } from '../../util';
import { filterSites, sortSites, type SiteSort } from '../../query';

const spaceStyles: CSSProperties = {
  width: '100%',
};

const addSiteParams = (domain?: string): string =>
  domain ? `?modal=true&value=${encodeURIComponent(domain)}` : '?modal=true';

const Popup = () => {
  const { data: sites, reload: reloadSites } = useListSites();
  const { mutate: deleteSite } = useDeleteSite({ onSuccess: reloadSites });
  const { mutate: saveSite } = useSaveSite({ onSuccess: reloadSites });

  const { data: isEnabled, reload: reloadIsEnabled } = useLoadItem<boolean>({
    key: StorageKey.IsEnabled,
  });
  const { mutate: saveItem } = useSaveItem<boolean>({
    onSuccess: reloadIsEnabled,
  });
  const { data: sort } = useLoadItem<SiteSort>({ key: StorageKey.Sort });
  const { data: url } = useActiveTabUrl();
  const domain = getPageAddress(url)?.domain;
  const { data: matches } = useMatchingSites({ sites, url });
  const [query, setQuery] = useState<string>('');

  const openAddSite = (domain?: string) =>
    Tabs.openOptionsPage(addSiteParams(domain));

  const onToggle = (site: Site, enabled: boolean) => {
    saveSite(setSiteEnabled(site, enabled));
    showRefreshMessage();
  };

  return (
    <Settings>
      <PageLayout title={Labels.AppName}>
        {isEmpty(sites) ? (
          <NoSite onAddSite={() => openAddSite(domain)} />
        ) : (
          <Space orientation="vertical" size="middle" style={spaceStyles}>
            <Row gutter={42} justify="space-around" align="middle">
              <Col flex="50%">
                <SettingSwitch
                  label={Labels.Settings.Indicators.Label}
                  description={Labels.Settings.Indicators.Description}
                  checked={isEnabled === undefined || isEnabled}
                  onChange={(checked) => {
                    saveItem(StorageKey.IsEnabled, checked);
                    showRefreshMessage();
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
            <SiteSearch value={query} onChange={setQuery} />
            <SiteList
              sites={filterSites(sortSites(sites, sort), query)}
              matchingIds={matches.map((site) => site.id!!)}
              onDelete={deleteSite}
              onEdit={({ id }) => Tabs.openOptionsPage(`?id=${id}&modal=true`)}
              onClone={({ id }) =>
                Tabs.openOptionsPage(`?clone=${id}&modal=true`)
              }
              onToggle={onToggle}
            />
          </Space>
        )}
      </PageLayout>
    </Settings>
  );
};

export default Popup;
