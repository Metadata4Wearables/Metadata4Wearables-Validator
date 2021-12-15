import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import Project from "./Project";
import Study from "./Study";
import Participants from "./Participants";
import Datasets from "./Datasets";
import Devices from "./Devices";
import React from "react";

const App = () => {
  const [project, setProject] = React.useState({
    study: { participants: [], datasets: [], devices: [] },
  });

  const handleProjectLoad = (project) => {
    setProject(project);
  };

  const handleSubmitStudy = (study) => {
    setProject({ ...project, study });
  };

  const handleSubmitParticipants = (participants) => {
    setProject({ ...project, study: { ...project.study, participants } });
  };

  const handleSubmitDatasets = (datasets) => {
    setProject({ ...project, study: { ...project.study, datasets } });
  };

  const handleSubmitDevices = (devices) => {
    setProject({ ...project, study: { ...project.study, devices } });
  };

  return (
    <div className="container">
      <Router>
        <Nav />
        <div className="container-fluid">
          <Routes>
            <Route
              path="/"
              element={<Project project={project} onLoad={handleProjectLoad} />}
            />
            <Route
              path="/study"
              element={<Study project={project} onSubmit={handleSubmitStudy} />}
            />
            <Route
              path="/participants"
              element={
                <Participants
                  project={project}
                  onSubmit={handleSubmitParticipants}
                />
              }
            />
            <Route
              path="/datasets"
              element={
                <Datasets project={project} onSubmit={handleSubmitDatasets} />
              }
            />
            <Route
              path="/devices"
              element={
                <Devices project={project} onSubmit={handleSubmitDevices} />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
