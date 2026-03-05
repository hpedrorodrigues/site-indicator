import React from 'react';
import { Button, Input, Space, TableColumnType } from 'antd';
import { Site } from '../persistence';
import { Labels } from '../labels';

export const getColumnSearchProps = (
  getValue: (site: Site) => string,
  placeholder: string
): TableColumnType<Site> => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }} onKeyDown={(event) => event.stopPropagation()}>
      <Input
        autoFocus
        placeholder={placeholder}
        value={selectedKeys[0] as string}
        onChange={(event) => {
          const newValue = event.target.value;
          setSelectedKeys(newValue ? [newValue] : []);
        }}
        onPressEnter={() => confirm({ closeDropdown: true })}
        style={{ marginBottom: 8, display: 'block', width: 220 }}
      />
      <Space>
        <Button
          size="small"
          type="primary"
          onClick={() => confirm({ closeDropdown: true })}
        >
          {Labels.Action.Search}
        </Button>
        <Button
          size="small"
          onClick={() => {
            clearFilters?.();
            confirm({ closeDropdown: true });
          }}
        >
          {Labels.Action.Reset}
        </Button>
      </Space>
    </div>
  ),
  onFilter: (value, record: Site) =>
    getValue(record).toLowerCase().includes(String(value).trim().toLowerCase()),
});
