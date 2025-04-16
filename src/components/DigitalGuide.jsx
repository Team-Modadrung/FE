import "../style/styles.css";

function DigitalGuide() {
  const guides = [
    {
      title: "키오스크 사용법",
      videoUrl: "kiosk-video.mp4",
      description: "화면 터치와 결제 방법 배우기",
    },
    {
      title: "스마트폰 사용법",
      videoUrl: "phone-video.mp4",
      description: "앱 설치와 전화 걸기",
    },
  ];

  return (
    <div className="container">
      <h2>디지털 기기 안내</h2>
      {guides.map((guide, index) => (
        <div key={index} style={{ marginBottom: "2rem" }}>
          <h3>{guide.title}</h3>
          <video width="100%" controls>
            <source src={guide.videoUrl} type="video/mp4" />
            브라우저가 비디오를 지원하지 않습니다.
          </video>
          <p style={{ fontSize: "1.2rem" }}>{guide.description}</p>
          <button>자세히 보기</button>
        </div>
      ))}
    </div>
  );
}

export default DigitalGuide;
