import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import Study from "./Study";
import Participants from "./Participants";

const App = () => (
  <div className="container">
    <Router>
      <Nav />
      <div className="container-fluid">
        <Routes>
          <Route path="/study" element={<Study />} />
          <Route path="/participants" element={<Participants />} />
        </Routes>
      </div>
    </Router>
  </div>
);

export default App;
