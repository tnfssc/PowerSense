import { Route, Redirect } from "wouter";

import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Navigation";

import Home from "./pages";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import CourseInfo from "./pages/courses/[courseId]";
import SubmitSoln from "./pages/courses/[courseId]/submit";
import AllCourses from "./pages/courses";
import VerifyPhone from "./pages/verify-phone";
import LoginPage from "./pages/login";
import ForgotPasswordPage from "./pages/login/forgot-password";
import ResetPasswordPage from "./pages/login/reset-password";

export default function App() {
  return (
    <Nav>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/login/forgot-password">
        <ForgotPasswordPage />
      </Route>
      <ProtectedRoute path="/login/reset-password">
        <ResetPasswordPage />
      </ProtectedRoute>
      <ProtectedRoute path="/profile">
        <Profile />
      </ProtectedRoute>
      <ProtectedRoute path="/dashboard">
        <Dashboard />
      </ProtectedRoute>
      <ProtectedRoute path="/courses">
        <AllCourses />
      </ProtectedRoute>
      <ProtectedRoute path="/courses/:courseId">
        {({ courseId }) => {
          const courseIdNumber = parseInt(courseId, 10);
          if (isNaN(courseIdNumber)) return <Redirect to="/dashboard" />;
          return <CourseInfo courseId={courseIdNumber} />;
        }}
      </ProtectedRoute>
      <ProtectedRoute path="/courses/:courseId/submit">
        {({ courseId }) => {
          const courseIdNumber = parseInt(courseId, 10);
          if (isNaN(courseIdNumber)) return <Redirect to="/dashboard" />;
          return <SubmitSoln courseId={courseIdNumber} />;
        }}
      </ProtectedRoute>
      <ProtectedRoute path="/verify-phone">
        <VerifyPhone />
      </ProtectedRoute>
    </Nav>
  );
}
