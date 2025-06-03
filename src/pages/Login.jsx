import React, { useState } from "react";
import "../style/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const nav = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    guardianPhone: "",
    password: "",
    region: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // 로그인 API 요청
        const res = await axios.post("http://localhost:5000/api/login", {
          name: formData.username,
          password: formData.password,
        });

        // ✅ 토큰 저장
        localStorage.setItem("token", res.data.token);

        alert("✅ 로그인 성공");
        nav("/"); // 로그인 성공 시 홈으로 이동
      } else {
        // 회원가입 API 요청
        const res = await axios.post("http://localhost:5000/api/register", {
          name: formData.username,
          password: formData.password,
          guardianContact: formData.guardianPhone,
          guardianEmail: formData.email,
          region: formData.region,
        });
        alert("✅ 회원가입 성공");
        nav("/auth"); // 회원가입 후 로그인 화면 또는 다른 화면
      }
    } catch (err) {
      console.error("❌ 요청 실패:", err.response?.data || err.message);
      alert("❌ 에러 발생: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            로그인
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            회원가입
          </button>
        </div>
        <h2 className="auth-title">{isLogin ? "로그인" : "회원가입"}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <>
              <input
                type="email"
                name="email"
                placeholder="이메일"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="guardianPhone"
                placeholder="보호자 휴대폰번호"
                value={formData.guardianPhone}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="region"
                placeholder="거주 지역 (예: 서울, 부산)"
                value={formData.region}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? "로그인" : "회원가입"}</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
