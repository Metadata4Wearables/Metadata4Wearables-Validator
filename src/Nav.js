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
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
