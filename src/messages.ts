import { message } from 'antd';
import { Labels } from './labels';

export const showRefreshMessage = (): void => {
  message.open({ type: 'info', content: Labels.RefreshPage, duration: 5 });
};
