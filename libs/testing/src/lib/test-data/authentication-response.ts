export const authenticationResponse = {
  id: 'credential-id',
  rawId: 'credential-id',
  response: {
    authenticatorData: 'authenticator-data',
    clientDataJSON: 'client-data-json',
    signature: 'signature',
    userHandle: 'user-handle',
  },
  type: 'public-key' as const,
  clientExtensionResults: {},
  authenticatorAttachment: 'platform' as const,
};
