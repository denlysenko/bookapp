export const accessToken = 'accessToken';
export const refreshToken = 'refreshToken';

export const MockAuthTokensService = {
  createAccessToken: jest.fn().mockReturnValue(accessToken),
  createRefreshToken: jest.fn().mockImplementation(() => Promise.resolve(refreshToken)),
  removeRefreshToken: jest.fn().mockImplementation(() => Promise.resolve(true)),
  revokeUserTokens: jest.fn().mockResolvedValue(true),
  refreshTokens: jest.fn(),
};
