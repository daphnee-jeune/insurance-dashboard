import { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  Popover,
  TableRow,
  TableCell,
  Box,
  MenuList,
  MenuItem,
  Checkbox,
  IconButton,
} from '@mui/material';
import { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { PatientDetails } from './view/useFetchPatients';

import { db } from '../../firebase';

type PatientTableRowProps = {
  row: PatientDetails;
  selected: boolean;
  onSelectRow: () => void;
};

export function PatientsTableRow({ row, selected, onSelectRow }: PatientTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(row);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDeletePatientRecord = async (documentId: string) => {
    try {
      const docRef = doc(db, "patientFormData", documentId);
      await deleteDoc(docRef);
      setOpenPopover(null);
      console.log(`Document with ID: ${documentId} has been successfully deleted.`);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEditRow = () => {
    setIsInEditMode(true);
    handleClosePopover();
  };

  const handleSaveRow = async () => {
    try {
      const docRef = doc(db, 'patientFormData', row.id);
      await updateDoc(docRef, editedRow);
      setIsInEditMode(false);
      console.log('Patient record updated successfully');
    } catch (error) {
      console.error('Error updating record: ', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setEditedRow((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        {/* Editable fields for Name */}
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {isInEditMode ? (
              <>
                <TextField
                  value={editedRow.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  size="small"
                />
                <TextField
                  value={editedRow.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  size="small"
                />
              </>
            ) : (
              `${row.firstName} ${row.lastName}`
            )}
          </Box>
        </TableCell>

        {/* Editable Address */}
        <TableCell>
          {isInEditMode ? (
            <TextField
              fullWidth
              value={editedRow.address.street}
              onChange={(e) => handleChange('address.street', e.target.value)}
              size="small"
            />
          ) : (
            `${row.address.street}, ${row.address.state} ${row.address.zipcode} ${row.address.country}`
          )}
        </TableCell>

        {/* Editable DOB */}
        <TableCell>
          {isInEditMode ? (
            <TextField
              type="date"
              value={editedRow.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              size="small"
            />
          ) : (
            row.dateOfBirth
          )}
        </TableCell>

        {/* Status remains static */}
        <TableCell>
          <Label
            color={
              row.statuses.includes('Churned')
                ? 'error'
                : row.statuses.includes('Onboarding')
                ? 'warning'
                : row.statuses.includes('Inquiry')
                ? 'info'
                : 'success'
            }
          >
            {row.statuses.map((status) => status)}
          </Label>
        </TableCell>

        {/* Action buttons */}
        <TableCell align="right">
          {isInEditMode ? (
            <Button variant="contained" color="primary" onClick={handleSaveRow}>
              Save
            </Button>
          ) : (
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      {/* Popover Menu */}
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
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="ic:baseline-add" />
            More details
          </MenuItem>
          <MenuItem onClick={handleEditRow}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={() => handleDeletePatientRecord(row.id)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
