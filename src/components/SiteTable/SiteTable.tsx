import React from 'react';
import { Table, Button, Tag, Popconfirm, Row, Col } from 'antd';
import { MatchRule, Placement, Shape, Site } from '../../persistence';
import { Labels, MatchRules, Placements, Shapes } from '../../labels';

const { Column } = Table;

type SiteTableProps = {
  sites?: Site[];
  onDelete?: (id: number) => void;
  onEdit?: (site: Site) => void;
  isLoading?: boolean;
};

const SiteTable = ({ sites, onDelete, onEdit, isLoading }: SiteTableProps) => (
  <Table<Site>
    dataSource={sites}
    rowKey={(site) => `${site.id}`}
    loading={isLoading}
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
    <Column
      title={Labels.Site.Field.Color}
      dataIndex="color"
      key="color"
      align="center"
      render={(color) => (
        <Tag bordered color={color}>
          &nbsp;&nbsp;&nbsp;
        </Tag>
      )}
    />
    <Column
      title={Labels.Site.Field.LabelColor}
      dataIndex="labelColor"
      key="labelColor"
      align="center"
      render={(color) => (
        <Tag bordered color={color}>
          &nbsp;&nbsp;&nbsp;
        </Tag>
      )}
    />
    <Column<Site>
      title={Labels.Action.Title}
      key="action"
      align="center"
      render={(_, site) => (
        <Row>
          <Col>
            <Button type="link" onClick={() => onEdit?.(site)}>
              {Labels.Action.Edit}
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

export default SiteTable;
