import { Snackbar, Alert } from '@mui/material';

type ToastProps = {
  open: boolean;
  handleClose: () => void;
  copy: string;
  action: string;
}
const Toast = ({ open, handleClose, copy, action }: ToastProps) => {
  const alertType = action === 'updated' ? 'success' : 'error';
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
