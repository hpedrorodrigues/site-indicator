import { Button, List, Popconfirm, Space, Tag } from 'antd';
import type { Site } from '../../persistence';
import { Labels, MatchRules, Placements, Shapes } from '../../labels';

type SiteListProps = {
  sites?: Site[];
  matchingIds?: number[];
  onEdit?: (site: Site) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
};

const getDescription = (site: Site): string => {
  const matchRule = MatchRules[site.matchRule];
  const placement = Placements[site.placement];
  const shape = Shapes[site.shape];
  return `${matchRule} - ${placement} - ${shape}`;
};

const getTitle = (site: Site, isMatch: boolean) => (
  <Space size="small">
    {site.label}
    {isMatch && (
      <Tag variant="solid" color={site.color}>
        {Labels.Popup.OnThisPage}
      </Tag>
    )}
  </Space>
);

const SiteList = ({
  sites,
  matchingIds,
  isLoading,
  onEdit,
  onDelete,
}: SiteListProps) => (
  <List
    dataSource={sites}
    loading={isLoading}
    rowKey={(site) => `${site.id}`}
    renderItem={(site) => (
      <List.Item
        actions={[
          <Button type="link" onClick={() => onEdit?.(site)}>
            {Labels.Action.Edit}
          </Button>,
          <Popconfirm
            title={Labels.Action.ConfirmDelete}
            onConfirm={() => onDelete?.(site.id!!)}
            placement="leftTop"
          >
            <Button type="link">{Labels.Action.Delete}</Button>
          </Popconfirm>,
        ]}
      >
        <List.Item.Meta
          title={getTitle(site, matchingIds?.includes(site.id!!) ?? false)}
          description={getDescription(site)}
        />
      </List.Item>
    )}
  />
);

export default SiteList;
