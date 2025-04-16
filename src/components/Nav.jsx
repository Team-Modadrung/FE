import { Link } from "react-router-dom";
import "../style/styles.css";

function Nav() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <Link to="/" className="nav-link">
            홈
          </Link>
        </li>
        <li>
          <Link to="/digital-guide" className="nav-link">
            디지털 안내
          </Link>
        </li>
        <li>
          <Link to="/chat-companion" className="nav-link">
            말벗
          </Link>
        </li>
        <li>
          <Link to="/safety-monitor" className="nav-link">
            안전 체크
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
