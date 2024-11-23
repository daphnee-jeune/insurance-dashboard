import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FormData } from '../../../layouts/components/new-patient-form';

export interface PatientDetails extends FormData {
  id: string;
}

const usePatients = () => {
  const [patientDetails, setPatientDetails] = useState<PatientDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch patient data
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    // Note: set success and error toasts
    try {
      const querySnapshot = await getDocs(collection(db, 'patientFormData'));

      const fetchedPatients: PatientDetails[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          firstName: data.firstName ?? '',
          middleName: data.middleName ?? '',
          lastName: data.lastName ?? '',
          dateOfBirth: data.dateOfBirth ?? '',
          address: {
            street: data.address?.street ?? '',
            address2: data.address?.address2 ?? '',
            state: data.address?.state ?? '',
            zipcode: data.address?.zipcode ?? '',
            country: data.address?.country ?? '',
          },
          statuses: Array.isArray(data.statuses) ? data.statuses : [],
          extraFields: Array.isArray(data.extraFields)
            ? data.extraFields.map((field: any) => ({
                label: field.label ?? '',
                value: field.value ?? '',
              }))
            : [],
        };
      });

      setPatientDetails(fetchedPatients);
    } catch (err) {
      setError('An unexpected error occurred while fetching patient details.');
      console.error('Error fetching patient data:', err);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patientDetails, loading, error, refetch: fetchPatients };
};

export default usePatients;
