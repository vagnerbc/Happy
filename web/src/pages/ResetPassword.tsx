import React, { FormEvent, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useHistory, useParams } from "react-router-dom";

import api from "../services/api";

function ResetPassword(props: { email: string }) {
  const history = useHistory();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  //   const params = useParams();

  //   const { email } = params as { email: string };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.post("/reset-password", {
        email: props.email,
        token,
        password,
      });
      history.push("/login");
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div id="page-reset-password">
      <div className="left-content">
        <img src="" alt="Logo" />
        <div className="place-content">
          <span>Faxinal</span>
          <span>Paraná</span>
        </div>
      </div>

      <div className="right-content">
        <Link to="">
          <FiArrowLeft width={48} height={48} color="#15C3D6" />
        </Link>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-block">
            <h2>Fazer login</h2>
            <label htmlFor="token">Token</label>
            <input
              type="text"
              name="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          <div className="input-block">
            <h2>Fazer login</h2>
            <label htmlFor="pass">Nova senha</label>
            <input
              type="text"
              name="email"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="repeat-pass">Repetir senha</label>
            <input
              type="text"
              name="pass"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="enter-button">
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
