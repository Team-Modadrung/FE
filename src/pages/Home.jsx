import { Link } from "react-router-dom";
import "../style/styles.css";

function Home() {
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
      </div>
    </div>
  );
}

export default Home;
