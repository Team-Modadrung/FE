// import { Link } from "react-router-dom";
// import "../style/styles.css";

// function Home() {
//   return (
//     <div className="container">
//       <h1>토모봇에 오신 것을 환영합니다! 😊</h1>
//       <p className="subtitle">당신의 디지털 친구, 토모봇이 도와드릴게요.</p>
//       <div className="button-group">
//         <Link to="/digital-guide">
//           <button className="action-button">📱 디지털 기기 배우기</button>
//         </Link>
//         <Link to="/chat-companion">
//           <button className="action-button">🧑‍🤝‍🧑 말벗과 대화하기</button>
//         </Link>
//         <Link to="/safety-monitor">
//           <button className="action-button">🛡️ 안전 체크하기</button>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Home;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/styles.css";

function Home() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);

  useEffect(() => {
    const lastCheckedIn = localStorage.getItem("lastCheckedIn");
    const currentTime = new Date().getTime();

    // 24시간 이내에 출석했으면 출석 상태를 'true'로 설정
    if (lastCheckedIn && currentTime - lastCheckedIn <= 86400000) {
      setIsCheckedIn(true); // 출석 완료
    } else {
      setIsCheckedIn(false); // 출석 안 함
    }

    // 출석 시간이 24시간 초과했으면 연락 보내는 로직 추가
    if (!lastCheckedIn || currentTime - lastCheckedIn > 86400000) {
      console.log("24시간 이상 출석하지 않았습니다. 연락을 보냅니다!");
      // 여기에서 이메일, 문자, 푸시 알림 등을 보내는 API 호출이 필요할 수 있음
    }

    // 사용자가 처음 방문하거나 출석하지 않은 경우 출석 처리
    if (!lastCheckedIn || currentTime - lastCheckedIn > 86400000) {
      localStorage.setItem("lastCheckedIn", currentTime.toString());
      setIsCheckedIn(true); // 출석 완료 처리
    }
  }, []);

  return (
    <div className="container">
      <h1>토모봇에 오신 것을 환영합니다! 😊</h1>
      <p className="subtitle">당신의 디지털 친구, 토모봇이 도와드릴게요.</p>
      <div className="status">
        {/* 출석 여부 확인 */}
        {isCheckedIn ? (
          <p className="status-text">출석 완료! 🎉</p>
        ) : (
          <p className="status-text">출석하지 않았습니다. ⏰</p>
        )}
      </div>
      <div className="button-group">
        <Link to="/digital-guide">
          <button className="action-button">📱 디지털 기기 배우기</button>
        </Link>
        <Link to="/chat-companion">
          <button className="action-button">🧑‍🤝‍🧑 말벗과 대화하기</button>
        </Link>
        <Link to="/safety-monitor">
          <button className="action-button">🛡️ 안전 체크하기</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
