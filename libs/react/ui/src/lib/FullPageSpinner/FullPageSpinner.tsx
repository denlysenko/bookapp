import { CSSProperties } from 'react';

const styles: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  textAlign: 'center',
  background: 'rgba(0, 0, 0, 0.1)',
  zIndex: 111,
};

export const FullPageSpinner = () => (
  <div style={styles}>
    <img src="/images/loader.gif" alt="loader" />
  </div>
);

export default FullPageSpinner;
