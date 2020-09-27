import React from 'react';
import { render } from '@testing-library/react';

import Main from './Main';

describe('Main', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Main />);
    expect(baseElement).toBeTruthy();
  });
});
