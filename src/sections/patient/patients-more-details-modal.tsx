import { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { PatientDetails } from './view/useFetchPatients';
import { db } from '../../firebase';

import Toast from '../../layouts/components/Toast';

const style = {
  m: 4,
  p: 4,
  height: '50vh',
  width: '50vw',
  margin: 'auto',
  bgcolor: 'background.paper',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
};

type MoreDetailsModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  row: PatientDetails;
};
const MoreDetailsModal = ({ open, setOpen, row }: MoreDetailsModalProps) => {
  const [isOnEditMode, setIsOnEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState<PatientDetails>(row);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleClose = () => setOpen(false);
  const {
    firstName,
    middleName,
    lastName,
    address: { street, address2, city, state, zipcode, country },
    extraFields,
  } = row;

  const displayButtons = () => {
    if (isOnEditMode) {
      return (
        <>
          <Button onClick={() => setIsOnEditMode(false)}>Cancel</Button>
          <Button onClick={updatePatientDetails}>Save</Button>
        </>
      );
    }
    return <Button onClick={() => setIsOnEditMode(true)}>Edit</Button>;
  };

  const handleFieldChange = (field: string, value: string, index?: number) => {
    if (field === 'extraFields' && index !== undefined) {
      setEditedRow((prev) => {
        const updatedExtraFields = [...(prev.extraFields || [])];
        updatedExtraFields[index] = value; // Update the specific field
        return { ...prev, extraFields: updatedExtraFields };
      });
    } else if (field.includes('.')) {
      const [parentField, childField] = field.split('.');

      setEditedRow((prev) => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [childField]: value,
        },
      }));
    } else {
      setEditedRow((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const updatePatientDetails = async () => {
    try {
      const docRef = doc(db, 'patientFormData', row.id);
      await updateDoc(docRef, { ...editedRow, id: docRef.id });
      setIsOnEditMode(false);
      setShowSuccessToast(true);
      handleClose();
    } catch (err) {
      setShowErrorToast(true);
      console.error('error updating patient record: ', err);
    }
  };
  const renderModalContent = () => {
    if (isOnEditMode) {
      return (
        <>
          <TextField
            label="First Name"
            value={editedRow.firstName}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Middle Name"
            value={editedRow.middleName}
            onChange={(e) => handleFieldChange('middleName', e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Last Name"
            value={editedRow.lastName}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Street"
            value={editedRow.address.street}
            onChange={(e) => handleFieldChange('address.street', e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Address Line 2"
            value={editedRow.address.address2}
            onChange={(e) => handleFieldChange('address.address2', e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="City"
            value={editedRow.address.city}
            onChange={(e) => handleFieldChange('address.city', e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="State"
            value={editedRow.address.state}
            onChange={(e) => handleFieldChange('address.state', e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Zipcode"
            value={editedRow.address.zipcode}
            onChange={(e) => handleFieldChange('address.zipcode', e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Country"
            value={editedRow.address.country}
            onChange={(e) => handleFieldChange('address.country', e.target.value)}
            fullWidth
            margin="dense"
          />
          {editedRow.extraFields?.map((field, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 1 }}
            >
              <TextField
                label="Field Label"
                value={field.label}
                onChange={(e) =>
                  handleFieldChange('extraFields', { ...field, label: e.target.value }, index)
                }
                fullWidth
                margin="dense"
              />
              <TextField
                label="Field Value"
                value={field.value}
                onChange={(e) =>
                  handleFieldChange('extraFields', { ...field, value: e.target.value }, index)
                }
                fullWidth
                margin="dense"
              />
            </Box>
          ))}
          <IconButton color="primary" onClick={addExtraField}>
            Add custom fields
          </IconButton>
        </>
      );
    }
    return (
      <>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {firstName} {middleName} {lastName}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {street} {address2} {city} {state} {zipcode} {country}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Most recent visit: 01/01/2020
        </Typography>
        {extraFields?.map((field) => (
          <Typography id="modal-modal-description" sx={{ mt: 2 }} key={field.label}>
            {field.label}: {field.value}
          </Typography>
        ))}
      </>
    );
  };

  const addExtraField = () => {
    setEditedRow((prev) => ({
      ...prev,
      extraFields: [...(prev.extraFields || []), { label: '', value: '' }],
    }));
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {renderModalContent()}
          {displayButtons()}
        </Box>
      </Modal>
      {showSuccessToast && (
        <Toast
          open={showSuccessToast}
          handleClose={() => setShowSuccessToast(false)}
          copy="Patient record was successfully updated!"
        />
      )}
      {showErrorToast && (
        <Toast
          open={showErrorToast}
          handleClose={() => setShowErrorToast(false)}
          copy="Patient record was not successfully updated. Please try again!"
        />
      )}
    </>
  );
};

export default MoreDetailsModal;
