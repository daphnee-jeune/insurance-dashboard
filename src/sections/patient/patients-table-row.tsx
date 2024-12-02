import { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  TableRow,
  TableCell,
  Box,
  IconButton,
  Select,
  MenuItem as SelectMenuItem,
  Chip,
} from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { PatientDetails } from '../../hooks/useFetchPatients';

import Toast from '../../layouts/components/success-error-toast';
import { db } from '../../firebase';
import PatientPopoverMenu from './patients-popover-menu';

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
  const [currentAddressField, setCurrentAddressField] =
    useState<keyof PatientDetails['address']>('street');
  const addressFields: (keyof PatientDetails['address'])[] = ['street', 'city', 'state', 'zipcode'];

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

  const handleChange = (field: string, value: string | Record<string, any>) => {
    setEditedRow((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange =
    (field: keyof PatientDetails['address']) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditedRow((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: event.target.value,
        },
      }));
    };
  const handleNextEditableField = () => {
    const currentIndex = addressFields.indexOf(currentAddressField);
    const nextIndex = (currentIndex + 1) % addressFields.length;
    setCurrentAddressField(addressFields[nextIndex]);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
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
                  value={editedRow.middleName}
                  onChange={(e) => handleChange('middleName', e.target.value)}
                  size="small"
                />
                <TextField
                  value={editedRow.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  size="small"
                />
              </>
            ) : (
              `${editedRow.firstName} ${editedRow.middleName} ${editedRow.lastName}`
            )}
          </Box>
        </TableCell>
        {/* Editable Address */}
        <TableCell>
          {isInEditMode ? (
            <TableCell style={{ display: 'flex' }}>
              <TextField
                label={currentAddressField.charAt(0).toUpperCase() + currentAddressField.slice(1)}
                value={editedRow.address[currentAddressField]}
                onChange={handleAddressChange(currentAddressField)}
                size="small"
                fullWidth
              />
              <Button color="primary" onClick={handleNextEditableField}>
                Next
              </Button>
            </TableCell>
          ) : (
            `${editedRow.address.street} ${editedRow.address.city} ${editedRow.address.state} ${editedRow.address.zipcode} ${editedRow.address.country}`
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
            new Date(editedRow.dateOfBirth).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
              timeZone: 'UTC',
            })
          )}
        </TableCell>
        {/* Editable status field */}
        <TableCell>
          {isInEditMode ? (
            <Select
              value={editedRow.statuses} // Use the first value of `statuses` if it's an array
              onChange={(e) => handleChange('statuses', [e.target.value])}
              renderValue={(selectedStatus) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  <Chip label={selectedStatus} />
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
                editedRow.statuses.includes('Churned')
                  ? 'error'
                  : editedRow.statuses.includes('Onboarding')
                    ? 'warning'
                    : editedRow.statuses.includes('Inquiry')
                      ? 'info'
                      : 'success'
              }
            >
              {editedRow.statuses[0] || ''}
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
      <PatientPopoverMenu
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        handleEditRow={handleEditRow}
        handleDeletePatientRecord={() => handleDeletePatientRecord(row.id)}
        row={row}
      />
      {showSuccessToast && (
        <Toast
          open={showSuccessToast}
          handleClose={() => setShowSuccessToast(false)}
          copy={`Patient record was successfully ${action}!`}
        />
      )}
      {showErrorToast && (
        <Toast
          open={showErrorToast}
          handleClose={() => setShowErrorToast(false)}
          copy={`Patient record was not successfully ${action}. Please try again!`}
        />
      )}
    </>
  );
}
