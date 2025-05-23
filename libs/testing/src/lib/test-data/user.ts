export const user = {
  firstName: '',
  lastName: '',
  email: 'test@test.com',
  id: 'id',
  roles: ['user'],
  displayName: '',
  avatar: null,
  avatarUrl: null,
  createdAt: 1563132857195,
  updatedAt: null,
  reading: {
    bookmark: '',
    epubUrl: '',
  },
};

export const userWithTypename = {
  ...user,
  displayName: 'Test User',
  __typename: 'User',
  reading: { ...user.reading, __typename: 'Reading' },
};
