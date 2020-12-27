import { makeStyles } from '@material-ui/core/styles';

export const useBookCommentsStyles = makeStyles({
  root: {
    '& h4': {
      fontSize: 16,
      margin: '15px 0',
      fontWeight: 500,
    },

    '& .MuiList-root': {
      fontSize: 14,
      minHeight: 64,
      maxHeight: 300,
      height: 'auto',
      overflow: 'auto',
      background: '#eef1f7',
    },

    '& .author': {
      fontWeight: 500,
    },

    '& .metadata': {
      display: 'inline-block',
      marginLeft: '0.5em',
      color: 'rgba(0, 0, 0, 0.4)',
      fontSize: '0.875em',
    },

    '& .text': {
      margin: '0.25em 0 0.5em',
      fontSize: 14,
      wordWrap: 'break-word',
      color: 'rgba(0, 0, 0, 0.87)',
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
  },
});
