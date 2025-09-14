import React from 'react';
import { render } from '@testing-library/react';
import Home from '../page';
import { redirect } from 'next/navigation';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Home component', () => {
  it('should redirect to the login page', () => {
    render(<Home />);
    expect(redirect).toHaveBeenCalledWith('/login');
  });
});
