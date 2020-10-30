import React, { FormEvent, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import AsideLogin from "../components/AsideLogin";

import { useAuth } from "../contexts/auth";

import "../styles/pages/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const history = useHistory();

  const { signIn } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await signIn({ email, password });

      history.push("/dashboard");
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div id="page-login">
      <AsideLogin />

      <div className="right-content">
        <Link to="">
          <FiArrowLeft width={48} height={48} color="#15C3D6" />
        </Link>

        <form onSubmit={handleSubmit} className="form">
          <h2>Fazer login</h2>
          <div className="input-block">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="pass">Senha</label>
            <input
              type="password"
              name="pass"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="options">
            <div className="checkbox">
              <input type="checkbox" name="remember" id="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>

            <Link to="/forgot-password">Esqueci minha senha</Link>
          </div>

          <button
            type="submit"
            className="enter-button"
            disabled={!email || !password}
          >
            Entrar
          </button>

          {error && (
            <div className="error">
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
