import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">
            Project name
          </a>
        </div>
        <div id="navbar">
          <ul className="nav navbar-nav">
            <li>
              <NavLink to="/study">Study</NavLink>
            </li>
            <li>
              <NavLink to="/participant">Participant</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
