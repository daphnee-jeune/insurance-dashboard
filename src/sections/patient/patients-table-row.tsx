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
  Snackbar,
  Alert,
  Select,
  MenuItem as SelectMenuItem,
  Chip,
} from '@mui/material';
import { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
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
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [action, setAction] = useState('');

  const statusesOptions = ['Churned', 'Onboarding', 'Inquiry', 'Active'];

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDeletePatientRecord = async (documentId: string) => {
    try {
      const docRef = doc(db, 'patientFormData', documentId);
      await deleteDoc(docRef);
      setOpenPopover(null);
      setAction('deleted');
      setShowSuccessToast(true);
    } catch (error) {
      setAction('deleted');
      setShowErrorToast(true);
    }
  };

  const handleEditRow = () => {
    setIsInEditMode(true);
    handleClosePopover();
  };

  const handleSaveRow = async () => {
    try {
      const docRef = doc(db, 'patientFormData', row.id);
      await updateDoc(docRef, { ...editedRow, id: docRef.id });
      setAction('updated');
      setIsInEditMode(false);
      setShowSuccessToast(true);
    } catch (error) {
      setAction('updated');
      setShowErrorToast(true);
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
            <>
              <TextField
                fullWidth
                value={editedRow.address.street}
                onChange={(e) => handleChange('address.street', e.target.value)}
                size="small"
              />
              <TextField
                fullWidth
                value={editedRow.address.state}
                onChange={(e) => handleChange('address.state', e.target.value)}
                size="small"
              />
              <TextField
                fullWidth
                value={editedRow.address.zipcode}
                onChange={(e) => handleChange('address.zipcode', e.target.value)}
                size="small"
              />
              <TextField
                fullWidth
                value={editedRow.address.country}
                onChange={(e) => handleChange('address.country', e.target.value)}
                size="small"
              />
            </>
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

        {/* Editable status field */}
        <TableCell>
          {isInEditMode ? (
            <Select
              multiple
              value={editedRow.statuses}
              onChange={(e) => handleChange('statuses', e.target.value)}
              renderValue={(selectedStatus) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedStatus.map((value: string) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              size="small"
              fullWidth
            >
              {statusesOptions.map((status) => (
                <SelectMenuItem key={status} value={status}>
                  {status}
                </SelectMenuItem>
              ))}
            </Select>
          ) : (
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
              {row.statuses.map((status) => status).join(', ')}
            </Label>
          )}
        </TableCell>

        {/* Action buttons */}
        <TableCell align="right">
          {isInEditMode ? (
            <div className="edit-button-container">
              <Button
                variant="contained"
                color="error"
                onClick={() => setIsInEditMode(false)}
                style={{ marginRight: '10px' }}
              >
                X
              </Button>
              <Button variant="contained" color="primary" onClick={handleSaveRow}>
                Save
              </Button>
            </div>
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
      {showSuccessToast && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={5000}
          open={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
        >
          <Alert
            onClose={() => setShowSuccessToast(false)}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {`Patient record was successfully ${action}!`}
          </Alert>
        </Snackbar>
      )}
      {showErrorToast && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={5000}
          open={showErrorToast}
          onClose={() => setShowErrorToast(false)}
        >
          <Alert
            onClose={() => setShowErrorToast(false)}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {`Patient record was not successfully ${action}. Please try again!`}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
