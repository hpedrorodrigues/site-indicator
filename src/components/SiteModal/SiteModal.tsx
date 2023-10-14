import React from 'react';
import { Form, Modal } from 'antd';
import { SiteForm, submitForm, INITIAL_SITE } from '../SiteForm';
import { Site } from '../../persistence';
import { Labels } from '../../labels';

type SiteModalProps = {
  onClose?: () => void;
  open?: boolean;
  onSave?: (_: Site) => void;
  initialSite?: Site;
};

const SiteModal = ({ onClose, open, onSave, initialSite }: SiteModalProps) => {
  const [form] = Form.useForm<Site>();
  return (
    <Modal
      centered
      title={
        initialSite === INITIAL_SITE
          ? Labels.Modal.Title.Add
          : Labels.Modal.Title.Edit
      }
      keyboard={false}
      open={open}
      maskClosable={false}
      destroyOnClose
      width={610}
      okText={Labels.Modal.Ok}
      cancelText={Labels.Modal.Cancel}
      onCancel={onClose}
      closeIcon={false}
      onOk={() => submitForm(form, onClose)}
    >
      <SiteForm form={form} onSubmit={onSave} initialSite={initialSite} />
    </Modal>
  );
};

export default SiteModal;
