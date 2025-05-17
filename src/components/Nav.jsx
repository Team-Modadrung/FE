import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/styles.css";

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 페이지 새로고침 시 로그인 상태 복원
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // 홈으로 이동
  };

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
          {isLoggedIn ? (
            <button className="nav-link" onClick={handleLogout}>
              로그아웃
            </button>
          ) : (
            <Link className="nav-link" to="/auth">
              로그인
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
