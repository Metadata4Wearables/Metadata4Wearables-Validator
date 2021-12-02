import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import Study from "./Study";
import Participant from "./Participant";

const App = () => (
  <div className="container">
    <Router>
      <Nav />
      <div className="container-fluid">
        <Routes>
          <Route path="/study" element={<Study />} />
          <Route path="/participant" element={<Participant />} />
        </Routes>
      </div>
    </Router>
  </div>
);

export default App;
