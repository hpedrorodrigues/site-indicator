import {
  type CSSProperties,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import {
  Button,
  Col,
  Row,
  Space,
  Tooltip,
  Typography,
  notification,
} from 'antd';
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
  SiteSearch,
  INITIAL_SITE,
  cloneSite,
} from '../../components';
import {
  useSaveSite,
  useDeleteSite,
  useListSites,
  useLoadSite,
  useLoadItem,
  useSaveItem,
  useSaveSites,
  useStorageUsage,
} from '../../hooks';
import { DefaultFileName, Labels } from '../../labels';
import { showRefreshMessage } from '../../messages';
import {
  type Site,
  setSiteEnabled,
  StorageKey,
  SyncLimits,
  type Configuration,
} from '../../persistence';
import { filterSites, type SiteSort } from '../../query';
import { downloadFile, isEmpty } from '../../util';

const spaceStyles: CSSProperties = {
  width: '100%',
};

const Options = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [initialSite, setInitialSite] = useState<Site>(INITIAL_SITE);

  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importSites, setImportSites] = useState<Site[]>([]);
  const [query, setQuery] = useState<string>('');

  const urlParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );

  const siteId = urlParams.get('id') ?? urlParams.get('clone');
  const onSiteLoaded = useCallback(
    (site: Site | undefined) => {
      if (!site) return;
      setInitialSite(urlParams.has('clone') ? cloneSite(site) : site);
    },
    [urlParams]
  );
  useLoadSite({
    siteId: siteId ? parseInt(siteId) : undefined,
    onSuccess: onSiteLoaded,
  });
  const {
    data: sites,
    reload: reloadSites,
    isLoading: isLoadingSites,
  } = useListSites();
  const { data: usedBytes, reload: reloadUsage } = useStorageUsage();
  const reloadAll = useCallback(() => {
    reloadSites();
    reloadUsage();
  }, [reloadSites, reloadUsage]);
  const notifyStorageError = useCallback((error: Error) => {
    notification.error({
      message: Labels.Storage.Errors.Title,
      description: /quota/i.test(error.message)
        ? Labels.Storage.Errors.QuotaExceeded
        : error.message,
    });
  }, []);
  const { mutate: saveSite } = useSaveSite({
    onSuccess: reloadAll,
    onError: notifyStorageError,
  });
  const { mutate: saveSites } = useSaveSites({
    onSuccess: reloadAll,
    onError: notifyStorageError,
  });
  const { mutate: deleteSite } = useDeleteSite({
    onSuccess: reloadAll,
    onError: notifyStorageError,
  });
  const { data: sort, reload: reloadSort } = useLoadItem<SiteSort>({
    key: StorageKey.Sort,
  });
  const { mutate: saveSort } = useSaveItem<SiteSort>({
    onSuccess: reloadSort,
  });
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
    const value = urlParams.get('value');
    if (value) {
      setInitialSite({ ...INITIAL_SITE, value });
    }
  }, [urlParams]);

  const onEdit = (site: Site) => {
    setInitialSite(site);
    setShowModal(true);
  };

  const onClone = (site: Site) => {
    setInitialSite(cloneSite(site));
    setShowModal(true);
  };

  const onToggle = (site: Site, enabled: boolean) => {
    saveSite(setSiteEnabled(site, enabled));
    showRefreshMessage();
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
      <PageLayout title={Labels.AppName}>
        {isEmpty(sites) ? (
          <NoSite onAddSite={() => setShowModal(true)} onImport={onImport} />
        ) : (
          <Space orientation="vertical" size="middle" style={spaceStyles}>
            <Row gutter={42} justify="space-around" align="middle">
              <Col flex="50%">
                <Space orientation="horizontal" size="middle">
                  <SettingSwitch
                    label={Labels.Settings.Indicators.Label}
                    description={Labels.Settings.Indicators.Description}
                    checked={isEnabled === undefined || isEnabled}
                    onChange={(checked) => {
                      saveItem(StorageKey.IsEnabled, checked);
                      showRefreshMessage();
                    }}
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
            <Row gutter={42} align="middle">
              <Col flex="auto">
                <SiteSearch value={query} onChange={setQuery} />
              </Col>
              <Col>
                <Tooltip title={Labels.Storage.Limits}>
                  <Typography.Text type="secondary">
                    {Labels.Storage.Usage(
                      sites.length,
                      Math.round((usedBytes / SyncLimits.bytes) * 100)
                    )}
                  </Typography.Text>
                </Tooltip>
              </Col>
            </Row>
            <SiteTable
              sites={filterSites(sites, query)}
              sort={sort}
              onSortChange={(sort) => saveSort(StorageKey.Sort, sort)}
              onDelete={deleteSite}
              onEdit={onEdit}
              onClone={onClone}
              onToggle={onToggle}
            />
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
        onSitesSelected={saveSites}
      />
    </Settings>
  );
};

export default Options;
