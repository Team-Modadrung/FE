import "../style/styles.css";

function SafetyMonitor() {
  const handleCheckIn = () => {
    alert("체크인 완료! 안전 확인되었습니다.");
  };

  return (
    <div className="container">
      <h2>생활 안전 체크</h2>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        매일 버튼을 눌러 안전을 확인하세요.
      </p>
      <button onClick={handleCheckIn}>체크인</button>
    </div>
  );
}

export default SafetyMonitor;
