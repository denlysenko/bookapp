import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).URL = {
  createObjectURL: () => 'url',
  revokeObjectURL: () => null,
};
