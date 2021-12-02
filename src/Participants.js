import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import GitHub from "github-api";
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
const projectPath = "project.json";

const uiSchema = {
  "ui:options": { orderable: false },
  items: { phenotypes: { "ui:options": { orderable: false } } },
};

function Participants({ project, onSubmit }) {
  const [githubMessage, setGithubMessage] = React.useState();
  const [formData, setFormData] = React.useState(project.study.participants);
  const navigate = useNavigate();

  const handleSubmit = ({ formData }, e) => {
    onSubmit(formData);
    navigate("/");
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
            projectPath,
            true
          );
          setFormData(contentsResponse.data.study.participants);
        } catch (e) {
          setGithubMessage(
            `${projectPath} file not found in GitHub repo: ${repoName}`
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
}

export default Participants;
