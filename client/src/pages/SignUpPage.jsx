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

const goals = [
  "Improve Overall Well-being",
  "Emotional Balance",
  "Manage Anxiety",
  "Weight Management",
  "Maternal Health",
  "Restful Sleep",
  "Boost Energy",
  "Stress Relief",
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
  "Fever",
  "Chills",
  "Sweating",
  "Shortness of Breath",
  "Chest Pain",
  "Cough",
  "Sore Throat",
  "Runny Nose",
  "Congestion",
  "Loss of Appetite",
  "Weight Loss",
  "Weight Gain",
  "Digestive Issues",
  "Constipation",
  "Diarrhea",
  "Abdominal Pain",
  "Swelling",
  "Bruising",
  "Rashes",
  "Itching",
  "Memory Problems",
  "Confusion",
  "Tingling Sensation",
  "Numbness",
  "Sensitivity to Light",
  "Sensitivity to Sound",
  "Muscle Weakness",
  "Joint Stiffness",
  "Fainting",
  "Unexplained Pain",
  "Poor Concentration",
  "Loss of Smell",
  "Loss of Taste",
  "Excessive Thirst",
  "Frequent Urination",
  "Dark Urine",
  "Jaundice",
  "Hives",
  "Dry Mouth",
  "Frequent Headaches",
  "Back Pain",
  "Abnormal Heartbeat",
  "Difficulty Swallowing",
  "Sore Muscles",
  "Tremors",
  "Vision Changes",
  "Hearing Loss",
  "Numbness in Extremities",
  "Cramps",
  "Excessive Hunger",
  "Palpitations",
  "Frequent Infections",
  "Unexplained Fever",
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
    goals: [],
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
    } else if (name === "goals" || name === "symptoms") {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 my-8">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>

        {success && <div className="mb-4 text-green-600">{success}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="height"
          >
            Height
          </label>
          <input
            type="text"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="weight"
          >
            Weight
          </label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="age"
          >
            Age
          </label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="nutritionalType"
          >
            Nutritional Type
          </label>
          <select
            id="nutritionalType"
            name="nutritionalType"
            value={formData.nutritionalType}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg"
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
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="goals"
          >
            Goals
          </label>
          <select
            id="goals"
            name="goals"
            multiple
            value={formData.goals}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg"
          >
            {goals.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="symptoms"
          >
            Symptoms
          </label>
          <select
            id="symptoms"
            name="symptoms"
            multiple
            value={formData.symptoms}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg"
          >
            {symptoms.map((symptom) => (
              <option key={symptom} value={symptom}>
                {symptom}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-4 rounded-lg w-full font-semibold shadow-md hover:bg-blue-700"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
