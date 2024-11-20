import { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Modal, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

type NewPatientFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
const NewPatientForm = ({ open, setOpen }: NewPatientFormProps) => {
  const statusOptions = ["Inquiry", "Onboarding", "Active", "Churned"];
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    statuses: [],
  });
  const handleClose = () => setOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };
  const handleCheckboxChange = (status: string) => {
    setFormData((prev) => {
      const { statuses } = prev;
      const updatedStatuses = statuses.includes(status)
        ? statuses.filter((item) => item !== status) // Remove if already checked
        : [...statuses, status]; // Add if not checked
      return { ...prev, statuses: updatedStatuses };
    });
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5" gutterBottom>
            Patient registration form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Status
              </Typography>
              <FormGroup>
                {statusOptions.map((status) => (
                  <FormControlLabel
                    key={status}
                    control={
                      <Checkbox
                        checked={formData.statuses.includes(status)}
                        onChange={() => handleCheckboxChange(status)}
                      />
                    }
                    label={status}
                  />
                ))}
              </FormGroup>
            </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
export default NewPatientForm;
