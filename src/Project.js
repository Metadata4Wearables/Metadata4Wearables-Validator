import React from "react";
import JSONPretty from "react-json-prettify";
import GitHub from "github-api";
import netlify from "netlify-auth-providers";

const siteId = "fceaa58e-7e67-43cc-9414-51b611c12820";
const repoName = "dla-fair-data";
const branchName = "main";
const projectPath = "project.json";

const objectToJson = (object) => JSON.stringify(object, null, 2);

const objectUrl = (object) => {
  const blob = new Blob([objectToJson(object)], {
    type: "application/json",
  });
  return URL.createObjectURL(blob);
};

const Project = ({ project, onLoad }) => {
  const [githubMessage, setGithubMessage] = React.useState();
  const [githubUrl, setGithubUrl] = React.useState(null);

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
        projectPath,
        objectToJson(project),
        `Save ${projectPath}`
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
          onLoad(contentsResponse.data);
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

  const saveToGitHubButton = () => {
    switch (githubUrl) {
      case null:
        return (
          <button
            type="button"
            className="btn btn-default"
            onClick={saveToGitHub}
          >
            <span
              className="glyphicon glyphicon-upload"
              aria-hidden="true"
            ></span>{" "}
            Save to GitHub
          </button>
        );
      case "saving":
        return <p>Saving...</p>;
      default:
        return (
          <a href={githubUrl} target="_blank" rel="noreferrer">
            View on GitHub
          </a>
        );
    }
  };

  return (
    <>
      <div className="row">
        <JSONPretty json={project} />
      </div>
      <div className="row">
        <p className="text-right">
          <a download={projectPath} href={objectUrl(project)}>
            Download JSON
          </a>
        </p>
      </div>
      <div className="row">
        <button
          type="button"
          className="btn btn-default"
          onClick={handleLoadFromGithub}
        >
          <span
            className="glyphicon glyphicon-download"
            aria-hidden="true"
          ></span>{" "}
          Load from GitHub
        </button>{" "}
        {saveToGitHubButton()}
      </div>
      <div className="row">
        <p className="text-warning">{githubMessage}</p>
      </div>
    </>
  );
};

export default Project;
