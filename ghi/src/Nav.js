import { NavLink } from "react-router-dom";
import { useGetTokenQuery, useLogoutMutation } from "./app/apiSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stupify from "./logo-image/StupifyBlack.png";

function NavBar() {
  const { data: account } = useGetTokenQuery();
  const [logout, logoutResponse] = useLogoutMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (logoutResponse.data) {
      navigate(`${"homepage"}`);
    }
  }, [logoutResponse]);

  const handleRefresh = () => {
    navigate(0);
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary"
      data-bs-theme="dark"
    >
      <div className="container-fluid navbar-nav me-auto mb-2 mb-lg-0">
        <NavLink to={"homepage"} className="navbar-brand">
          <img src={Stupify} height="85px" width="85px"></img>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {account && (
              <li className="nav-item">
                <NavLink to={"allplaylist"} className={"nav-link"}>
                  PlayList
                </NavLink>
              </li>
            )}

            {account && (
              <li className="nav-item">
                <NavLink
                  to={"search"}
                  className={"nav-link"}
                  onSubmit={handleRefresh}
                >
                  Search
                </NavLink>
              </li>
            )}
            {account && (
              <li className="nav-item">
                <NavLink to={"/spotify/allgenres"} className={"nav-link"}>
                  Genres
                </NavLink>
              </li>
            )}
            {account && (
              <li className="nav-item">
                <NavLink to={"/spotify/recommendations"} className={"nav-link"}>
                  Recommendations
                </NavLink>
              </li>
            )}
            {account && (
              <li className="nav-item">
                <NavLink to={"/spotify/random"} className={"nav-link"}>
                  Random
                </NavLink>
              </li>
            )}
            {!account && (
              <li className="nav-item">
                <NavLink to={"LoginPage"} className={"nav-link"}>
                  Login
                </NavLink>
              </li>
            )}
            {!account && (
              <li className="nav-item">
                <NavLink to={"SignupPage"} className={"nav-link"}>
                  Sign Up
                </NavLink>
              </li>
            )}
          </ul>

          {account && (
            <button
              className="btn btn-danger"
              to="logoutPage"
              onClick={() => logout()}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
