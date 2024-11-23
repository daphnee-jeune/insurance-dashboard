import { Modal, Box, Typography, Grid } from '@mui/material';
import { PatientDetails } from './view/useFetchPatients';

const style = {
  m: 4,
  p: 4,
  height: '80vh',
  bgcolor: 'background.paper',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  overflowY: 'auto',
};

type MoreDetailsModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  row: PatientDetails;
};
const MoreDetailsModal = ({ open, setOpen, row }: MoreDetailsModalProps) => {
  const handleClose = () => setOpen(false);
  const {
    firstName,
    middleName,
    lastName,
    address: { street, address2, city, state, zipcode, country },
    extraFields: [{ label, value }],
  } = row;
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Name: {firstName} {middleName} {lastName}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Address: {street} {address2} {city} {state} {zipcode} {country}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {label}: {value}
        </Typography>
      </Box>
    </Modal>
  );
};

export default MoreDetailsModal;
