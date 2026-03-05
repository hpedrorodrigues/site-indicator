import React, { useEffect, useCallback, Key } from 'react';
import { Table } from 'antd';
import { MatchRule, Placement, Shape, Site } from '../../persistence';
import { Labels, MatchRules, Placements, Shapes } from '../../labels';
import { compareText } from '../../util';
import { getColumnSearchProps } from '../search';

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
        preserveSelectedRowKeys: true,
        selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
        onChange: (newSelectedKeys: Key[]) =>
          onSelectionChanged?.(newSelectedKeys as number[]),
      }}
    >
      <Column<Site>
        title={Labels.Site.Field.Label}
        dataIndex="label"
        key="label"
        ellipsis
        sorter={(a, b) => compareText(a.label, b.label)}
        {...getColumnSearchProps(
          (site) => site.label,
          Labels.Action.SearchByLabel
        )}
      />
      <Column<Site>
        title={Labels.Site.Field.MatchRule}
        dataIndex="matchRule"
        key="matchRule"
        sorter={(a, b) =>
          compareText(MatchRules[a.matchRule], MatchRules[b.matchRule])
        }
        render={(value) => MatchRules[value as MatchRule]}
        {...getColumnSearchProps(
          (site) => MatchRules[site.matchRule],
          Labels.Action.SearchByMatchRule
        )}
      />
      <Column<Site>
        title={Labels.Site.Field.Value}
        dataIndex="value"
        key="value"
        ellipsis
        sorter={(a, b) => compareText(a.value, b.value)}
        {...getColumnSearchProps(
          (site) => site.value,
          Labels.Action.SearchByValue
        )}
      />
      <Column<Site>
        title={Labels.Site.Field.Shape}
        dataIndex="shape"
        key="shape"
        align="center"
        render={(value) => Shapes[value as Shape]}
      />
      <Column<Site>
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
