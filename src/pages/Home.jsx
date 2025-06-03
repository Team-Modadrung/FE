import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../style/styles.css";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleAuthButton = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token"); // 로그아웃 처리
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="container">
      <h1>토모봇에 오신 것을 환영합니다!</h1>
      <p className="subtitle">당신의 디지털 친구, 토모봇이 도와드릴게요.</p>
      <div className="button-group">
        <Link to="/digital-guide">
          <button className="action-button">디지털 기기 배우기</button>
        </Link>
        <Link to="/chat-companion">
          <button className="action-button">말벗과 대화하기</button>
        </Link>
        <Link to="/safety-monitor">
          <button className="action-button">안전 체크하기</button>
        </Link>
        {/* 로그인/로그아웃 버튼 */}
        <button className="action-button" onClick={handleAuthButton}>
          {isLoggedIn ? "로그아웃" : "로그인"}
        </button>
      </div>
    </div>
  );
}

export default Home;
