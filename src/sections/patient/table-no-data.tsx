import type { TableRowProps } from '@mui/material/TableRow';
import { Box, TableRow, TableCell, Typography, Button } from '@mui/material';
import useFetchPatients from '../patient/view/useFetchPatients';

type EmptyTableProps = TableRowProps & {
  searchQuery: string;
  isTableEmpty: boolean;
};

const EmptyTable = ({ searchQuery, isTableEmpty }: EmptyTableProps) => {
  const { error, refetch } = useFetchPatients();
  const tableCopy = isTableEmpty
    ? "There are no patient records currently. Click on the 'New patient' button to create one!"
    : error ? `There was an error loading the data. Please try again!` : `No results found for '${searchQuery}'. Try typing a different entry.`;
  return (
    <TableRow>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 15, textAlign: 'center' }}>
          <Typography sx={{ mb: 1 }}>{tableCopy}</Typography>
        {error && <Button onClick={refetch}>Refetch</Button>}
        </Box>
      </TableCell>
    </TableRow>
  );
}
export default EmptyTable