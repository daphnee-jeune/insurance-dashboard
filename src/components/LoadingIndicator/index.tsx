import { CircularProgress } from '@mui/material';

const LoadingIndicator = () => {
  return (
    <CircularProgress
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default LoadingIndicator;