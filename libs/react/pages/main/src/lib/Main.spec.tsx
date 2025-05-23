import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { MockedProvider } from '@apollo/client/testing';

import { ME_QUERY } from '@bookapp/shared/queries';
import { userWithTypename } from '@bookapp/testing/react';

import Main from './Main';

const userMock = {
  request: {
    query: ME_QUERY,
  },
  result: {
    data: {
      me: userWithTypename,
    },
  },
};

describe('Main', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider mocks={[userMock]}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
