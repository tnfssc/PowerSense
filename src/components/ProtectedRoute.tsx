import { Route, Redirect, RouteProps } from "wouter";

import useAuth from "../use/auth";

export default function ProtectedRoute({ ...props }: RouteProps): React.ReactElement {
  const user = useAuth();
  if (user) return <Route {...props} />;
  return <Redirect to="/" />;
}
