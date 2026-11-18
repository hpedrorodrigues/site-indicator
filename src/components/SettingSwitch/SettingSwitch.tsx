import { Space, Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

type SettingSwitchProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const SettingSwitch = ({
  label,
  description,
  checked,
  onChange,
}: SettingSwitchProps) => (
  <Space size="small">
    <Switch aria-label={label} checked={checked} onChange={onChange} />
    {label}
    <Tooltip title={description}>
      <QuestionCircleOutlined />
    </Tooltip>
  </Space>
);

export default SettingSwitch;
