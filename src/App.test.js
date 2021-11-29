import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hello text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Hello!/i);
  expect(linkElement).toBeInTheDocument();
});
