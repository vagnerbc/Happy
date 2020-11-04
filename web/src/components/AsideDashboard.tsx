import React, { useCallback } from "react";
import classNames from "classnames";
import { FiMapPin, FiInfo, FiPower } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import logo from "../images/map-marker.svg";
import { useAuth } from "../contexts/auth";

import "../styles/components/aside-dashboard.css";

interface Props {
  approved: boolean;
  handlePending: () => void;
  handleApproved: () => void;
}

function AsideDashboard({ approved, handlePending, handleApproved }: Props) {
  const { signOut } = useAuth();
  const history = useHistory();

  const handleSignOut = useCallback(() => {
    signOut();

    history.push("/login");
  }, [history, signOut]);

  return (
    <aside id="aside-dashboard">
      <img src={logo} alt="Logo" />
      <div className="status-buttons">
        <button
          onClick={handleApproved}
          className={classNames({ active: approved })}
        >
          <FiMapPin width={48} height={48} />
        </button>
        <button
          onClick={handlePending}
          className={classNames({ active: !approved })}
        >
          <FiInfo width={48} height={48} />
        </button>
      </div>
      <button onClick={handleSignOut}>
        <FiPower width={48} height={48} />
      </button>
    </aside>
  );
}

export default AsideDashboard;
