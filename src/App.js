import Nav from "./Nav";
import Study from "./Study";
import Participant from "./Participant";

const App = () => (
  <div className="container">
    <Nav />
    <div className="container-fluid">
      <Study />
      <Participant />
    </div>
  </div>
);

export default App;
