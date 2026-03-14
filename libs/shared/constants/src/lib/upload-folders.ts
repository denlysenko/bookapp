export const UPLOAD_FOLDERS = {
  AVATARS: 'avatars',
  COVERS: 'covers',
  BOOKS: 'books',
} as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[keyof typeof UPLOAD_FOLDERS];
