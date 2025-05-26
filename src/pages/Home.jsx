import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../style/styles.css";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleAuthButton = () => {
    if (isLoggedIn) {
      // 로그아웃 처리: 예를 들어 상태를 false로 바꾸고, 홈으로 이동
      setIsLoggedIn(false);
      // 로그아웃 후 원하는 경로로 이동 (예: 홈)
      navigate("/");
    } else {
      // 로그인 페이지로 이동
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
