import React, { useState, useMemo, useEffect } from 'react';
import { Button, Col, Row, Space, Switch } from 'antd';
import {
  PageLayout,
  Settings,
  SiteTable,
  SiteModal,
  NoSite,
  INITIAL_SITE,
} from '../../components';
import {
  useSaveSite,
  useDeleteSite,
  useListSites,
  useLoadSite,
  useLoadItem,
  useSaveItem,
} from '../../hooks';
import { Labels } from '../../labels';
import { Site, StorageKey } from '../../persistence';

const Options = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [initialSite, setInitialSite] = useState<Site>(INITIAL_SITE);

  const urlParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );

  useLoadSite({
    siteId: urlParams.has('id') ? parseInt(urlParams.get('id')!) : undefined,
    onSuccess: (site) => {
      if (!site) return;
      setInitialSite(site);
    },
  });
  const { data: sites, reload: reloadSites } = useListSites();
  const { mutate: saveSite } = useSaveSite({ onSuccess: reloadSites });
  const { mutate: deleteSite } = useDeleteSite({ onSuccess: reloadSites });
  const { data: isEnabled, reload: reloadIsEnabled } = useLoadItem<boolean>({
    key: StorageKey.IsEnabled,
  });
  const { mutate: saveItem } = useSaveItem<boolean>({
    onSuccess: reloadIsEnabled,
  });

  useEffect(() => {
    setShowModal(urlParams.has('modal') && urlParams.get('modal') === 'true');
  }, [urlParams]);

  const onEdit = (site: Site) => {
    setInitialSite(site);
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
    setInitialSite(INITIAL_SITE);
  };

  return (
    <Settings>
      <PageLayout title={Labels.AppName} copyright={Labels.Copyright}>
        {!sites || sites.length === 0 ? (
          <NoSite onAddSite={() => setShowModal(true)} />
        ) : (
          <Space direction="vertical" size="middle">
            <Row gutter={42} justify="space-around" align="middle">
              <Col flex="50%">
                <Switch
                  checkedChildren={Labels.Action.Enabled}
                  unCheckedChildren={Labels.Action.Disabled}
                  checked={isEnabled === undefined || isEnabled}
                  onChange={(checked) =>
                    saveItem(StorageKey.IsEnabled, checked)
                  }
                />
              </Col>
              <Col
                flex="50%"
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button onClick={() => setShowModal(true)}>
                  {Labels.Action.Add}
                </Button>
              </Col>
            </Row>
            <SiteTable sites={sites} onDelete={deleteSite} onEdit={onEdit} />
          </Space>
        )}
      </PageLayout>
      <SiteModal
        onClose={onClose}
        open={showModal}
        onSave={saveSite}
        initialSite={initialSite}
      />
    </Settings>
  );
};

export default Options;
