import React, { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../services/api";

function ForgotPassword() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await api.post("/forgot_password", { email });

      history.push("/reset_password", { email });
    } catch (error) {
      return setError(error.response.data.error);
    }
  };

  return (
    <div id="page-forgot-password">
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

        <form onSubmit={handleSubmit}>
          <h2>Esqueci a senha</h2>
          <span>
            Sua redefinição de senha será enviada para o e-mail cadastrado.
          </span>
          <div className="input-block">
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPassword;
