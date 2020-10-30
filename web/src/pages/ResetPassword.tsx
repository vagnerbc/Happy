import React, { FormEvent, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";

import AsideLogin from "../components/AsideLogin";

import api from "../services/api";

import "../styles/pages/reset-password.css";

function ResetPassword() {
  const history = useHistory();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const { email } = history.location.state as { email: string };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.post("/reset_password", {
        email,
        token,
        password,
      });
      history.push("/login");
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const formInvalid = !token || !password || !repeatPassword;

  return (
    <div id="page-reset-password">
      <AsideLogin />

      <div className="right-content">
        <Link to="">
          <FiArrowLeft width={48} height={48} color="#15C3D6" />
        </Link>

        <form onSubmit={handleSubmit}>
          <h2>Redefinição de senha</h2>
          <span>
            Escolha uma nova senha para você acessar o dashboard do Happy
          </span>

          <div className="input-block">
            <label htmlFor="token">Token</label>
            <input
              type="text"
              name="token"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="pass">Nova senha</label>
            <input
              type="password"
              name="email"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="repeat-pass">Repetir senha</label>
            <input
              type="password"
              name="pass"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="enter-button" disabled={formInvalid}>
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

export default ResetPassword;
