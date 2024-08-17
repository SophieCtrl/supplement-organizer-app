import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
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
        const response = await axios.get(`/api/users/profile`);
        setPersonalSupplements(response.data.personal_supplements);
      } catch (error) {
        console.error("Error fetching personal supplements", error);
      }
    };

    fetchPersonalSupplements();
  }, []);

  const handleInputChange = (supplementId, field, value) => {
    setEditedSupplements((prev) => ({
      ...prev,
      [supplementId]: {
        ...prev[supplementId],
        [field]: value,
      },
    }));
    setChangedSupplements((prev) => new Set(prev.add(supplementId)));
  };

  const handleSave = async (supplementId) => {
    try {
      const response = await axios.put(
        `/api/users/supplements/${supplementId}`,
        editedSupplements[supplementId] // Pass only the edited fields
      );
      // Refetch the updated supplements
      const fetchResponse = await axios.get(`/api/users/profile`);
      setPersonalSupplements(fetchResponse.data.personal_supplements);
      setEditedSupplements((prev) => ({
        ...prev,
        [supplementId]: {},
      }));
      setChangedSupplements((prev) => {
        const updated = new Set(prev);
        updated.delete(supplementId);
        return updated;
      });
    } catch (error) {
      console.error("Error updating supplement:", error);
    }
  };

  const handleDelete = async (supplementId) => {
    try {
      await axios.delete(`/api/users/supplements/${supplementId}`);
      // Remove the deleted supplement from the state
      setPersonalSupplements((prev) =>
        prev.filter((item) => item._id !== supplementId)
      );
    } catch (error) {
      console.error("Error deleting supplement:", error);
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
    const value = e.target.value;
    if (value === "") {
      handleInputChange(supplementId, "dosage", "");
    } else {
      handleInputChange(supplementId, "dosage", Number(value));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 py-20">
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          My Supplements
        </h2>
        <div className="space-y-4">
          {personalSupplements.length > 0 ? (
            personalSupplements.map((item) => (
              <div key={item._id} className="bg-white p-4 shadow rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {item.supplement ? (
                    <>
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
                            editedSupplements[item._id]?.dosage !== undefined
                              ? editedSupplements[item._id].dosage
                              : item.dosage
                          }
                          onChange={(e) => handleDosageChange(e, item._id)}
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
                          onClick={() => toggleDropdown(item._id, "frequency")}
                          className="block w-full p-2 border border-gray-300 rounded-md text-left flex items-center justify-between text-lg"
                        >
                          <span className="truncate">
                            {editedSupplements[item._id]?.frequency ||
                              item.frequency ||
                              "Select Frequency"}
                          </span>
                          <ChevronDownIcon className="w-5 h-5 text-gray-600 ml-2" />
                        </button>
                        {openDropdown === `${item._id}-frequency` && (
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
                                    selectOption(item._id, "frequency", option)
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
                          onClick={() => toggleDropdown(item._id, "time")}
                          className="block w-full p-2 border border-gray-300 rounded-md text-left flex items-center justify-between text-lg"
                        >
                          <span className="truncate">
                            {editedSupplements[item._id]?.time ||
                              item.time ||
                              "Select Time"}
                          </span>
                          <ChevronDownIcon className="w-5 h-5 text-gray-600 ml-2" />
                        </button>
                        {openDropdown === `${item._id}-time` && (
                          <div
                            ref={dropdownRef}
                            className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-auto z-10"
                          >
                            {["morning", "noon", "evening"].map(
                              (option, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() =>
                                    selectOption(item._id, "time", option)
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
                      <div className="flex justify-end lg:justify-center items-center">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                      {changedSupplements.has(item._id) && (
                        <button
                          onClick={() => handleSave(item._id)} // Ensure the correct ID is used
                          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                      )}
                    </>
                  ) : (
                    <div>
                      <p className="text-red-500">
                        Supplement data is missing.
                      </p>
                    </div>
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
