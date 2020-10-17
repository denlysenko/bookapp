import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { InMemoryCache } from '@apollo/client/core';
import { MockedProvider } from '@apollo/client/testing';

import { FeedbackProvider } from '@bookapp/react/ui';
import { ME_QUERY, UPDATE_USER_MUTATION } from '@bookapp/shared/queries';
import { user } from '@bookapp/testing';

import Profile, { PROFILE_UPDATE_SUCCESS } from './Profile';

const createCache = () => {
  const cache = new InMemoryCache();
  cache.writeQuery({
    query: ME_QUERY,
    data: {
      me: { ...user, __typename: 'User' },
    },
  });

  return cache;
};

const firstName = 'Tim';
const lastName = 'Apple';

const success = {
  request: {
    query: UPDATE_USER_MUTATION,
    variables: {
      id: user._id,
      user: {
        email: user.email,
        firstName,
        lastName,
      },
    },
  },
  result: {
    data: {
      updateUser: {
        ...user,
        firstName,
        lastName,
      },
    },
  },
};

describe('Profile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <FeedbackProvider>
        <MockedProvider mocks={[]} cache={createCache()}>
          <Profile />
        </MockedProvider>
      </FeedbackProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  describe('submitForm', () => {
    it('should update profile', async () => {
      const { container } = render(
        <FeedbackProvider>
          <MockedProvider mocks={[success]} cache={createCache()}>
            <Profile />
          </MockedProvider>
        </FeedbackProvider>
      );

      fireEvent.change(container.querySelector('[name=firstName]'), {
        target: {
          value: firstName,
        },
      });

      fireEvent.change(container.querySelector('[name=lastName]'), {
        target: {
          value: lastName,
        },
      });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      expect(await screen.findByText(PROFILE_UPDATE_SUCCESS)).toBeInTheDocument();
    });
  });
});
