import React from "react";

import logo from "../images/logo-login.svg";

import "../styles/components/aside-login.css";

function AsideLogin() {
  return (
    <div id="aside-login">
      <img src={logo} alt="Logo" />
      <div className="place-content">
        <span>Faxinal</span>
        <span>Paraná</span>
      </div>
    </div>
  );
}

export default AsideLogin;
