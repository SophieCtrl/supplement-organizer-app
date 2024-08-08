import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const SupplementDetailsPage = () => {
  const { id } = useParams();
  const [supplement, setSupplement] = useState(null);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Supplement Details</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {supplement ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{supplement.name}</h2>
          <p>
            <strong>Recommended Dosage:</strong> {supplement.recommendedDosage}
          </p>
          <p>
            <strong>Timing:</strong> {supplement.timing}
          </p>
          <p>
            <strong>Interactions:</strong> {supplement.interactions}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SupplementDetailsPage;
