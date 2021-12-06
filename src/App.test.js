import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("user can download after submitting a study with a valid name", async () => {
  global.URL.createObjectURL = jest.fn().mockReturnValue("https://example.com");

  render(<App />);

  const studyLink = screen.getByRole("link", { name: /study/i });
  userEvent.click(studyLink);

  const nameField = screen.getByRole("textbox", { name: /^name/i });
  userEvent.type(nameField, "Study Name");

  const clinicalTrial = screen.getByRole("radio", { name: /yes/i });
  userEvent.click(clinicalTrial);

  const clinicalTrialID = await screen.findByRole("textbox", {
    name: /clinical trial id/i,
  });
  userEvent.type(clinicalTrialID, "Clinical Trial ID");

  const ethicsInformation = screen.getByRole("textbox", {
    name: /ethics information/i,
  });
  userEvent.type(ethicsInformation, "Ethics Information");

  const sample = screen.getByRole("textbox", { name: /sample/i });
  userEvent.type(sample, "Sample");

  const description = screen.getByRole("textbox", { name: /^description/i });
  userEvent.type(description, "Description");

  const keywordsGroup = screen.getByRole("group", { name: /keywords/i });
  const keywordInputs = within(keywordsGroup).queryAllByRole("textbox");
  userEvent.type(keywordInputs[0], "Keyword 1");
  userEvent.type(keywordInputs[1], "Keyword 2");
  userEvent.type(keywordInputs[2], "Keyword 3");

  const groupName = screen.queryByRole("textbox", {
    name: /group name/i,
  });
  userEvent.type(groupName, "Group name");

  const groupDescription = screen.queryByRole("textbox", {
    name: /group description/i,
  });
  userEvent.type(groupDescription, "Group description");

  const groupLabel = screen.queryByRole("spinbutton", {
    name: /group label/i,
  });
  userEvent.type(groupLabel, "1");

  const groupSize = screen.queryByRole("spinbutton", {
    name: /group size/i,
  });
  userEvent.type(groupSize, "2");

  const groupInclusionCriteria = screen.getByRole("group", {
    name: /inclusion criteria/i,
  });
  const groupInclusionCriteriaInputs = within(
    groupInclusionCriteria
  ).queryAllByRole("textbox");
  userEvent.type(groupInclusionCriteriaInputs[0], "Inclusion criteria");

  const submitButton = screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitButton);

  const downloadLink = await screen.findByRole("link", { name: /download/i });
  expect(downloadLink).toBeInTheDocument();
});
