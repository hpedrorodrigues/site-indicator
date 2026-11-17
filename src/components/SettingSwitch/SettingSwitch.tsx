import { Space, Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Labels } from '../../labels';

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
    <Switch
      checkedChildren={Labels.Action.Enabled}
      unCheckedChildren={Labels.Action.Disabled}
      checked={checked}
      onChange={onChange}
    />
    {label}
    <Tooltip title={description}>
      <QuestionCircleOutlined />
    </Tooltip>
  </Space>
);

export default SettingSwitch;
