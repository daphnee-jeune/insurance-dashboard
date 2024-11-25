import { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Modal,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Toast from './Toast';

type Address = {
  street: string;
  address2?: string;
  state: string;
  city: string;
  zipcode: string;
  country: string;
};

export type ExtraField = {
  label: string;
  value: string;
};

export type FormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  address: Address;
  statuses: string[];
  extraFields?: ExtraField[];
};

type NewPatientFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const style = {
  m: 4,
  p: 4,
  height: '80vh',
  bgcolor: 'background.paper',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  borderRadius: '1.5rem'
};
const NewPatientForm = ({ open, setOpen }: NewPatientFormProps) => {
  const statusOptions = ['Inquiry', 'Onboarding', 'Active', 'Churned'];
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    address: {
      street: '',
      address2: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
    },
    statuses: [],
    extraFields: [],
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleClose = () => setOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
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

  const addExtraField = () => {
    setFormData((prev) => ({
      ...prev,
      extraFields: prev.extraFields && [...prev.extraFields, { label: '', value: '' }],
    }));
  };
  const handleExtraFieldChange = (index: number, field: keyof ExtraField, value: string) => {
    const updatedFields = formData.extraFields && [...formData.extraFields] || [];
    updatedFields[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      extraFields: updatedFields,
    }));
  };

  // database reference
  const dbref = collection(db, 'patientFormData');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(dbref, formData);
      setShowSuccessToast(true);
      // Reset form data
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        address: {
          street: '',
          address2: '',
          city: '',
          state: '',
          zipcode: '',
          country: '',
        },
        statuses: [],
        extraFields: [],
      });
    } catch (err) {
      setShowErrorToast(true);
      console.log('There was an error creating this patient record: ', err);
    }
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
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address 2"
                  name="address2"
                  value={formData.address.address2}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  name="zipcode"
                  value={formData.address.zipcode}
                  onChange={handleAddressChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
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
                {formData.extraFields?.map((field, index) => (
                  <Grid container spacing={1} key={index} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Label"
                        value={field.label}
                        onChange={(e) => handleExtraFieldChange(index, 'label', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Value"
                        value={field.value}
                        onChange={(e) => handleExtraFieldChange(index, 'value', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                ))}
                <IconButton color="primary" onClick={addExtraField}>
                  +
                </IconButton>
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
      {showSuccessToast && (
        <Toast
          open={showSuccessToast}
          handleClose={() => setShowSuccessToast(false)}
          copy="Patient record was successfully created!"
        />
      )}
      {showErrorToast && (
        <Toast
          open={showErrorToast}
          handleClose={() => setShowErrorToast(false)}
          copy="Patient record was not successfully created. Please try again!"
        />
      )}
    </div>
  );
};
export default NewPatientForm;
