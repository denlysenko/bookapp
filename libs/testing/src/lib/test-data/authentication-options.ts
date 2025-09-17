export const authenticationOptions = {
  challenge: 'challenge',
  rp: {
    name: 'BookApp',
  },
  user: {
    id: 'user-id',
    name: 'John Doe',
    displayName: 'John Doe',
  },
  pubKeyCredParams: [
    {
      type: 'public-key',
      alg: -7,
    },
  ],
  timeout: 60000,
  attestation: 'none',
};
