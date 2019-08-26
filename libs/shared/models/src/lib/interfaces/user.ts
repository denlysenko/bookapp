export interface User {
  _id: any;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  roles: string[];
  createdAt: number;
  updatedAt: number;
  reading: Reading;
}

export interface Reading {
  epubUrl: string;
  bookmark?: string;
}
