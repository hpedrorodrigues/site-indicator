import React from 'react';
import { Button, notification, Upload, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Labels } from '../../labels';
import { Configuration, isConfiguration } from '../../persistence';
import { readFile, toJSON } from '../../util';

type ImportButtonProps = {
  onImport: (configuration: Configuration) => void;
};

const ImportButton = ({ onImport }: ImportButtonProps) => {
  const onFileContentLoaded = (content: string) => {
    console.debug('Importing file', content);
    const parsed = toJSON(content);
    if (isConfiguration(parsed)) {
      onImport(parsed);
    } else {
      notification.error({ message: Labels.Configuration.Errors.InvalidFile });
    }
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
