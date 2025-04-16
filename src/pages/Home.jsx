import { Link } from "react-router-dom";
import "../style/styles.css";

function Home() {
  return (
    <div className="container">
      <h1>토모봇에 오신 것을 환영합니다!</h1>
      <Link to="/digital-guide">
        <button>디지털 기기 배우기</button>
      </Link>
      <Link to="/chat-companion">
        <button>말벗과 대화하기</button>
      </Link>
      <Link to="/safety-monitor">
        <button>안전 체크하기</button>
      </Link>
    </div>
  );
}

export default Home;
