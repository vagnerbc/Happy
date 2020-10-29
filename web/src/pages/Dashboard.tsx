import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/auth";
import Login from "./Login";

function Dashboard() {
  const { signOut } = useAuth();
  const history = useHistory();

  const handleSignOut = () => {
    signOut();

    history.push("/login");
  };

  return (
    <div style={{ color: "red" }}>
      <button onClick={handleSignOut}>SignOut</button>
    </div>
  );
}

export default Dashboard;
