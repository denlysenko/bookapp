import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useFooterStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      top: 'auto',
      bottom: 0,
      zIndex: theme.zIndex.modal + 1,
    },
    footer: {
      justifyContent: 'flex-end',
    },
  })
);
