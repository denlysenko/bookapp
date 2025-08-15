import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom/client';

import App from './app/app';

if (import.meta.env?.PROD) {
  Sentry.init({
    dsn: 'https://18aa211c4ac992f478a3c5e4622919f6@o4509826217738240.ingest.de.sentry.io/4509849271337040',
    sendDefaultPii: true,
  });
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
