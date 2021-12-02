import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import Project from "./Project";
import Study from "./Study";
import Participants from "./Participants";
import React from "react";

const App = () => {
  const [project, setProject] = React.useState({ study: { participants: [] } });

  const handleProjectLoad = (project) => {
    setProject(project);
  };

  const handleSubmitStudy = (study) => {
    setProject({ ...project, study });
  };

  const handleSubmitParticipants = (participants) => {
    setProject({ ...project, study: { ...project.study, participants } });
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
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
