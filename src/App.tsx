import { Route } from "wouter";

import Nav from "./components/Navigation";

import Home from "./pages";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";

export default function App() {
  return (
    <Nav>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
    </Nav>
  );
}
