import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledBookComments = styled(Box)(() => ({
  '& h4': {
    fontSize: '16px',
    margin: '15px 0',
    fontWeight: 500,
  },

  '& .MuiList-root': {
    fontSize: '14px',
    minHeight: '64px',
    maxHeight: '300px',
    height: 'auto',
    overflow: 'auto',
  },

  '& .author': {
    fontWeight: 500,
  },

  '& .metadata': {
    display: 'inline-block',
    marginLeft: '0.5em',
    color: 'light-dark(rgba(0, 0, 0, 0.4), rgb(226, 226, 226))',
    fontSize: '0.875em',
  },

  '& .text': {
    margin: '0.25em 0 0.5em',
    fontSize: '14px',
    wordWrap: 'break-word',
    color: 'light-dark(rgba(0, 0, 0, 0.4), rgb(226, 226, 226))',
    lineHeight: 1.3,
  },

  '& .MuiFormControl-root': {
    width: '100%',
    paddingBottom: '1.34375em',
  },

  '& .MuiCardActions-root': {
    padding: '8px 0',
    justifyContent: 'flex-end',
  },
}));
