import React from "react";
import JSONPretty from "react-json-prettify";
import { Octokit } from "@octokit/rest";
import netlify from "netlify-auth-providers";

const siteId = "fceaa58e-7e67-43cc-9414-51b611c12820";
const repoName = "dla-fair-data";
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
  const [loadingFromGitHub, setLoadingFromGitHub] = React.useState(false);

  const createHandleAuth = (callback) => (error, data) => {
    if (error) {
      console.log(error);
    } else {
      sessionStorage.setItem("gh-token", data.token);
      callback();
    }
  };

  const saveToGitHub = async () => {
    setGithubUrl("saving");

    const gitHubToken = sessionStorage.getItem("gh-token");
    if (gitHubToken) {
      const octokit = new Octokit({ auth: gitHubToken });
      const ghUser = await octokit.request("GET /user");
      const ghUsername = ghUser.data.login;

      try {
        await octokit.request("GET /repos/{owner}/{repo}", {
          owner: ghUsername,
          repo: repoName,
        });
      } catch (e) {
        await octokit.request("POST /user/repos", {
          name: repoName,
          private: true,
        });
      }

      let sha;
      try {
        const projectResponse = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          {
            owner: ghUsername,
            repo: repoName,
            path: projectPath,
          }
        );
        sha = projectResponse.data.sha;
      } catch (e) {}

      const response = await octokit.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          owner: ghUsername,
          repo: repoName,
          path: projectPath,
          message: `Save ${projectPath}`,
          content: btoa(objectToJson(project)),
          sha: sha,
        }
      );
      setGithubUrl(response.data.content.html_url);
    } else {
      const authenticator = new netlify({ site_id: siteId });
      authenticator.authenticate(
        { provider: "github", scope: "user:email, repo" },
        createHandleAuth(saveToGitHub)
      );
    }
  };

  const handleLoadFromGithub = async () => {
    setLoadingFromGitHub(true);
    setGithubMessage("Loading");

    const gitHubToken = sessionStorage.getItem("gh-token");
    if (gitHubToken) {
      const octokit = new Octokit({ auth: gitHubToken });
      const ghUser = await octokit.request("GET /user");
      const ghUsername = ghUser.data.login;

      try {
        await octokit.request("GET /repos/{owner}/{repo}", {
          owner: ghUsername,
          repo: repoName,
        });
        try {
          const projectResponse = await octokit.request(
            "GET /repos/{owner}/{repo}/contents/{path}",
            {
              owner: ghUsername,
              repo: repoName,
              path: projectPath,
            }
          );
          const project = JSON.parse(atob(projectResponse.data.content));
          onLoad(project);
        } catch (e) {
          setGithubMessage(
            `${projectPath} file not found in GitHub repo: ${repoName}`
          );
        }
      } catch (e) {
        setGithubMessage(`GitHub repo not found: ${repoName}`);
      }
      setLoadingFromGitHub(false);
      setGithubMessage();
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
          disabled={loadingFromGitHub}
        >
          <span
            className="glyphicon glyphicon-download"
            aria-hidden="true"
          ></span>{" "}
          Load from GitHub
        </button>{" "}
        {saveToGitHubButton()}
      </div>
      {githubMessage && (
        <div className="row">
          <p className="text-warning">GitHub status: {githubMessage}</p>
        </div>
      )}
    </>
  );
};

export default Project;
