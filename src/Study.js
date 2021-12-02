import React from "react";
import Form from "@rjsf/core";
import GitHub from "github-api";
import JSONPretty from "react-json-prettify";
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
const studyPath = "study.json";

const uiSchema = {
  "ui:order": ["name", "clinical_trial", "clinical_trial_id", "*"],
  clinical_trial: {
    "ui:widget": "radio",
  },
  uuid: { "ui:readonly": true, "ui:widget": "hidden" },
  keywords: { "ui:options": { orderable: false } },
};

const objectToJson = (object) => JSON.stringify(object, null, 2);

const objectUrl = (object) => {
  const blob = new Blob([objectToJson(object)], {
    type: "application/json",
  });
  return URL.createObjectURL(blob);
};

function Study() {
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
        studyPath,
        objectToJson(formData),
        `Save ${studyPath}`
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
            studyPath,
            true
          );
          setFormData(contentsResponse.data);
        } catch (e) {
          setGithubMessage(
            `${studyPath} file not found in GitHub repo: ${repoName}`
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
  } else {
    return (
      <>
        <JSONPretty json={formData} />
        <ul>
          <li>
            <a download={studyPath} href={objectUrl(formData)}>
              Download
            </a>
          </li>
          <li>{saveToGitHubButton()}</li>
        </ul>
      </>
    );
  }
}

export default Study;
