import { renderWithAllProviders } from './test-utils';
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('test-utils', () => {
  test('renderWithAllProviders renders children', () => {
    renderWithAllProviders(<div>hello</div>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
