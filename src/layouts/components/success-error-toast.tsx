import { Snackbar, Alert } from '@mui/material';

type ToastProps = {
  open: boolean;
  handleClose: () => void;
  copy: string;
};
const Toast = ({ open, handleClose, copy }: ToastProps) => {
  const alertType = open ? 'success' : 'error';

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={5000}
      open={open}
      onClose={handleClose}
    >
      <Alert severity={alertType} variant="filled" sx={{ width: '100%' }} onClose={handleClose}>
        {copy}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
