import { TableRow, TableHead, TableCell } from '@mui/material';

type PatientsTableHeadProps = {
  headLabel: Record<string, any>[];
};

export function PatientsTableHead({ headLabel }: PatientsTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
