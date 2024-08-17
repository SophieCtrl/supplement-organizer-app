import React, { useState, useEffect } from "react";
import BrandForm from "./BrandForm";
import axiosInstance from "../axiosInstance";

const BrandList = ({ supplementId }) => {
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/supplements/${supplementId}/brands`
        );
        const data = response.data;
        setBrands(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBrands();
  }, [supplementId]);

  const handleAddBrand = async (newBrand) => {
    try {
      const response = await axiosInstance.post(
        `/api/supplements/${supplementId}/brands`,
        newBrand
      );
      const addedBrand = response.data;
      setBrands([...brands, addedBrand]);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Existing Brands:
      </h2>
      <ul className="list-disc pl-5 mb-4">
        {brands.map((brand) => (
          <li
            key={brand.id}
            className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 mb-2 text-gray-700"
          >
            {brand.name}
          </li>
        ))}
      </ul>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add new brand
        </button>
      )}
      {showForm && <BrandForm onAddBrand={handleAddBrand} />}
    </div>
  );
};

export default BrandList;
