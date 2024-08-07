import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const SupplementDetailsPage = () => {
  const { id } = useParams(); // Get the supplement ID from the route parameters
  const [supplement, setSupplement] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupplementDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/supplements/${id}`);
        setSupplement(response.data);
      } catch (err) {
        setError("Failed to fetch supplement details.");
      }
    };

    fetchSupplementDetails();
  }, [id]);

  if (!supplement) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Supplement Details</h1>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Supplement Details</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{supplement.name}</h2>
        <p className="text-gray-700 mb-4">{supplement.description}</p>
        <p className="text-gray-600 mb-2">Category: {supplement.category}</p>
        <p className="text-gray-600 mb-2">Price: ${supplement.price}</p>
        <p className="text-gray-600 mb-2">Quantity: {supplement.quantity}</p>
        <p className="text-gray-600 mb-2">
          Ingredients: {supplement.ingredients}
        </p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default SupplementDetailsPage;
