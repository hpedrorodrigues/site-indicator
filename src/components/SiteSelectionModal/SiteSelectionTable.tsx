import React, { useEffect, useCallback, Key, useMemo, useState } from 'react';
import { Table, Input } from 'antd';
import { MatchRule, Placement, Shape, Site } from '../../persistence';
import { Labels, MatchRules, Placements, Shapes } from '../../labels';
import { compareText } from '../../util';
import { siteMatches } from '../search';

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
  const [query, setQuery] = useState<string>('');

  const getSiteKey = useCallback((site: Site): number => site.id!, []);

  const filteredSites = useMemo(
    () => (sites ?? []).filter((site) => siteMatches(site, query)),
    [query, sites]
  );

  useEffect(() => {
    if (sites) {
      onSelectionChanged?.(sites.map(getSiteKey));
    }
  }, [sites, onSelectionChanged, getSiteKey]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Input.Search
          allowClear
          placeholder={Labels.Action.Search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ marginBottom: 12, maxWidth: 330 }}
        />
      </div>
      <Table<Site>
        dataSource={filteredSites}
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
        />
        <Column<Site>
          title={Labels.Site.Field.MatchRule}
          dataIndex="matchRule"
          key="matchRule"
          sorter={(a, b) =>
            compareText(MatchRules[a.matchRule], MatchRules[b.matchRule])
          }
          render={(value) => MatchRules[value as MatchRule]}
        />
        <Column<Site>
          title={Labels.Site.Field.Value}
          dataIndex="value"
          key="value"
          ellipsis
          sorter={(a, b) => compareText(a.value, b.value)}
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
    </>
  );
};

export default SiteSelectionTable;
