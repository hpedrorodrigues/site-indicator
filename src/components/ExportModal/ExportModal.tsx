import React, { useState } from 'react';
import { Modal } from 'antd';
import ExportTable from './ExportTable';
import { Labels } from '../../labels';
import { Site } from '../../persistence';
import { isEmpty } from '../../util';

type ExportModalProps = {
  onClose?: () => void;
  open?: boolean;
  sites?: Site[];
  isLoading?: boolean;
  onExport?: (sites: Site[]) => void;
};

const ExportModal = ({
  open,
  onClose,
  sites,
  isLoading,
  onExport,
}: ExportModalProps) => {
  const [selectedSiteIds, setSelectedSiteIds] = useState<number[]>([]);

  return (
    <Modal
      centered
      title={Labels.Export.ModalTitle}
      keyboard={false}
      open={open}
      maskClosable={false}
      destroyOnClose
      width={700}
      okButtonProps={{ disabled: isEmpty(selectedSiteIds) }}
      okText={Labels.Action.Export}
      cancelText={Labels.Modal.Cancel}
      closeIcon={false}
      onCancel={onClose}
      onOk={() => {
        onClose?.();
        if (onExport && sites) {
          onExport(sites.filter((site) => selectedSiteIds.includes(site.id!)));
        }
      }}
    >
      <ExportTable
        sites={sites}
        isLoading={isLoading}
        selectedSiteIds={selectedSiteIds}
        onSelectionChanged={setSelectedSiteIds}
      />
    </Modal>
  );
};

export default ExportModal;
