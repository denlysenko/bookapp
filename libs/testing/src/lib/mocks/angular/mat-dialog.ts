import { of } from 'rxjs';

export const MockMatDialog = {
  open: jest.fn().mockImplementation(() => ({
    afterClosed: jest.fn().mockReturnValue(of('publicUrl'))
  }))
};
