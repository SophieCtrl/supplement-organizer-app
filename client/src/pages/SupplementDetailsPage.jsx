import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const SupplementDetailsPage = () => {
  const { id } = useParams();
  const [supplement, setSupplement] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupplement = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/supplements/${id}`);
        console.log(response.data);
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
      const response = await axiosInstance.put(
        `${API_URL}/api/users/supplements`,
        {
          supplementId: id,
        }
      );
      if (response.status === 200) {
        navigate("/my-supplements");
      }
    } catch (error) {
      console.error("Error adding supplement to user:", error);
      setError("Failed to add supplement to your list.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-20">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Error</h1>
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

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
                  {type.name}
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
                  {type.name}
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
                    {type.name}
                  </span>
                ))}
              </div>
            </>
          )}

        <button
          onClick={handleAddSupplement}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add to My Supplements
        </button>
      </div>
    </div>
  );
};

export default SupplementDetailsPage;
