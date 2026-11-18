import { Button, notification, Upload, type UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Labels } from '../../labels';
import {
  type Configuration,
  isConfiguration,
  isValidValue,
  normalizeValue,
} from '../../persistence';
import { readFile, toJSON } from '../../util';

type ImportButtonProps = {
  onImport: (configuration: Configuration) => void;
};

const ImportButton = ({ onImport }: ImportButtonProps) => {
  const onFileContentLoaded = (content: string) => {
    console.debug('Importing file', content);
    const parsed = toJSON(content);
    if (!isConfiguration(parsed)) {
      notification.error({ message: Labels.Configuration.Errors.InvalidFile });
      return;
    }

    const invalidSite = parsed.data.find(
      (site) => !isValidValue(site, site.value)
    );
    if (invalidSite) {
      notification.error({
        message: Labels.Configuration.Errors.InvalidSite(invalidSite.label),
      });
      return;
    }

    onImport({
      ...parsed,
      data: parsed.data.map((site) => ({
        ...site,
        value: normalizeValue(site, site.value),
      })),
    });
  };

  const onChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'error') {
      console.debug('Unexpected error uploading file', info);
      notification.error({
        message: Labels.Configuration.Errors.CouldNotUpload,
      });
      return;
    }

    if (info.file.status === 'done') {
      readFile(info.file.originFileObj!, onFileContentLoaded);
      return;
    }
  };

  return (
    <Upload onChange={onChange} showUploadList={false}>
      <Button icon={<UploadOutlined />}>{Labels.Action.Import}</Button>
    </Upload>
  );
};

export default ImportButton;
