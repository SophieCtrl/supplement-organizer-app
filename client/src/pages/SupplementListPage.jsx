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
  const [typeFilter, setTypeFilter] = useState(""); // New state for type filter
  const [allFilters, setAllFilters] = useState({
    allSymptoms: [],
    allGoals: [],
    allNutritionalTypes: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/supplements`);
        const data = response.data;

        const filteredSupplements = data.filter((supplement) => {
          const symptoms = supplement.symptoms || [];
          const goals = supplement.goals || [];
          const nutritionalType = supplement.nutritional_type || [];
          const type = supplement.type || "";

          const matchesSymptom =
            filters.symptoms.length === 0 ||
            filters.symptoms.every((symptom) => symptoms.includes(symptom));

          const matchesGoal =
            filters.goals.length === 0 ||
            filters.goals.every((goal) => goals.includes(goal));

          const matchesNutritionalType =
            filters.nutritional_types.length === 0 ||
            filters.nutritional_types.every((type) =>
              nutritionalType.includes(type)
            );

          const matchesType =
            typeFilter === "" ||
            type.toLowerCase().includes(typeFilter.toLowerCase());

          return (
            matchesSymptom &&
            matchesGoal &&
            matchesNutritionalType &&
            matchesType
          );
        });

        const sortedSupplements = filteredSupplements.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setSupplements(sortedSupplements);
      } catch (error) {
        setError("Error fetching supplements");
        console.error(error);
      }
    };

    fetchSupplements();
  }, [filters, typeFilter]);

  // Fetch filter options from JSON file
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("/filters.json");
        const data = await response.json();
        setAllFilters({
          allSymptoms: data.symptoms,
          allGoals: data.goals,
          allNutritionalTypes: data.nutritional_types,
        });
      } catch (error) {
        console.error("Error fetching filter options", error);
      }
    };

    fetchFilters();
  }, []);

  // Handle filter change
  const handleFilterChange = (type, values) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: values,
    }));
  };

  // Handle type filter change
  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      symptoms: [],
      goals: [],
      nutritional_types: [],
    });
    setTypeFilter(""); // Reset type filter
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20">
      {error && <div className="mb-6 text-red-600 font-semibold">{error}</div>}

      {/* Type Filter Buttons */}
      <div className="mb-4 flex overflow-x-auto space-x-2">
        <button
          onClick={() => handleTypeFilterChange("vitamin")}
          className={`py-2 px-4 rounded-lg ${
            typeFilter === "vitamin"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Vitamins
        </button>
        <button
          onClick={() => handleTypeFilterChange("mineral")}
          className={`py-2 px-4 rounded-lg ${
            typeFilter === "mineral"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Minerals
        </button>
        <button
          onClick={() => handleTypeFilterChange("supplement")}
          className={`py-2 px-4 rounded-lg ${
            typeFilter === "supplement"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Supplements
        </button>
      </div>

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
              value={filters.symptoms}
              onChange={(e) =>
                handleFilterChange(
                  "symptoms",
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allFilters.allSymptoms.map((symptom) => (
                <option key={symptom._id} value={symptom.name}>
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
              value={filters.goals}
              onChange={(e) =>
                handleFilterChange(
                  "goals",
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allFilters.allGoals.map((goal) => (
                <option key={goal._id} value={goal.name}>
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
              value={filters.nutritional_types}
              onChange={(e) =>
                handleFilterChange(
                  "nutritional_types",
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allFilters.allNutritionalTypes.map((type) => (
                <option key={type._id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          <div className="mt-4">
            <button
              onClick={resetFilters}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg"
            >
              Reset Filters
            </button>
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
