export const registrationResponse = {
  id: 'credential-id',
  rawId: 'credential-id',
  response: {
    attestationObject: 'attestation-object',
    clientDataJSON: 'client-data-json',
  },
  type: 'public-key' as const,
  clientExtensionResults: {},
  authenticatorAttachment: 'platform' as const,
};
