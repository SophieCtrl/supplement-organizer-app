import React, { useState } from "react";

const BrandForm = ({ onAddBrand }) => {
  const [brandName, setBrandName] = useState("");
  const [form, setForm] = useState("pills");
  const [size, setSize] = useState("180 pills");
  const [dosageMg, setDosageMg] = useState(0);
  const [additionalIngredients, setAdditionalIngredients] = useState([]);
  const [vegan, setVegan] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (brandName.trim()) {
      onAddBrand({
        name: brandName,
        form,
        size,
        dosage_mg: dosageMg,
        additional_ingrediens: additionalIngredients,
        vegan,
      });
      setBrandName("");
      setForm("pills");
      setSize("180 pills");
      setDosageMg(0);
      setAdditionalIngredients([]);
      setVegan(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 mt-4"
    >
      <div className="mb-4">
        <label
          htmlFor="brandName"
          className="block text-gray-700 font-bold mb-2"
        >
          Brand Name:
        </label>
        <input
          type="text"
          id="brandName"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="form" className="block text-gray-700 font-bold mb-2">
          Form:
        </label>
        <select
          id="form"
          value={form}
          onChange={(e) => setForm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
        >
          <option value="pills">Pills</option>
          <option value="capsules">Capsules</option>
          <option value="powder">Powder</option>
          <option value="drops">Drops</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="size" className="block text-gray-700 font-bold mb-2">
          Size:
        </label>
        <input
          type="text"
          id="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="dosageMg"
          className="block text-gray-700 font-bold mb-2"
        >
          Portion per daily dose (mg):
        </label>
        <input
          type="number"
          id="dosageMg"
          value={dosageMg}
          onChange={(e) => setDosageMg(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="additionalIngredients"
          className="block text-gray-700 font-bold mb-2"
        >
          Additional Ingredients:
        </label>
        <input
          type="text"
          id="additionalIngredients"
          value={additionalIngredients}
          onChange={(e) => setAdditionalIngredients(e.target.value.split(","))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="vegan" className="block text-gray-700 font-bold mb-2">
          Vegan:
        </label>
        <input
          type="checkbox"
          id="vegan"
          checked={vegan}
          onChange={(e) => setVegan(e.target.checked)}
          className="mr-2 leading-tight"
        />
        <span className="text-gray-700">Is Vegan</span>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Brand
      </button>
    </form>
  );
};

export default BrandForm;
