import { Route } from "wouter";

import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Navigation";

import Home from "./pages";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import VerifyPhone from "./pages/verify-phone";

export default function App() {
  return (
    <Nav>
      <Route path="/">
        <Home />
      </Route>
      <ProtectedRoute path="/profile">
        <Profile />
      </ProtectedRoute>
      <ProtectedRoute path="/dashboard">
        <Dashboard />
      </ProtectedRoute>
      <ProtectedRoute path="/verify-phone">
        <VerifyPhone />
      </ProtectedRoute>
    </Nav>
  );
}
