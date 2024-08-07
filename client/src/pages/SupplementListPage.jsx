import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const SupplementListPage = () => {
  const [supplements, setSupplements] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/supplements`);
        setSupplements(response.data);
      } catch (err) {
        setError("Failed to fetch supplements.");
      }
    };

    fetchSupplements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Supplement List</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {supplements.length > 0 ? (
          <ul>
            {supplements.map((supplement) => (
              <li key={supplement.id} className="mb-4 border-b pb-4">
                <h2 className="text-xl font-semibold">{supplement.name}</h2>
                <p className="text-gray-700">{supplement.description}</p>
                <p className="text-gray-600">Category: {supplement.category}</p>
                <p className="text-gray-600">Price: ${supplement.price}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No supplements found.</p>
        )}
      </div>
    </div>
  );
};

export default SupplementListPage;
