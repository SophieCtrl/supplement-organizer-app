import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const SupplementListPage = () => {
  const [supplements, setSupplements] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/supplements`);
        setSupplements(response.data);
      } catch (error) {
        setError("Error fetching supplements");
        console.error(error);
      }
    };

    fetchSupplements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Supplements List
      </h1>
      {error && <div className="mb-6 text-red-600 font-semibold">{error}</div>}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <ul className="space-y-4">
          {supplements.map((supplement) => (
            <li key={supplement._id} className="border-b border-gray-200 py-4">
              <Link
                to={`/supplements/${supplement._id}`}
                className="text-blue-600 hover:text-blue-800 font-medium text-lg"
              >
                {supplement.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SupplementListPage;
