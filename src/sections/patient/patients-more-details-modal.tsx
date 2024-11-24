import { useState } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { PatientDetails } from './view/useFetchPatients';

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
          <Button onClick={() => handleClose()}>Save</Button>
        </>
      );
    }
    return <Button onClick={() => setIsOnEditMode(true)}>Edit</Button>;
  };
  const renderModalContent = () => {
    if (isOnEditMode) {
      return (
        <>
          <TextField label="First Name" value={firstName} fullWidth margin="dense" />
          <TextField label="Middle Name" value={middleName} fullWidth margin="dense" />
          <TextField label="Last Name" value={lastName} fullWidth margin="dense" />
          <TextField label="Street" value={street} fullWidth margin="dense" />
          <TextField label="Address Line 2" value={address2} fullWidth margin="dense" />
          <TextField label="City" value={city} fullWidth margin="dense" />
          <TextField label="State" value={state} fullWidth margin="dense" />
          <TextField label="Zipcode" value={zipcode} fullWidth margin="dense" />
          <TextField label="Country" value={country} fullWidth margin="dense" />
          {extraFields?.map((field) => (
            <TextField label={field.label} value={field.value} fullWidth margin="dense" />
          ))}
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

  return (
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
  );
};

export default MoreDetailsModal;
