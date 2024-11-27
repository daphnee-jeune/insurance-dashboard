import { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, Divider, Grid } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { PatientDetails } from '../../hooks/useFetchPatients';
import { db } from '../../firebase';
import { ExtraField } from '../../layouts/components/new-patient-form';

import Toast from '../../layouts/components/Toast';

const style = {
  p: 4,
  height: '50vh',
  width: '50vw',
  margin: 'auto',
  marginTop: '10vh',
  bgcolor: 'background.paper',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  borderRadius: '1.5rem',
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

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

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
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="contained" color="error" onClick={() => setIsOnEditMode(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={updatePatientDetails}>
              Save
            </Button>
          </Box>
        </Grid>
      );
    }
    return (
      <Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button onClick={() => setIsOnEditMode(true)}>Edit</Button>
        </Box>
      </Grid>
    );
  };

  const handleFieldChange = (field: string, value: string | ExtraField, index?: number) => {
    if (field === 'extraFields' && index !== undefined) {
      // ExtraFields
      setEditedRow((prev) => {
        const updatedExtraFields = [...(prev.extraFields || [])];
        if (typeof value === 'object' && 'label' in value && 'value' in value) {
          updatedExtraFields[index] = value; // update entire ExtraField object
        }
        return { ...prev, extraFields: updatedExtraFields };
      });
    } else if (field.includes('.')) {
      // Nested field updates
      const [parentField, childField] = field.split('.');

      setEditedRow((prev) => ({
        ...prev,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        [parentField]: {
          ...(prev[parentField] || {}), // Ensure the parent field exists
          [childField]: value,
        },
      }));
    } else {
      // Non nested field updates
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
      setShowSuccessToast(true);
      setIsOnEditMode(false);
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
          <Grid>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="primary" onClick={addExtraField}>
                Add more information
              </Button>
            </Box>
          </Grid>
        </>
      );
    }
    return (
      <>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Blood type: {bloodTypes[Math.floor(Math.random() * (bloodTypes.length - 1))]}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Address: {street} {address2} {city} {state} {zipcode} {country}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 1.7 }}>
              {firstName} {middleName} {lastName}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {Math.floor(Math.random() / 2) ? 'Male' : 'Female'}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Age: {Math.floor(Math.random() * 50)}
            </Typography>
          </Box>
          <Divider flexItem />
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
