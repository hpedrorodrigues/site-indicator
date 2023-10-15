import React, { useState } from 'react';
import { Modal } from 'antd';
import SiteSelectionTable from './SiteSelectionTable';
import { Labels } from '../../labels';
import { Site } from '../../persistence';
import { isEmpty } from '../../util';

type SiteSelectionModalProps = {
  onClose?: () => void;
  open?: boolean;
  sites?: Site[];
  isLoading?: boolean;
  onSitesSelected?: (sites: Site[]) => void;
  okText?: string;
};

const SiteSelectionModal = ({
  open,
  onClose,
  sites,
  isLoading,
  onSitesSelected,
  okText,
}: SiteSelectionModalProps) => {
  const [selectedSiteIds, setSelectedSiteIds] = useState<number[]>([]);

  return (
    <Modal
      centered
      title={Labels.Selection.ModalTitle}
      keyboard={false}
      open={open}
      maskClosable={false}
      destroyOnClose
      width={700}
      okButtonProps={{ disabled: isEmpty(selectedSiteIds) }}
      okText={okText ?? Labels.Modal.Ok}
      cancelText={Labels.Modal.Cancel}
      closeIcon={false}
      onCancel={onClose}
      onOk={() => {
        onClose?.();
        if (onSitesSelected && sites) {
          onSitesSelected(
            sites.filter((site) => selectedSiteIds.includes(site.id!))
          );
        }
      }}
    >
      <SiteSelectionTable
        sites={sites}
        isLoading={isLoading}
        selectedSiteIds={selectedSiteIds}
        onSelectionChanged={setSelectedSiteIds}
      />
    </Modal>
  );
};

export default SiteSelectionModal;
