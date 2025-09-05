export interface Passkey {
  id: string;
  label?: string;
  publicKey: Uint8Array;
  userId: string;
  credentialId: string;
  counter: number;
  deviceType: string;
  backedUp: boolean;
  transports?: string[];
  aaguid: string;
  lastUsedAt: number;
}
