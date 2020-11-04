import React from "react";

import logoDelete from "../images/logo-delete.svg";

import "../styles/components/delete-modal.css";

interface Props {
  orphanage: {
    id: string;
    name: string;
  };
  handleCancel: () => void;
  handleDelete: () => void;
}

function DeleteModal({ orphanage, handleCancel, handleDelete }: Props) {
  return (
    <div id="delete-modal">
      <div className="content">
        <div className="left">
          <h2>Excluir</h2>
          <span>{`Você tem certeza que quer excluir o ${orphanage.name} ?`}</span>
          <div className="button-content">
            <button onClick={handleCancel}>Cancelar</button>
            <button onClick={handleDelete}>Excluir</button>
          </div>
        </div>
        <div className="right">
          <img src={logoDelete} alt="Logo" />
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
