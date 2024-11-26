import { CircularProgress, Box } from '@mui/material';

const LoadingIndicator = () => (
  <Box sx={{ margin: '4', padding: 4, height: '20vh' }}>
    <CircularProgress
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 'auto',
      }}
    />
  </Box>
);

export default LoadingIndicator;
