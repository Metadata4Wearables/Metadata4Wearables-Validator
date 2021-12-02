import React from "react";
import Form from "@rjsf/core";
import GitHub from "github-api";
import JSONPretty from "react-json-prettify";
import netlify from "netlify-auth-providers";
import participantSchema from "./schema/participant.json";

delete participantSchema["$schema"];

const participantsSchema = {
  definitions: {
    participant: participantSchema,
    phenotype: participantSchema.definitions.phenotype,
  },
  type: "array",
  items: {
    $ref: "#/definitions/participant",
  },
};

const siteId = "fceaa58e-7e67-43cc-9414-51b611c12820";
const repoName = "dla-fair-data";
const branchName = "main";
const participantsPath = "participants.json";

const uiSchema = {};

const objectToJson = (object) => JSON.stringify(object, null, 2);

const objectUrl = (object) => {
  const blob = new Blob([objectToJson(object)], {
    type: "application/json",
  });
  return URL.createObjectURL(blob);
};

function Participants() {
  const [githubMessage, setGithubMessage] = React.useState();
  const [formData, setFormData] = React.useState();
  const [submitted, setSubmitted] = React.useState(false);
  const [githubUrl, setGithubUrl] = React.useState(null);

  const handleSubmit = ({ formData }, e) => {
    setSubmitted(true);
  };

  const handleError = (errors) => {};

  const handleChange = (event) => {
    const formData = event.formData;
    setFormData(formData);
  };

  const createHandleAuth = (callback) => (error, data) => {
    if (error) {
      console.log(error);
    } else {
      localStorage.setItem("gh-token", data.token);
      callback();
    }
  };

  const saveToGitHub = async () => {
    setGithubUrl("saving");

    const gitHubToken = localStorage.getItem("gh-token");
    if (gitHubToken) {
      const gitHub = new GitHub({ token: gitHubToken });
      const ghUser = gitHub.getUser();
      const userResponse = await ghUser.getProfile();
      const ghUsername = userResponse.data.login;

      let repo = gitHub.getRepo(ghUsername, repoName);
      try {
        await repo.getDetails();
      } catch (e) {
        await ghUser.createRepo({ name: repoName, private: true });
        repo = gitHub.getRepo(ghUsername, repoName);
      }

      const writeFileResponse = await repo.writeFile(
        branchName,
        participantsPath,
        objectToJson(formData),
        `Save ${participantsPath}`
      );

      setGithubUrl(writeFileResponse.data.content.html_url);
    } else {
      const authenticator = new netlify({ site_id: siteId });
      authenticator.authenticate(
        { provider: "github", scope: "user:email, repo" },
        createHandleAuth(saveToGitHub)
      );
    }
  };

  const saveToGitHubButton = () => {
    switch (githubUrl) {
      case null:
        return <button onClick={saveToGitHub}>Save to GitHub</button>;
      case "saving":
        return <p>Saving...</p>;
      default:
        return <a href={githubUrl}>View on GitHub</a>;
    }
  };

  const handleLoadFromGithub = async () => {
    const gitHubToken = localStorage.getItem("gh-token");
    if (gitHubToken) {
      const gitHub = new GitHub({ token: gitHubToken });
      const ghUser = gitHub.getUser();
      const userResponse = await ghUser.getProfile();
      const ghUsername = userResponse.data.login;

      let repo = gitHub.getRepo(ghUsername, repoName);
      try {
        await repo.getDetails();
        try {
          const contentsResponse = await repo.getContents(
            branchName,
            participantsPath,
            true
          );
          setFormData(contentsResponse.data);
        } catch (e) {
          setGithubMessage(
            `${participantsPath} file not found in GitHub repo: ${repoName}`
          );
        }
      } catch (e) {
        setGithubMessage(`GitHub repo not found: ${repoName}`);
      }
    } else {
      const authenticator = new netlify({ site_id: siteId });
      authenticator.authenticate(
        { provider: "github", scope: "user:email, repo" },
        createHandleAuth(handleLoadFromGithub)
      );
    }
  };

  if (!submitted) {
    return (
      <>
        <button onClick={handleLoadFromGithub}>Load from GitHub</button>
        <p>{githubMessage}</p>
        <Form
          noHtml5Validate
          schema={participantsSchema}
          formData={formData}
          uiSchema={uiSchema}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onError={handleError}
          showErrorList={false}
        />
      </>
    );
  } else {
    return (
      <>
        <JSONPretty json={formData} />
        <ul>
          <li>
            <a download={participantsPath} href={objectUrl(formData)}>
              Download
            </a>
          </li>
          <li>{saveToGitHubButton()}</li>
        </ul>
      </>
    );
  }
}

export default Participants;
