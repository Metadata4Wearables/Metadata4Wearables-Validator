import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import Project from "./Project";
import Study from "./Study";
import Participants from "./Participants";
import Datasets from "./Datasets";
import Devices from "./Devices";
import Validate from "./Validate";
import React from "react";

const App = () => {
  const [study, setStudy] = React.useState({
    participants: [],
    datasets: [],
    devices: [],
  });

  const handleStudyLoad = (study) => {
    setStudy(study);
  };

  const handleSubmitStudy = (study) => {
    setStudy({ ...study });
  };

  const handleSubmitParticipants = (participants) => {
    setStudy({ ...study, participants });
  };

  const handleSubmitDatasets = (datasets) => {
    setStudy({ ...study, datasets });
  };

  const handleSubmitDevices = (devices) => {
    setStudy({ ...study, devices });
  };

  return (
    <div className="container">
      <Router>
        <Nav />
        <div className="container-fluid">
          <Routes>
            <Route
              path="/"
              element={<Project study={study} onLoad={handleStudyLoad} />}
            />
            <Route
              path="/study"
              element={<Study study={study} onSubmit={handleSubmitStudy} />}
            />
            <Route
              path="/participants"
              element={
                <Participants
                  study={study}
                  onSubmit={handleSubmitParticipants}
                />
              }
            />
            <Route
              path="/datasets"
              element={
                <Datasets study={study} onSubmit={handleSubmitDatasets} />
              }
            />
            <Route
              path="/devices"
              element={<Devices study={study} onSubmit={handleSubmitDevices} />}
            />
            <Route path="/validate" element={<Validate study={study} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
