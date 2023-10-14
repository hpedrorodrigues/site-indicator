import React, { useState, useMemo, useEffect } from 'react';
import { Button, Space } from 'antd';
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
} from '../../hooks';
import { Labels } from '../../labels';
import { Site } from '../../persistence';

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
          <NoSite addSite={() => setShowModal(true)} />
        ) : (
          <>
            <Space direction="vertical" size="middle" align="end">
              <Button onClick={() => setShowModal(true)}>
                {Labels.Action.Add}
              </Button>
              <SiteTable sites={sites} onDelete={deleteSite} onEdit={onEdit} />
            </Space>
          </>
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
