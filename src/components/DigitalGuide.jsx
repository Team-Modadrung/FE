import { useState } from "react";
import "../style/styles.css";

function DigitalGuide() {
  const guides = [
    {
      title: "키오스크 사용법",
      videoUrl: "kiosk-video.mp4",
      description: "화면 터치와 결제 방법 배우기",
      detail:
        "키오스크는 무인 주문기입니다. 화면을 손가락으로 누르면 메뉴가 나옵니다. 원하는 메뉴를 누르고, 마지막에 결제 버튼을 눌러 카드를 넣거나 휴대폰으로 결제합니다.",
      image: "kiosk-guide.jpg",
    },
    {
      title: "스마트폰 사용법",
      videoUrl: "phone-video.mp4",
      description: "앱 설치와 전화 걸기",
      detail:
        "스마트폰에서 '전화' 아이콘을 누르면 숫자 키패드가 나옵니다. 번호를 누른 후 초록색 전화 버튼을 누르면 전화를 걸 수 있습니다. 앱을 설치하려면 'Play 스토어'를 누르세요.",
      image: "phone-guide.jpg",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleDetail = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "ko-KR";
    window.speechSynthesis.speak(speech);
  };

  return (
    <div
      className="container"
      style={{
        fontSize: "1.5rem",
        lineHeight: "2.2rem",
        maxWidth: "800px",
        margin: "auto",
        padding: "2rem",
      }}
    >
      <h2 style={{ fontSize: "2.2rem", marginBottom: "2rem" }}>
        📱 디지털 기기 안내
      </h2>
      {guides.map((guide, index) => (
        <div
          key={index}
          style={{
            marginBottom: "4rem",
            padding: "1.5rem",
            border: "2px solid #ddd",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
            {guide.title}
          </h3>

          <video
            width="100%"
            controls
            style={{
              maxWidth: "100%",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <source src={guide.videoUrl} type="video/mp4" />
            브라우저가 비디오를 지원하지 않습니다.
          </video>

          <p style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>
            {guide.description}
          </p>

          <button
            onClick={() => toggleDetail(index)}
            style={{
              fontSize: "1.4rem",
              padding: "0.8rem 1.6rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: openIndex === index ? "2rem" : "0",
            }}
          >
            {openIndex === index ? "간단히 보기" : "📖 더 알아보기"}
          </button>

          {openIndex === index && (
            <div>
              <img
                src={guide.image}
                alt={`${guide.title} 안내 이미지`}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  marginTop: "2rem",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />
              <p
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                }}
              >
                {guide.detail}
              </p>
              <button
                onClick={() => speakText(guide.detail)}
                style={{
                  fontSize: "1.3rem",
                  padding: "0.6rem 1.2rem",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
              >
                🔊 설명 듣기
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DigitalGuide;
