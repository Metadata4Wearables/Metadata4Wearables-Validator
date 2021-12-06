import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import Project from "./Project";
import Study from "./Study";
import Participants from "./Participants";
import Datasets from "./Datasets";
import Events from "./Events";
import React from "react";

const App = () => {
  const [project, setProject] = React.useState({
    study: { participants: [], datasets: [] },
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

  const handleSubmitEvents = (index, events) => {
    setProject({
      ...project,
      study: {
        ...project.study,
        participants: [
          ...project.study.participants.slice(0, index),
          Object.assign({}, project.study.participants[index], {
            events: events,
          }),
          ...project.study.participants.slice(index + 1),
        ],
      },
    });
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
              path="/participants/:id/events"
              element={
                <Events project={project} onSubmit={handleSubmitEvents} />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
