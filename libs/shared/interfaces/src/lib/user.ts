export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  avatar?: string;
  roles: string[];
  createdAt: number;
  updatedAt: number;
  reading: Reading;
}

export interface Reading {
  epubUrl: string;
  bookmark?: string;
}
