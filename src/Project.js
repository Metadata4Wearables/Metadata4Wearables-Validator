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

const gitHubStates = {
  loading: "Loading",
  saving: "Saving",
};

const Project = ({ study, onLoad }) => {
  const [gitHubState, setGitHubState] = React.useState();
  const [githubMessage, setGithubMessage] = React.useState();
  const [githubUrl, setGithubUrl] = React.useState(null);

  const createHandleAuth = (callback) => (error, data) => {
    if (error) {
      console.log(error);
    } else {
      sessionStorage.setItem("gh-token", data.token);
      callback();
    }
  };

  const saveToGitHub = async () => {
    setGitHubState(gitHubStates.saving);

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
          content: btoa(objectToJson(study)),
          sha: sha,
        }
      );
      setGithubUrl(response.data.content.html_url);
      setGitHubState();
    } else {
      const authenticator = new netlify({ site_id: siteId });
      authenticator.authenticate(
        { provider: "github", scope: "user:email, repo" },
        createHandleAuth(saveToGitHub)
      );
    }
  };

  const handleLoadFromGithub = async () => {
    setGitHubState(gitHubStates.loading);

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
      setGitHubState();
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
      <div className="row" style={{ marginBottom: "1em" }}>
        <a
          className="btn btn-default"
          download={projectPath}
          href={objectUrl(study)}
        >
          <span className="glyphicon glyphicon-save" aria-hidden="true"></span>{" "}
          Download JSON
        </a>{" "}
        <button
          type="button"
          className="btn btn-default"
          onClick={handleLoadFromGithub}
          disabled={gitHubState}
        >
          <span
            className="glyphicon glyphicon-download"
            aria-hidden="true"
          ></span>{" "}
          {gitHubState === gitHubStates.loading
            ? gitHubState
            : "Load from GitHub"}
        </button>{" "}
        <button
          type="button"
          className="btn btn-default"
          onClick={saveToGitHub}
          disabled={gitHubState}
        >
          <span
            className="glyphicon glyphicon-upload"
            aria-hidden="true"
          ></span>{" "}
          {gitHubState === gitHubStates.saving ? gitHubState : "Save to GitHub"}
        </button>{" "}
        {githubUrl && (
          <a
            className="btn btn-default"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        )}
      </div>
      {githubMessage && (
        <div className="row">
          <p className="text-warning">GitHub status: {githubMessage}</p>
        </div>
      )}
      <div className="row">
        <JSONPretty json={study} />
      </div>
    </>
  );
};

export default Project;
