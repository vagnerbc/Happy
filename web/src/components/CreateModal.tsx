import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import logoDelete from "../images/logo-create.svg";

import "../styles/components/create-modal.css";

interface Props {
  name: string;
}

function CreateModal({ name }: Props) {
  const history = useHistory();

  const handleGoBack = useCallback(() => {
    history.push("/app");
  }, [history]);

  return (
    <div id="create-modal">
      <div className="content">
        <div className="left">
          <h2>Ebaaa!</h2>
          <span>{`Seu cadastro de ${name} foi enviado ao administrador para ser aprovado.`}</span>
          <span>{`Agora é só esperar :)`}</span>
          <div className="button-content">
            <button onClick={handleGoBack}>Voltar para o mapa</button>
          </div>
        </div>
        <div className="right">
          <img src={logoDelete} alt="Logo" />
        </div>
      </div>
    </div>
  );
}

export default CreateModal;
