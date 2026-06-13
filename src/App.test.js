import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/helper', () => ({
  API_BASE_URL: 'http://localhost:9090',
}));

jest.mock('./services/user-service', () => ({
  login: jest.fn(),
  signUp: jest.fn(),
}));

test('renders home page heading', () => {
  render(<App />);
  expect(screen.getByText(/blog platform client/i)).toBeInTheDocument();
});
