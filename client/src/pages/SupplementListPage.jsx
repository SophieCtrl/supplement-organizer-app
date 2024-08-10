import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const SupplementListPage = () => {
  const [supplements, setSupplements] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    symptoms: [],
    goals: [],
    nutritional_types: [],
  });
  const [allFilters, setAllFilters] = useState({
    allSymptoms: [],
    allGoals: [],
    allNutritionalTypes: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch supplements and filter options
  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/supplements`, {
          params: { ...filters },
        });
        setSupplements(response.data);
      } catch (error) {
        setError("Error fetching supplements");
        console.error(error);
      }
    };

    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/filters`);
        setAllFilters(response.data);
      } catch (error) {
        console.error("Error fetching filter options", error);
      }
    };

    fetchSupplements();
    fetchFilters();
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20">
      {error && <div className="mb-6 text-red-600 font-semibold">{error}</div>}

      <div className="flex flex-col md:flex-row">
        {/* Filters Toggle Button for Mobile */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-xl font-semibold text-gray-900"
          >
            Filters
            {showFilters ? (
              <FaChevronUp className="ml-2" />
            ) : (
              <FaChevronDown className="ml-2" />
            )}
          </button>
        </div>

        {/* Filters Section */}
        <div
          className={`p-4 rounded-lg md:w-1/4 md:mr-4 mb-4 md:mb-0 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          {/* Symptoms Filter */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Symptoms</label>
            <select
              multiple
              className="w-full bg-white border border-gray-300 rounded-lg"
              onChange={(e) =>
                handleFilterChange(
                  "symptoms",
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allFilters.allSymptoms.map((symptom) => (
                <option key={symptom._id} value={symptom._id}>
                  {symptom.name}
                </option>
              ))}
            </select>
          </div>

          {/* Goals Filter */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Goals</label>
            <select
              multiple
              className="w-full bg-white border border-gray-300 rounded-lg"
              onChange={(e) =>
                handleFilterChange(
                  "goals",
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allFilters.allGoals.map((goal) => (
                <option key={goal._id} value={goal._id}>
                  {goal.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nutritional Types Filter */}
          <div>
            <label className="block mb-2 font-medium">Nutritional Types</label>
            <select
              multiple
              className="w-full bg-white border border-gray-300 rounded-lg"
              onChange={(e) =>
                handleFilterChange(
                  "nutritional_types",
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allFilters.allNutritionalTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Supplements List */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 md:w-3/4">
          <ul className="space-y-4">
            {supplements.map((supplement) => (
              <li
                key={supplement._id}
                className="border-b border-gray-200 py-4"
              >
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
    </div>
  );
};

export default SupplementListPage;
