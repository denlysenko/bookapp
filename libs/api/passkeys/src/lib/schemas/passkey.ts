import { ModelNames } from '@bookapp/api/shared';

import { Schema } from 'mongoose';

import { PasskeyModel } from '../interfaces/passkey';

export const PasskeySchema = new Schema<PasskeyModel>(
  {
    label: String,
    publicKey: {
      type: Buffer,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    credentialId: {
      type: String,
      unique: true,
      required: true,
    },
    webauthnUserID: {
      type: String,
      required: true,
    },
    counter: {
      type: Number,
      default: 0,
    },
    deviceType: String,
    backedUp: Boolean,
    transports: [String],
    aaguid: String,
    lastUsedAt: Date,
  },
  { timestamps: true }
);

PasskeySchema.virtual('user', {
  ref: ModelNames.USER,
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

PasskeySchema.set('toJSON', { virtuals: true });
PasskeySchema.set('toObject', { virtuals: true });
