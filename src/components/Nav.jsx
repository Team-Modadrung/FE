import { Link } from "react-router-dom";
import "../style/styles.css";

function Nav() {
  return (
    <nav className="navbar">
      <div className="nav-title">토모봇</div>
      <ul className="nav-list">
        <li>
          <Link to="/" className="nav-link">
            홈
          </Link>
        </li>
        <li>
          <Link to="/digital-guide" className="nav-link">
            디지털 배우기
          </Link>
        </li>
        <li>
          <Link to="/chat-companion" className="nav-link">
            말벗
          </Link>
        </li>
        <li>
          <Link to="/safety-monitor" className="nav-link">
            안전
          </Link>
        </li>
        <li>
          <Link to="/open" className="nav-link">
            오픈채팅
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
