import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("user can download after submitting a study with a valid name", async () => {
  global.URL.createObjectURL = jest.fn().mockReturnValue("https://example.com");

  render(<App />);
  const nameField = screen.getByLabelText(/name/);
  userEvent.type(nameField, "Study Name");
  const submitButton = screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitButton);

  const downloadLink = await screen.findByRole("link", { name: "Download" });
  expect(downloadLink).toBeInTheDocument();
});
