import { Link, NavLink } from "react-router-dom";

function Nav() {
  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            Project
          </Link>
        </div>
        <div id="navbar">
          <ul className="nav navbar-nav">
            <li>
              <NavLink to="/study">Study</NavLink>
            </li>
            <li>
              <NavLink to="/participants">Participants</NavLink>
            </li>
            <li>
              <NavLink to="/datasets">Datasets</NavLink>
            </li>
            <li>
              <NavLink to="/devices">Devices</NavLink>
            </li>
            <li>
              <a href="https://dla-actigraphy.herokuapp.com/data-deposits/4">
                DLA Actigraphy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
