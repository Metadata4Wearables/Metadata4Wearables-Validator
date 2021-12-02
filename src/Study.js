import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import GitHub from "github-api";
import netlify from "netlify-auth-providers";
import studySchema from "./schema/study.json";
import md5 from "md5";

delete studySchema["$schema"];
delete studySchema.properties.prereg_doi;
delete studySchema.properties.sample_groups;
delete studySchema.properties.intervention;
delete studySchema.properties.contributors;

const siteId = "fceaa58e-7e67-43cc-9414-51b611c12820";
const repoName = "dla-fair-data";
const branchName = "main";
const projectPath = "project.json";

const uiSchema = {
  "ui:order": ["name", "clinical_trial", "clinical_trial_id", "*"],
  clinical_trial: {
    "ui:widget": "radio",
  },
  uuid: { "ui:readonly": true, "ui:widget": "hidden" },
  keywords: { "ui:options": { orderable: false } },
};

function Study({ project, onSubmit }) {
  const [githubMessage, setGithubMessage] = React.useState();
  const [formData, setFormData] = React.useState(project.study);
  const navigate = useNavigate();

  const handleSubmit = ({ formData }, e) => {
    onSubmit(formData);
    navigate("/");
  };

  const handleError = (errors) => {};

  const handleChange = (event) => {
    const formData = event.formData;
    if (formData.name) formData.uuid = md5(formData.name);
    if (formData.clinical_trial === false) delete formData.clinical_trial_id;

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
          setFormData(contentsResponse.data.study);
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
        schema={studySchema}
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

export default Study;
