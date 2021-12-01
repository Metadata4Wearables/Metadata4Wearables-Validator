import React from "react";
import Form from "@rjsf/core";
import GitHub from "github-api";
import netlify from "netlify-auth-providers";
import studySchema from "./study";
import md5 from "md5";

delete studySchema["$schema"];
delete studySchema.properties.prereg_doi;
delete studySchema.properties.sample_groups;
delete studySchema.properties.intervention;
delete studySchema.properties.contributors;

const uiSchema = {
  "ui:order": ["name", "clinical_trial", "clinical_trial_id", "*"],
  clinical_trial: {
    "ui:widget": "radio",
  },
  uuid: { "ui:readonly": true, "ui:widget": "hidden" },
};

const objectUrl = (object) => {
  const blob = new Blob([JSON.stringify(object)], {
    type: "application/json",
  });
  return URL.createObjectURL(blob);
};

function App() {
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

  const handleAuth = (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      // TODO: Should this be encrypted somehow?
      localStorage.setItem("gh-token", data.token);
      saveToGitHub();
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
      const repoName = "dla-fair-data";

      let repo = gitHub.getRepo(ghUsername, repoName);
      try {
        await repo.getDetails();
      } catch (e) {
        await ghUser.createRepo({ name: repoName, private: true });
        repo = gitHub.getRepo(ghUsername, repoName);
      }

      const writeFileResponse = await repo.writeFile(
        "main",
        "study.json",
        JSON.stringify(formData),
        "Save study.json"
      );

      setGithubUrl(writeFileResponse.data.content.html_url);
    } else {
      const authenticator = new netlify({
        site_id: "fceaa58e-7e67-43cc-9414-51b611c12820",
      });

      authenticator.authenticate(
        { provider: "github", scope: "user:email, repo" },
        handleAuth
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

  if (!submitted) {
    return (
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
    );
  } else {
    return (
      <ul>
        <li>
          <a download={"study.json"} href={objectUrl(formData)}>
            Download
          </a>
        </li>
        <li>{saveToGitHubButton()}</li>
      </ul>
    );
  }
}

export default App;
