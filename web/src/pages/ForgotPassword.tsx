import React, { FormEvent, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import api from "../services/api";
import AsideLogin from "../components/AsideLogin";

import "../styles/pages/forgot-password.css";

function ForgotPassword() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await api.post("/forgot_password", { email });

      history.push("/reset-password", { email });
    } catch (error) {
      return setError(error.response.data.error);
    }
  };

  const formInvalid = !emailRef.current?.validity.valid;

  return (
    <div id="page-forgot-password">
      <AsideLogin />

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
              type="email"
              name="email"
              required
              ref={emailRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPassword;
