import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("user can download after submitting a study with a valid name", async () => {
  global.URL.createObjectURL = jest.fn().mockReturnValue("https://example.com");

  render(<App />);
  const nameField = screen.getByLabelText(/name/i);
  userEvent.type(nameField, "Study Name");

  const clinicalTrial = screen.getByRole("radio", { name: /yes/i });
  userEvent.click(clinicalTrial);

  const clinicalTrialID = await screen.findByLabelText(/clinical trial id/i);
  userEvent.type(clinicalTrialID, "Clinical Trial ID");

  const ethicsInformation = screen.getByLabelText(/ethics information/i);
  userEvent.type(ethicsInformation, "Ethics Information");

  const sample = screen.getByLabelText(/sample/i);
  userEvent.type(sample, "Sample");

  const description = screen.getByLabelText(/description/i);
  userEvent.type(description, "Description");

  const keywordsGroup = screen.getByRole("group", { name: /keywords/i });
  const keywordInputs = within(keywordsGroup).queryAllByRole("textbox");
  userEvent.type(keywordInputs[0], "Keyword 1");
  userEvent.type(keywordInputs[1], "Keyword 2");
  userEvent.type(keywordInputs[2], "Keyword 3");

  const submitButton = screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitButton);

  const downloadLink = await screen.findByRole("link", { name: "Download" });
  expect(downloadLink).toBeInTheDocument();
});
