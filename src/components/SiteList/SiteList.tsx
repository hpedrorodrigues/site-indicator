import React from 'react';
import { Button, List, Popconfirm } from 'antd';
import { Site } from '../../persistence';
import { Labels, MatchRules, Placements, Shapes } from '../../labels';

type SiteListProps = {
  sites?: Site[];
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

const SiteList = ({ sites, isLoading, onEdit, onDelete }: SiteListProps) => (
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
        <List.Item.Meta title={site.label} description={getDescription(site)} />
      </List.Item>
    )}
  />
);

export default SiteList;
