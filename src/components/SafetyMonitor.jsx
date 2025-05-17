import { useNavigate } from "react-router-dom";
import "../style/styles.css";
import axios from "axios";

function SafetyMonitor() {
  const nav = useNavigate();
  const handleCheckIn = async () => {
    const token = localStorage.getItem("token"); // 로그인 시 저장된 토큰

    if (!token) {
      alert("로그인이 필요합니다.");
      nav("/auth"); // 로그인 페이지로 이동
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/checkin",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ 체크인 완료: " + response.data.message);
    } catch (error) {
      const errMsg = error.response?.data?.error || "서버 오류가 발생했습니다.";
      alert("❌ 체크인 실패: " + errMsg);
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        <h2>생활 안전 체크</h2>
        <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
          매일 버튼을 눌러 안전을 확인하세요.
        </p>
        <button onClick={handleCheckIn}>체크인</button>
      </div>
    </div>
  );
}

export default SafetyMonitor;
