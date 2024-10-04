import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import axiosInstance from "../axiosInstance";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import BrandList from "../components/BrandList";

const API_URL = import.meta.env.VITE_API_URL;

const SupplementDetailsPage = ({ supplementId }) => {
  const { id } = useParams();
  const [supplement, setSupplement] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/api/users/profile");
        setUser(response.data);

        const supplementExists = response.data.personal_supplements.some(
          (supp) => supp.supplement._id === id
        );
        setIsAlreadyAdded(supplementExists);
      } catch (err) {
        setError("Failed to fetch user profile or options.");
      }
    };

    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchSupplement = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/supplements/${id}`);
        setSupplement(response.data);
      } catch (error) {
        setError("Error fetching supplement details");
        console.error(error);
      }
    };

    fetchSupplement();
  }, [id]);

  const handleAddSupplement = async () => {
    try {
      const response = await axiosInstance.post(`/api/users/supplements`, {
        userId: user._id,
        supplementId: supplement._id,
        dosage: 0,
        frequency: "",
        time: "",
      });
      if (response.status === 200) {
        navigate("/my-supplements");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
      } else if (error.request) {
        console.error("Error Request:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    }
  };

  if (!supplement) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-20">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {supplement.name}
        </h1>
        <p className="text-gray-700 mb-2">
          <strong>Description:</strong> {supplement.description}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Recommended Dosage:</strong> {supplement.maximum_dosis}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Effect:</strong> {supplement.effect}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Possible Side Effects:</strong> {supplement.side_effects}
        </p>

        {supplement.symptoms && supplement.symptoms.length > 0 && (
          <>
            <p className="text-gray-700 mb-2">
              <strong>Prevents:</strong>
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {supplement.symptoms.map((type, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-400 flex items-center"
                >
                  {type}
                </span>
              ))}
            </div>
          </>
        )}

        {supplement.goals && supplement.goals.length > 0 && (
          <>
            <p className="text-gray-700 mb-2">
              <strong>Supports:</strong>
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {supplement.goals.map((type, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-400 flex items-center"
                >
                  {type}
                </span>
              ))}
            </div>
          </>
        )}

        {supplement.nutritional_type &&
          supplement.nutritional_type.length > 0 && (
            <>
              <p className="text-gray-700 mb-2">
                <strong>Nutritional Type:</strong>
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {supplement.nutritional_type.map((type, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-400 flex items-center"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </>
          )}

        {isLoggedIn ? (
          !isAlreadyAdded ? (
            <button
              onClick={handleAddSupplement}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to My Supplements
            </button>
          ) : (
            <p className="mt-4 text-gray-600">
              This supplement is already in your list.
            </p>
          )
        ) : (
          <p className="mt-4 pt-4 text-gray-600">
            <Link
              to="/login"
              state={{ from: location }}
              className="text-blue-500 underline"
            >
              Login
            </Link>{" "}
            to add this supplement to your personal list.
          </p>
        )}

        {isLoggedIn && <BrandList supplementId={id} />}
      </div>
    </div>
  );
};

export default SupplementDetailsPage;
