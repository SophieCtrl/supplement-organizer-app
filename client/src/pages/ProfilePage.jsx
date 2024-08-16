import { useState, useEffect, useContext } from "react";
import axios from "../axiosInstance";
import { AuthContext } from "../context/auth.context";
import { Navigate, useLocation } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    nutritionalType: "",
    goals: [],
    symptoms: [],
  });
  const [dropdownType, setDropdownType] = useState(null);
  const [goalOptions, setGoalOptions] = useState([]);
  const [symptomOptions, setSymptomOptions] = useState([]);
  const [nutritionalTypeOptions, setNutritionalTypeOptions] = useState([]);
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          userResponse,
          goalsResponse,
          symptomsResponse,
          nutritionalTypesResponse,
        ] = await Promise.all([
          axios.get("/api/users/profile"),
          fetch("/data/goals.json").then((res) => res.json()),
          fetch("/data/symptoms.json").then((res) => res.json()),
          fetch("/data/nutritionalTypes.json").then((res) => res.json()),
        ]);

        setUser(userResponse.data);
        setFormData({
          height: userResponse.data.height || "",
          weight: userResponse.data.weight || "",
          age: userResponse.data.age || "",
          nutritionalType: userResponse.data.nutritionalType || "",
          goals: userResponse.data.goals || [],
          symptoms: userResponse.data.symptoms || [],
        });
        setGoalOptions(goalsResponse);
        setSymptomOptions(symptomsResponse);
        setNutritionalTypeOptions(nutritionalTypesResponse);
      } catch (err) {
        setError("Failed to fetch user profile or options.");
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isLoggedIn && !isLoading) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddItem = (item) => {
    if (dropdownType === "goals" || dropdownType === "symptoms") {
      setFormData((prevData) => {
        const isAlreadySelected = prevData[dropdownType].includes(item);
        const updatedItems = isAlreadySelected
          ? prevData[dropdownType].filter((i) => i !== item)
          : [...prevData[dropdownType], item];
        return { ...prevData, [dropdownType]: updatedItems };
      });
    } else if (dropdownType === "nutritionalType") {
      setFormData((prevData) => ({
        ...prevData,
        nutritionalType: item,
      }));
    }
    setDropdownType("");
  };

  const handleRemoveItem = (item, field) => {
    if (Array.isArray(formData[field])) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: prevData[field].filter((i) => i !== item),
      }));
    } else {
      console.error(`Invalid field: ${field}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/users/profile", formData);
      setUser({ ...user, ...formData });
      setEditable(false);
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 py-20">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Profile</h2>
        {error && (
          <div className="mb-4 text-red-600 font-semibold">{error}</div>
        )}
        {user ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <div>
                <label className="block text-gray-700 font-medium">
                  Height
                </label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  disabled={!editable}
                  className="mt-1 block max-w-xs border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  disabled={!editable}
                  className="mt-1 block max-w-xs border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Age</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={!editable}
                  className="mt-1 block max-w-xs border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Nutritional Type
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nutritionalType"
                    value={formData.nutritionalType}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        nutritionalType: e.target.value,
                      }))
                    }
                    onClick={() => setDropdownType("nutritionalType")}
                    disabled={!editable}
                    className="mt-1 block max-w-xs border border-gray-300 rounded-md p-2 cursor-pointer"
                    placeholder="Select Nutritional Type"
                  />
                  {dropdownType === "nutritionalType" && (
                    <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full">
                      {nutritionalTypeOptions.map((option, index) => (
                        <li
                          key={index}
                          className={`p-2 cursor-pointer ${
                            formData.nutritionalType === option
                              ? "bg-gray-100"
                              : ""
                          }`}
                          onClick={() => {
                            setFormData((prevData) => ({
                              ...prevData,
                              nutritionalType: option,
                            }));
                            setDropdownType(null);
                          }}
                        >
                          {formData.nutritionalType === option ? (
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white mr-2">
                              ✓
                            </span>
                          ) : null}
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Goals</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.goals.map((goal, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-400 flex items-center"
                    >
                      {goal}
                      {editable && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(goal, "goals")}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {editable && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownType("goals")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Add Goal
                    </button>
                    {dropdownType === "goals" && (
                      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-60 overflow-y-auto mb-4">
                        {goalOptions.map((option, index) => (
                          <li
                            key={index}
                            className={`p-2 cursor-pointer ${
                              formData.goals.includes(option)
                                ? "bg-gray-100"
                                : ""
                            }`}
                            onClick={() => handleAddItem(option)}
                          >
                            {formData.goals.includes(option) ? (
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white mr-2">
                                ✓
                              </span>
                            ) : null}
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Symptoms
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-400 flex items-center"
                    >
                      {symptom}
                      {editable && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(symptom, "symptoms")}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {editable && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownType("symptoms")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Add Symptom
                    </button>
                    {dropdownType === "symptoms" && (
                      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-60 overflow-y-auto">
                        {symptomOptions.map((option, index) => (
                          <li
                            key={index}
                            className={`p-2 cursor-pointer ${
                              formData.symptoms.includes(option)
                                ? "bg-gray-100"
                                : ""
                            }`}
                            onClick={() => handleAddItem(option)}
                          >
                            {formData.symptoms.includes(option) ? (
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white mr-2">
                                ✓
                              </span>
                            ) : null}
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditable(!editable)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {editable ? "Cancel" : "Edit"}
                </button>
                {editable && (
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </form>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
