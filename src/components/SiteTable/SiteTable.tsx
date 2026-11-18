import { Table, Button, Popconfirm, Row, Col, Switch } from 'antd';
import type { SiteSort, SortColumn } from '../../query';
import {
  isSiteEnabled,
  MatchRule,
  Placement,
  Shape,
  type Site,
} from '../../persistence';
import { Labels, MatchRules, Placements, Shapes } from '../../labels';
import { compareText } from '../../util';
import { getColumnSearchProps } from '../search';
import { ColorSwatch } from '../ColorSwatch';

const { Column } = Table;

type SiteTableProps = {
  sites?: Site[];
  onDelete?: (id: number) => void;
  onEdit?: (site: Site) => void;
  onClone?: (site: Site) => void;
  onToggle?: (site: Site, enabled: boolean) => void;
  isLoading?: boolean;
  sort?: SiteSort;
  onSortChange?: (sort: SiteSort | undefined) => void;
};

const SiteTable = ({
  sites,
  onDelete,
  onEdit,
  onClone,
  onToggle,
  isLoading,
  sort,
  onSortChange,
}: SiteTableProps) => {
  const sortOrder = (column: SortColumn) =>
    sort?.column === column ? sort.order : null;

  return (
    <Table<Site>
      dataSource={sites}
      rowKey={(site) => `${site.id}`}
      loading={isLoading}
      onChange={(_, __, sorter) => {
        const current = Array.isArray(sorter) ? sorter[0] : sorter;
        onSortChange?.(
          current?.order && current.columnKey
            ? { column: current.columnKey as SortColumn, order: current.order }
            : undefined
        );
      }}
    >
      <Column<Site>
        title={Labels.Site.Field.Enabled}
        key="enabled"
        align="center"
        width={100}
        render={(_, site) => (
          <Switch
            size="small"
            checked={isSiteEnabled(site)}
            onChange={(checked) => onToggle?.(site, checked)}
          />
        )}
      />
      <Column<Site>
        title={Labels.Site.Field.Label}
        dataIndex="label"
        key="label"
        ellipsis
        sortOrder={sortOrder('label')}
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
        sortOrder={sortOrder('matchRule')}
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
        sortOrder={sortOrder('value')}
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
      <Column
        title={Labels.Site.Field.Color}
        dataIndex="color"
        key="color"
        align="center"
        render={(color) => <ColorSwatch color={color} />}
      />
      <Column
        title={Labels.Site.Field.LabelColor}
        dataIndex="labelColor"
        key="labelColor"
        align="center"
        render={(color) => <ColorSwatch color={color} />}
      />
      <Column<Site>
        title={Labels.Action.Title}
        key="action"
        align="center"
        width={250}
        render={(_, site) => (
          <Row wrap={false}>
            <Col>
              <Button type="link" onClick={() => onEdit?.(site)}>
                {Labels.Action.Edit}
              </Button>
            </Col>
            <Col>
              <Button type="link" onClick={() => onClone?.(site)}>
                {Labels.Action.Clone}
              </Button>
            </Col>
            <Col>
              <Popconfirm
                title={Labels.Action.ConfirmDelete}
                onConfirm={() => onDelete?.(site.id!!)}
                placement="leftTop"
              >
                <Button type="link">{Labels.Action.Delete}</Button>
              </Popconfirm>
            </Col>
          </Row>
        )}
      />
    </Table>
  );
};

export default SiteTable;
