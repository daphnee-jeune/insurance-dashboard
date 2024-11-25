import type { TableRowProps } from '@mui/material/TableRow';
import { Box, TableRow, TableCell, Typography } from '@mui/material';

type TableNoDataProps = TableRowProps & {
  searchQuery: string;
  isTableEmpty: boolean;
};

export function TableNoData({ searchQuery, isTableEmpty }: TableNoDataProps) {
  const tableCopy = isTableEmpty
    ? "There are no patient records currently. Click on the 'New patient' button to create one!"
    : `No results found for '${searchQuery}'. Try typing a different entry.`;
  return (
    <TableRow>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 15, textAlign: 'center' }}>
          <Typography sx={{ mb: 1 }}>{tableCopy}</Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
