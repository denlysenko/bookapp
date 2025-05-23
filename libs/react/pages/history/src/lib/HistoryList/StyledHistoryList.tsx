import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';

export const StyledHistoryList = styled(Table)(({ theme }) => ({
  '& .MuiTableRow-head': {
    height: 56,
  },

  '& .MuiTableCell-head': {
    fontSize: '12px',
    color: 'rgba(0, 0, 0, 0.54)',
  },

  '& .MuiTableCell-sizeSmall': {
    paddingTop: '3px',
    paddingBottom: '3px',
  },

  '& a': {
    textDecoration: 'underline',
  },

  '& .MuiTablePagination-root': {
    zIndex: `${theme.zIndex.modal + 1} !important`,
  },
}));
