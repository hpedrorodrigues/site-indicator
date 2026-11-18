import { Form, Modal } from 'antd';
import { SiteForm, submitForm } from '../SiteForm';
import type { Site } from '../../persistence';
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
      title={initialSite?.id ? Labels.Modal.Title.Edit : Labels.Modal.Title.Add}
      keyboard={false}
      open={open}
      mask={{ closable: false }}
      destroyOnHidden
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
