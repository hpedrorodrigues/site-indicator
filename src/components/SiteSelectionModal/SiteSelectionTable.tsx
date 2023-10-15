import React, { useEffect, useCallback, Key } from 'react';
import { Table } from 'antd';
import { MatchRule, Placement, Shape, Site } from '../../persistence';
import { Labels, MatchRules, Placements, Shapes } from '../../labels';

const { Column } = Table;

type SiteSelectionTableProps = {
  sites?: Site[];
  isLoading?: boolean;
  selectedSiteIds?: number[];
  onSelectionChanged?: (newSiteIds: number[]) => void;
};

const SiteSelectionTable = ({
  sites,
  isLoading,
  selectedSiteIds,
  onSelectionChanged,
}: SiteSelectionTableProps) => {
  const getSiteKey = useCallback((site: Site): number => site.id!, []);

  useEffect(() => {
    if (sites) {
      onSelectionChanged?.(sites.map(getSiteKey));
    }
  }, [sites, onSelectionChanged, getSiteKey]);

  return (
    <Table<Site>
      dataSource={sites}
      rowKey={getSiteKey}
      loading={isLoading}
      rowSelection={{
        selectedRowKeys: selectedSiteIds,
        selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
        onChange: (newSelectedKeys: Key[]) =>
          onSelectionChanged?.(newSelectedKeys as number[]),
      }}
    >
      <Column
        title={Labels.Site.Field.Label}
        dataIndex="label"
        key="label"
        ellipsis
      />
      <Column
        title={Labels.Site.Field.MatchRule}
        dataIndex="matchRule"
        key="matchRule"
        render={(value) => MatchRules[value as MatchRule]}
      />
      <Column
        title={Labels.Site.Field.Value}
        dataIndex="value"
        key="value"
        ellipsis
      />
      <Column
        title={Labels.Site.Field.Shape}
        dataIndex="shape"
        key="shape"
        align="center"
        render={(value) => Shapes[value as Shape]}
      />
      <Column
        title={Labels.Site.Field.Placement}
        dataIndex="placement"
        key="placement"
        align="center"
        render={(value) => Placements[value as Placement]}
      />
    </Table>
  );
};

export default SiteSelectionTable;
