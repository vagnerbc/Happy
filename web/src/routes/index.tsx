import React from "react";
import { useAuth } from "../contexts/auth";

import PrivateRoutes from "./private.routes";
import PublicRoutes from "./public.routes";

function Routes() {
  const { signed, loading } = useAuth();

  return loading ? (
    <span>...</span>
  ) : signed ? (
    <PrivateRoutes />
  ) : (
    <PublicRoutes />
  );
}

export default Routes;
