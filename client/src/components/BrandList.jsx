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
      <ul className="list-none pl-0 mb-4">
        {brands.map((brand) => (
          <li
            key={brand._id}
            className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 mb-2 text-gray-700"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{brand.brand}</span>
              {brand.vegan && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Vegan
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p>
                  <strong>Form:</strong> {brand.form}
                </p>
                <p>
                  <strong>Size:</strong> {brand.size}
                </p>
              </div>
              <div>
                <p>
                  <strong>Portion per daily dose:</strong> {brand.dosage_mg} mg
                </p>
                <p>
                  <strong>Additional Ingredients:</strong>{" "}
                  {brand.additional_ingrediens.join(", ")}
                </p>
              </div>
            </div>
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
