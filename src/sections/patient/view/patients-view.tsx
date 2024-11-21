import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { PatientsTableRow } from '../patients-table-row';
import { PatientsTableHead } from '../patients-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { PatientsTableToolbar } from '../patients-table-toolbar';

import NewPatientForm from '../../../layouts/components/new-patient-form';

import useFetchPatients from './useFetchPatients';



export function PatientsView() {
  const table = useTable();
  const { patientDetails, loading, error } = useFetchPatients();

  const [filterName, setFilterName] = useState('');
  const [open, setOpen] = useState(false);

  // Filter patients based on the filterName state
  const filteredPatients = patientDetails?.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(filterName.toLowerCase())
  );

  const notFound = !filteredPatients?.length && !!filterName;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Patients
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpen}
        >
          New patient
        </Button>
      </Box>
      {open && <NewPatientForm open={open} setOpen={setOpen} />}
      <Card>
        <PatientsTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <PatientsTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={patientDetails?.length || 0}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    patientDetails?.map((patient) => `${patient.firstName} ${patient.lastName}`) || []
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'address', label: 'Address' },
                  { id: 'dob', label: 'Date of birth' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {filteredPatients
                  ?.slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <PatientsTableRow
                      key={row.firstName + row.lastName}
                      row={row}
                      selected={table.selected.includes(
                        `${row.firstName} ${row.lastName}`
                      )}
                      onSelectRow={() =>
                        table.onSelectRow(`${row.firstName} ${row.lastName}`)
                      }
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={table.rowsPerPage - filteredPatients.length}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={filteredPatients?.length || 0}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}