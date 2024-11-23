import { useState } from 'react';
import { Popover, MenuList, MenuItem, menuItemClasses } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import MoreDetailsModal from './patients-more-details-modal';

type PatientPopoverMenuProps = {
  openPopover: HTMLButtonElement | null;
  handleClosePopover: () => void;
  handleEditRow: (row: any) => void;
  handleDeletePatientRecord: (id: string) => void;
  rowId: string;
};

const PatientsPopoverMenu = ({
  openPopover,
  handleClosePopover,
  handleEditRow,
  handleDeletePatientRecord,
  rowId,
}: PatientPopoverMenuProps) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  return (
    <Popover
      open={!!openPopover}
      anchorEl={openPopover}
      onClose={handleClosePopover}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuList
        disablePadding
        sx={{
          p: 0.5,
          gap: 0.5,
          width: 140,
          display: 'flex',
          flexDirection: 'column',
          [`& .${menuItemClasses.root}`]: {
            px: 1,
            gap: 2,
            borderRadius: 0.75,
            [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
          },
        }}
      >
        <MenuItem onClick={() => setShowMoreDetails(true)}>
          <Iconify icon="ic:baseline-add" />
          More details
        </MenuItem>
        <MenuItem onClick={handleEditRow}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeletePatientRecord(rowId)} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
      {showMoreDetails && <MoreDetailsModal open={showMoreDetails} setOpen={setShowMoreDetails}/>}
    </Popover>
  );
};

export default PatientsPopoverMenu;
