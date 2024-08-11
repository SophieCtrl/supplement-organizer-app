import { ChevronDownIcon } from "@heroicons/react/24/solid"; // Ensure correct path
import React, { useEffect, useState, useRef } from "react";
import axios from "../axiosInstance";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const UserSupplementPage = () => {
  const [personalSupplements, setPersonalSupplements] = useState([]);
  const [editedSupplements, setEditedSupplements] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [changedSupplements, setChangedSupplements] = useState(new Set());
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchPersonalSupplements = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/profile`);
        setPersonalSupplements(response.data.personal_supplements);
        console.log(response);
      } catch (error) {
        console.error("Error fetching personal supplements", error);
      }
    };

    fetchPersonalSupplements();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (supplementId, field, value) => {
    setEditedSupplements({
      ...editedSupplements,
      [supplementId]: {
        ...editedSupplements[supplementId],
        [field]: value,
      },
    });
    setChangedSupplements((prev) => new Set(prev.add(supplementId)));
  };

  const handleSave = async (supplementId) => {
    try {
      const response = await axios.put(`${API_URL}/api/users/supplements`, {
        supplementId,
        dosage: Number(editedSupplements[supplementId]?.dosage) || 0,
        frequency: editedSupplements[supplementId]?.frequency || "",
        time: editedSupplements[supplementId]?.time || "",
      });
      // Optionally refetch the data or update local state
      const fetchResponse = await axios.get(`${API_URL}/api/users/profile`);
      setPersonalSupplements(fetchResponse.data.personal_supplements);
      setEditedSupplements({ ...editedSupplements, [supplementId]: {} });
      setChangedSupplements((prev) => {
        const updated = new Set(prev);
        updated.delete(supplementId);
        return updated;
      });
      console.log("Response:", response);
    } catch (error) {
      console.error("Error saving supplement details", error);
    }
  };

  const toggleDropdown = (supplementId, field) => {
    setOpenDropdown(
      openDropdown === `${supplementId}-${field}`
        ? null
        : `${supplementId}-${field}`
    );
  };

  const selectOption = (supplementId, field, option) => {
    handleInputChange(supplementId, field, option);
    setOpenDropdown(null);
  };

  const handleDosageChange = (e, supplementId) => {
    const newDosage = Number(e.target.value);
    setEditedSupplements((prev) => ({
      ...prev,
      [supplementId]: {
        ...prev[supplementId],
        dosage: newDosage,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 py-20">
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          My Supplements
        </h2>
        <div className="space-y-4">
          {personalSupplements.length > 0 ? (
            personalSupplements.map((item, index) => (
              <div key={index} className="bg-white p-4 shadow rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link
                    to={`/supplements/${item.supplement._id}`}
                    className="text-blue-600 hover:underline text-lg font-semibold"
                  >
                    {item.supplement.name}
                  </Link>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium">
                      Dosage (mg)
                    </label>
                    <input
                      type="number"
                      value={
                        editedSupplements[item.supplement._id]?.dosage ||
                        item.dosage
                      }
                      onChange={(e) =>
                        handleDosageChange(e, item.supplement._id)
                      }
                      className="block w-full p-2 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-gray-700 text-sm font-medium">
                      Frequency
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        toggleDropdown(item.supplement._id, "frequency")
                      }
                      className="block w-full p-2 border border-gray-300 rounded-md text-left flex items-center justify-between text-lg"
                    >
                      <span className="truncate">
                        {editedSupplements[item.supplement._id]?.frequency ||
                          item.frequency ||
                          "Select Frequency"}
                      </span>
                      <ChevronDownIcon className="w-5 h-5 text-gray-600 ml-2" />
                    </button>
                    {openDropdown === `${item.supplement._id}-frequency` && (
                      <div
                        ref={dropdownRef}
                        className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-auto z-10"
                      >
                        {["daily", "weekly", "bi-weekly", "monthly"].map(
                          (option, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                selectOption(
                                  item.supplement._id,
                                  "frequency",
                                  option
                                )
                              }
                              className="block w-full p-2 text-left text-sm hover:bg-gray-100"
                            >
                              {option}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-gray-700 text-sm font-medium">
                      Time
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        toggleDropdown(item.supplement._id, "time")
                      }
                      className="block w-full p-2 border border-gray-300 rounded-md text-left flex items-center justify-between text-lg"
                    >
                      <span className="truncate">
                        {editedSupplements[item.supplement._id]?.time ||
                          item.time ||
                          "Select Time"}
                      </span>
                      <ChevronDownIcon className="w-5 h-5 text-gray-600 ml-2" />
                    </button>
                    {openDropdown === `${item.supplement._id}-time` && (
                      <div
                        ref={dropdownRef}
                        className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-auto z-10"
                      >
                        {["morning", "noon", "evening"].map((option, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              selectOption(item.supplement._id, "time", option)
                            }
                            className="block w-full p-2 text-left text-sm hover:bg-gray-100"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {Object.keys(editedSupplements).some(
                    (id) =>
                      editedSupplements[id]?.dosage !==
                      personalSupplements.find((p) => p.supplement._id === id)
                        ?.dosage
                  ) && (
                    <button
                      onClick={() => handleSave(item.supplement._id)} // Make sure to pass the correct supplementId
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No supplements added to your plan yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSupplementPage;
