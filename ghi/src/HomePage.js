import Meme from "./logo-image/Meme.png";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <Link to={"loginpage"} className="navbar-brand">
        <div className="container d-flex justify-content-center">
          <img src={Meme} alt="stupify" height="70%" width="70%"></img>
        </div>
      </Link>
    </div>
  );
}

export default HomePage;
