import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { FormData } from '../layouts/components/new-patient-form';

export interface PatientDetails extends FormData {
  id: string;
}

const usePatients = () => {
  const [patientDetails, setPatientDetails] = useState<PatientDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleFetchPatientsData = useCallback((querySnapshot: any) => {
    const fetchedPatients: PatientDetails[] = querySnapshot.docs.map((doc: any) => {
      const data = doc.data();

      return {
        id: doc.id,
        firstName: data.firstName ?? '',
        middleName: data.middleName ?? '',
        lastName: data.lastName ?? '',
        dateOfBirth: data.dateOfBirth ?? '',
        address: {
          street: data.address?.street ?? '',
          city: data.address?.city ?? '',
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
  }, []);

  // fetch patients once
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const querySnapshot = await getDocs(collection(db, 'patientFormData'));
      handleFetchPatientsData(querySnapshot);
    } catch (err) {
      setError('An unexpected error occurred while fetching patient details.');
      console.error('Error fetching patient data:', err);
    } finally {
      setLoading(false);
    }
  }, [handleFetchPatientsData]);

  // detect state changes in real time
  useEffect(() => {
    setLoading(true);

    const unsubscribe = onSnapshot(
      collection(db, 'patientFormData'),
      (querySnapshot) => {
        handleFetchPatientsData(querySnapshot);
        setLoading(false);
      },
      (err) => {
        setError('An unexpected error occurred while listening for updates.');
        console.error('Error listening to real-time updates:', err);
        setLoading(false);
      }
    );

    // cleanup subscription on component unmount
    return () => unsubscribe();
  }, [handleFetchPatientsData]);

  return { patientDetails, loading, error, refetch: fetchPatients };
};

export default usePatients;
