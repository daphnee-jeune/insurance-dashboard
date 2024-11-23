import { Modal, Box, Typography } from '@mui/material';

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
}
const MoreDetailsModal = ({ open, setOpen }: MoreDetailsModalProps) => {
  const handleClose = () => setOpen(false);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
  );
};

export default MoreDetailsModal;
