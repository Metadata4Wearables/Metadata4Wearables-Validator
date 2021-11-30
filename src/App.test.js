import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders form with name field", () => {
  render(<App />);
  const nameField = screen.getByLabelText(/name/);
  expect(nameField).toBeInTheDocument();
});
