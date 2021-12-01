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
            <li className="active">
              <a href="/">Study</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
