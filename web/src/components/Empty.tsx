import React from "react";

import logoDisabled from "../images/map-marker-disabled.svg";

import "../styles/components/empty.css";

function Empty() {
  return (
    <div id="empty">
      <img src={logoDisabled} alt="Empty" />
      <span>Nenhum no momento</span>
    </div>
  );
}

export default Empty;
