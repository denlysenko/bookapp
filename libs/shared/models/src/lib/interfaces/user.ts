export interface User {
  _id: any;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
  reading: {
    epubUrl: string;
    bookmark?: string;
  };
}
