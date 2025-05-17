import React, { use, useState } from "react";
import "../style/login.css"; // Assuming you have a CSS file for styling
import { useNavigate } from "react-router-dom";

function Login() {
  const nav = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    guardianPhone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      alert(`로그인 시도: ${formData.username}`);
      nav("/"); // Redirect to home after login
    } else {
      alert(
        `회원가입 시도: 아이디(${formData.username}), 보호자 번호(${formData.guardianPhone})`
      );
      nav("/auth"); // Redirect to home after signup
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
            <input
              type="tel"
              name="guardianPhone"
              placeholder="보호자 휴대폰번호"
              value={formData.guardianPhone}
              onChange={handleChange}
              required
            />
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
