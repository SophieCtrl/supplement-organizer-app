import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import IsAnon from "./components/IsAnon";
import IsPrivate from "./components/IsPrivate";
import SupplementDetailsPage from "./pages/SupplementDetailsPage";
import SupplementListPage from "./pages/SupplementListPage";
import UserSupplementPage from "./pages/UserSupplementPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <IsAnon>
              <HomePage />
            </IsAnon>
          }
        />
        <Route path="/supplements" element={<SupplementListPage />} />
        <Route path="/supplements/:id" element={<SupplementDetailsPage />} />
        <Route
          path="/signup"
          element={
            <IsAnon>
              <SignUpPage />
            </IsAnon>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnon>
              <LoginPage />
            </IsAnon>
          }
        />
        <Route
          path="/profile"
          element={
            <IsPrivate>
              <ProfilePage />
            </IsPrivate>
          }
        />
        <Route
          path="/my-supplements"
          element={
            <IsPrivate>
              <UserSupplementPage />
            </IsPrivate>
          }
        />
      </Routes>
    </>
  );
}

export default App;
