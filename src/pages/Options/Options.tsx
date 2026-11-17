import React, { useState, useMemo, useEffect } from 'react';
import { Button, Col, Row, Space } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import {
  PageLayout,
  Settings,
  SiteTable,
  SiteModal,
  NoSite,
  SiteSelectionModal,
  ImportButton,
  SettingSwitch,
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
import { DefaultFileName, Labels } from '../../labels';
import { Site, StorageKey, Configuration } from '../../persistence';
import { downloadFile, isEmpty } from '../../util';

const Options = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [initialSite, setInitialSite] = useState<Site>(INITIAL_SITE);

  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importSites, setImportSites] = useState<Site[]>([]);

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
  const {
    data: sites,
    reload: reloadSites,
    isLoading: isLoadingSites,
  } = useListSites();
  const { mutate: saveSite } = useSaveSite({ onSuccess: reloadSites });
  const { mutate: deleteSite } = useDeleteSite({ onSuccess: reloadSites });
  const { data: isEnabled, reload: reloadIsEnabled } = useLoadItem<boolean>({
    key: StorageKey.IsEnabled,
  });
  const { mutate: saveItem } = useSaveItem<boolean>({
    onSuccess: reloadIsEnabled,
  });
  const { data: isDnsOverHttpsEnabled, reload: reloadDnsOverHttps } =
    useLoadItem<boolean>({ key: StorageKey.DnsOverHttps });
  const { mutate: saveDnsOverHttps } = useSaveItem<boolean>({
    onSuccess: reloadDnsOverHttps,
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

  const onImport = (configuration: Configuration) => {
    setShowImportModal(true);
    setImportSites(configuration.data);
  };

  return (
    <Settings>
      <PageLayout title={Labels.AppName} copyright={Labels.Copyright}>
        {isEmpty(sites) ? (
          <NoSite onAddSite={() => setShowModal(true)} onImport={onImport} />
        ) : (
          <Space orientation="vertical" size="middle">
            <Row gutter={42} justify="space-around" align="middle">
              <Col flex="50%">
                <Space orientation="horizontal" size="middle">
                  <SettingSwitch
                    label={Labels.Settings.Indicators.Label}
                    description={Labels.Settings.Indicators.Description}
                    checked={isEnabled === undefined || isEnabled}
                    onChange={(checked) =>
                      saveItem(StorageKey.IsEnabled, checked)
                    }
                  />
                  <SettingSwitch
                    label={Labels.Settings.DnsOverHttps.Label}
                    description={Labels.Settings.DnsOverHttps.Description}
                    checked={isDnsOverHttpsEnabled === true}
                    onChange={(checked) =>
                      saveDnsOverHttps(StorageKey.DnsOverHttps, checked)
                    }
                  />
                </Space>
              </Col>
              <Col
                flex="50%"
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Space orientation="horizontal" size="middle">
                  <ImportButton onImport={onImport} />
                  <Button
                    onClick={() => setShowExportModal(true)}
                    icon={<DownloadOutlined />}
                  >
                    {Labels.Action.Export}
                  </Button>
                  <Button
                    onClick={() => setShowModal(true)}
                    icon={<PlusOutlined />}
                  >
                    {Labels.Action.Add}
                  </Button>
                </Space>
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
      <SiteSelectionModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        sites={sites}
        isLoading={isLoadingSites}
        okText={Labels.Action.Export}
        onSitesSelected={(sites) =>
          downloadFile<Configuration>(DefaultFileName, {
            version: 1,
            data: sites,
          })
        }
      />
      <SiteSelectionModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        sites={importSites}
        okText={Labels.Action.Import}
        onSitesSelected={(sites) => sites.forEach(saveSite)}
      />
    </Settings>
  );
};

export default Options;
