import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Labels } from '../../labels';

type SiteSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

const SiteSearch = ({ value, onChange }: SiteSearchProps) => (
  <Input
    allowClear
    prefix={<SearchOutlined />}
    placeholder={Labels.Action.SearchSites}
    value={value}
    onChange={(event) => onChange(event.target.value)}
  />
);

export default SiteSearch;
