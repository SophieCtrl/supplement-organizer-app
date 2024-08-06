// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/users/profile"); // Adjust the endpoint as needed
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user profile.");
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {user ? (
          <div>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Height:</strong> {user.height}
            </p>
            <p>
              <strong>Weight:</strong> {user.weight}
            </p>
            <p>
              <strong>Age:</strong> {user.age}
            </p>
            <p>
              <strong>Nutritional Type:</strong> {user.nutritionalType}
            </p>
            <p>
              <strong>Illnesses:</strong> {user.illnesses.join(", ")}
            </p>
            <p>
              <strong>Symptoms:</strong> {user.symptoms.join(", ")}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
