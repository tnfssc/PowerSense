import { Route, Redirect } from "wouter";

import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Navigation";

import Home from "./pages";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import CourseInfo from "./pages/courses/[courseId]";
import VerifyPhone from "./pages/verify-phone";
import LoginPage from "./pages/login";

export default function App() {
  return (
    <Nav>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <ProtectedRoute path="/profile">
        <Profile />
      </ProtectedRoute>
      <ProtectedRoute path="/dashboard">
        <Dashboard />
      </ProtectedRoute>
      <ProtectedRoute path="/courses/:courseId">
        {({ courseId }) => {
          const courseIdNumber = parseInt(courseId, 10);
          if (isNaN(courseIdNumber)) return <Redirect to="/dashboard" />;
          return <CourseInfo courseId={courseIdNumber} />;
        }}
      </ProtectedRoute>
      <ProtectedRoute path="/verify-phone">
        <VerifyPhone />
      </ProtectedRoute>
    </Nav>
  );
}
