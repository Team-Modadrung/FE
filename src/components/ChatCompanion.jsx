import React, { useState, useEffect, useRef } from "react";
import "../style/styles.css";
import axios from "axios";

// AI에게 상담사 역할을 부여하는 시스템 지침
const counselorSystemInstruction = `
당신은 사용자의 이야기를 주의 깊게 들어주고 공감해주는 따뜻한 AI 상담사입니다.
사용자의 감정을 이해하고 지지하며, 판단하지 않는 태도를 유지하세요.
직접적인 해결책이나 조언을 주기보다는, 사용자가 스스로 자신의 감정과 생각을 탐색하고 정리할 수 있도록 개방형 질문을 던지세요. (예: "그렇게 느끼셨을 때 기분이 어떠셨어요?", "그 상황에 대해 좀 더 자세히 말씀해주실 수 있나요?")
항상 차분하고 부드러우며 존중하는 어조를 사용하세요.

**매우 중요:**
- 당신은 전문적인 의료인이나 심리 치료사가 아님을 명확히 인지하고, 대화 중 적절한 시점에 이를 사용자에게 상기시켜 주세요. (예: "저는 AI라 전문적인 진단이나 치료를 제공할 순 없지만, 마음 터놓고 이야기 나눌 상대가 되어 드릴게요.")
- 사용자가 자해, 자살, 타인에 대한 위협 등 심각한 위기 상황을 언급하는 경우, 즉시 전문가의 도움을 받도록 강력히 권유하고 구체적인 연락처(예: 대한민국 자살예방상담전화 1393, 정신건강위기상담전화 1577-0199)를 안내하세요. 이때, 당신은 AI로서 직접적인 개입을 할 수 없다는 점을 명확히 밝혀야 합니다.
- 사용자의 개인 정보나 민감한 정보는 절대 저장하거나 외부로 유출해서는 안 됩니다.
`;

// AI의 초기 응답
const initialBotGreeting =
  "안녕하세요. 저는 당신의 이야기를 귀 기울여 들어줄 마음 상담 AI입니다. 어떤 이야기든 편안하게 나눠주세요.";

function ChatCompanion() {
  const [messages, setMessages] = useState([
    {
      text: initialBotGreeting,
      sender: "bot",
      role: "assistant",
      content: initialBotGreeting,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatBoxRef = useRef(null);
  const lastTranscriptRef = useRef("");

  // OpenAI API 키 (제공된 키)
  const OPENAI_API_KEY =
    "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";

  const recognition = useRef(null);
  const speechUtterance = useRef(null);
  const speechSynthesis = useRef(null);

  // 음성 인식 및 합성 초기 설정
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
      return;
    }
    recognition.current = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.current.lang = "ko-KR";
    recognition.current.interimResults = true;
    recognition.current.onstart = () => {
      setIsListening(true);
      lastTranscriptRef.current = "";
      if (speechSynthesis.current?.speaking) {
        speechSynthesis.current.cancel();
      }
    };
    recognition.current.onresult = (event) => {
      let currentTranscript = "";
      let isFinalResult = false;
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          isFinalResult = true;
        }
      }
      setInput(currentTranscript);
      if (
        isFinalResult &&
        currentTranscript.trim() &&
        currentTranscript.trim() !== lastTranscriptRef.current
      ) {
        lastTranscriptRef.current = currentTranscript.trim();
        handleSend(currentTranscript.trim());
      }
    };
    recognition.current.onend = () => setIsListening(false);
    recognition.current.onerror = (event) => {
      console.error("음성 인식 오류:", event.error);
      setIsListening(false);
    };

    if ("speechSynthesis" in window) {
      speechSynthesis.current = window.speechSynthesis;
      speechUtterance.current = new SpeechSynthesisUtterance();
      speechUtterance.current.lang = "ko-KR";
      speechUtterance.current.rate = 1;
      speechUtterance.current.pitch = 1;
    } else {
      console.warn("이 브라우저는 음성 합성을 지원하지 않습니다.");
    }
  }, []);

  // 채팅창 자동 스크롤
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // 음성 인식 시작/중단
  const handleListen = () => {
    if (!recognition.current) return;
    if (!isListening) {
      setInput("");
      lastTranscriptRef.current = "";
      if (speechSynthesis.current?.speaking) {
        speechSynthesis.current.cancel();
      }
      recognition.current.start();
    } else {
      recognition.current.stop();
    }
  };

  // OpenAI API 호출 로직
  const callOpenAIAPI = async (currentMessagesWithHistory) => {
    const conversationHistory = [
      // 시스템 지침
      {
        role: "system",
        content: counselorSystemInstruction,
      },
      // 실제 대화 기록
      ...currentMessagesWithHistory.map((msg) => ({
        role: msg.role,
        content: msg.content || msg.text,
      })),
    ];

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: conversationHistory,
          temperature: 0.7, // 답변의 다양성 조절 (선택사항)
          max_tokens: 500, // 응답 길이 제한 (필요에 따라 조정)
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const botResponseText = response.data.choices[0].message.content.trim();
      const botMessage = {
        text: botResponseText,
        sender: "bot",
        role: "assistant",
        content: botResponseText,
      };
      setMessages((prev) => [...prev, botMessage]);

      // TTS 실행
      if (speechSynthesis.current && speechUtterance.current) {
        if (speechSynthesis.current.speaking) {
          speechSynthesis.current.cancel();
        }
        speechUtterance.current.text = botResponseText;
        speechSynthesis.current.speak(speechUtterance.current);
      }
      return botMessage;
    } catch (error) {
      console.error(
        "OpenAI API 호출/처리 오류:",
        error.response?.data || error.message
      );
      const errorText = "죄송합니다. 답변 생성 중 오류가 발생했습니다.";
      const errorMessage = {
        text: errorText,
        sender: "bot",
        role: "assistant",
        content: errorText,
      };
      setMessages((prev) => [...prev, errorMessage]);
      return errorMessage;
    }
  };

  // 메시지 전송 핸들러
  const handleSend = async (messageToSend) => {
    const trimmedMessage = messageToSend.trim();
    if (isLoading || !trimmedMessage || !OPENAI_API_KEY) {
      console.warn("API 키 또는 메시지가 유효하지 않습니다.");
      return;
    }

    setIsLoading(true);
    if (isListening && recognition.current) {
      recognition.current.stop();
    }
    if (speechSynthesis.current?.speaking) {
      speechSynthesis.current.cancel();
    }

    const userMessage = {
      text: trimmedMessage,
      sender: "user",
      role: "user",
      content: trimmedMessage,
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput("");

    await callOpenAIAPI(currentMessages);

    setIsLoading(false);
  };

  // 수동 전송 핸들러
  const handleManualSend = () => {
    if (input.trim() && !isLoading) {
      handleSend(input.trim());
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "700px", margin: "0 auto", padding: "1rem" }}
    >
      <h2 style={{ textAlign: "center" }}>마음 나누기 AI 챗봇</h2>

      <p
        style={{
          fontSize: "0.9rem",
          color: "gray",
          textAlign: "center",
          marginBottom: "1rem",
          padding: "0 1rem",
        }}
      >
        [주의] 이 챗봇은 AI이며 전문적인 심리 상담이나 치료를 대체할 수
        없습니다. 심각한 어려움을 겪고 계시거나 위기 상황 시에는 반드시
        전문가(1393, 1577-0199 등)와 상담하세요.
      </p>

      {/* 채팅창 */}
      <div
        ref={chatBoxRef}
        style={{
          height: "60vh",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "10px",
          backgroundColor: "#fafafa",
          marginBottom: "1rem",
        }}
      >
        {messages.map((msg, index) => (
          <p
            key={`${msg.sender}-${index}`}
            style={{
              fontSize: "1rem",
              textAlign: msg.sender === "user" ? "right" : "left",
              color: msg.sender === "user" ? "blue" : "black",
              backgroundColor: msg.sender === "user" ? "#e1f5fe" : "#f1f1f1",
              padding: "0.6rem 1rem",
              borderRadius: "15px",
              margin:
                msg.sender === "user"
                  ? "0.5rem 0 0.5rem auto"
                  : "0.5rem auto 0.5rem 0",
              maxWidth: "80%",
              wordBreak: "break-word",
              lineHeight: "1.5",
            }}
          >
            {msg.content || msg.text}
          </p>
        ))}

        {isLoading && (
          <p
            style={{ color: "gray", textAlign: "center", fontStyle: "italic" }}
          >
            답변을 생각하고 있어요...
          </p>
        )}
        {isListening && (
          <p
            style={{ color: "green", textAlign: "center", fontStyle: "italic" }}
          >
            듣고 있어요...
          </p>
        )}
      </div>

      {/* 입력 + 버튼 영역 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {/* 입력창 */}
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="하고 싶은 이야기를 편하게 입력하세요..."
            style={{
              flexGrow: 1,
              fontSize: "1.5rem", // 폰트 크기를 키워서 읽기 쉽도록
              padding: "1rem",
              height: "4rem", // 입력창 높이 증가
              borderRadius: "25px",
              border: "1px solid #ccc",
              outline: "none",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "border-color 0.3s ease",
            }}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.nativeEvent.isComposing &&
                !isLoading
              ) {
                handleManualSend();
              }
            }}
            onFocus={(e) => (e.target.style.borderColor = "#228be6")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>
        {/* 🎤 마이크 버튼 */}
        <button
          onClick={handleListen}
          disabled={isLoading}
          title={isListening ? "듣기 중단" : "음성으로 말하기"}
          style={{
            height: "3rem",
            padding: "0 1.2rem",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#228be6",
            color: "white",
            cursor: "pointer",
            fontSize: "1rem",
            whiteSpace: "nowrap",
          }}
        >
          {isListening ? "■" : "말하기"}
        </button>

        {/* 전송 버튼 */}
        <button
          onClick={handleManualSend}
          disabled={isLoading || !input.trim()}
          style={{
            height: "3rem",
            padding: "0 1.2rem",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#228be6",
            color: "white",
            cursor: "pointer",
            fontSize: "1rem",
            whiteSpace: "nowrap",
          }}
        >
          {isLoading ? "..." : "전송"}
        </button>
      </div>
    </div>
  );
}

export default ChatCompanion;
