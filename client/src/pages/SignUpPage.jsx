import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const nutritionalTypes = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Omnivore",
  "Paleo",
];

const illnesses = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Chronic Kidney Disease",
  "Asthma",
  "Arthritis",
  "Osteoporosis",
  "Cancer",
  "Digestive Disorders",
  "Depression",
];

const symptoms = [
  "Headaches",
  "Intestinal Problems",
  "Fatigue",
  "Muscle Pain",
  "Joint Pain",
  "Nausea",
  "Insomnia",
  "Skin Issues",
  "Mood Swings",
  "Dizziness",
];

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    age: "",
    nutritionalType: "",
    illnesses: [],
    symptoms: [],
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (name === "illnesses" || name === "symptoms") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: prevState[name].includes(value)
          ? prevState[name].filter((item) => item !== value)
          : [...prevState[name], value],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        formData
      );
      setSuccess("Registration successful! Redirecting to login page...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        {success && <div className="mb-4 text-green-500">{success}</div>}
        {error && <div className="mb-4 text-red-500">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="height">
            Height
          </label>
          <input
            type="text"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="weight">
            Weight
          </label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="age">
            Age
          </label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="nutritionalType">
            Nutritional Type
          </label>
          <select
            id="nutritionalType"
            name="nutritionalType"
            value={formData.nutritionalType}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          >
            <option value="">Select Nutritional Type</option>
            {nutritionalTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="illnesses">
            Illnesses
          </label>
          <select
            id="illnesses"
            name="illnesses"
            multiple
            value={formData.illnesses}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
          >
            {illnesses.map((illness) => (
              <option key={illness} value={illness}>
                {illness}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="symptoms">
            Symptoms
          </label>
          <select
            id="symptoms"
            name="symptoms"
            multiple
            value={formData.symptoms}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
          >
            {symptoms.map((symptom) => (
              <option key={symptom} value={symptom}>
                {symptom}
              </option>
            ))}
          </select>
        </div>

        {success && <div className="mb-4 text-green-500">{success}</div>}
        {error && <div className="mb-4 text-red-500">{error}</div>}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit
        </button>

        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
