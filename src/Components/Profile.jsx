import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase"; // Ensure you have initialized Firebase Authentication
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const [name1, setName] = useState("");
  const [gender1, setGender] = useState("");
  const [height1, setHeight] = useState(0);
  const [weight1, setWeight] = useState(0);
  const [age1, setAge] = useState(0);
  const [uid, setUid] = useState(null);
  const [docExists, setDocExists] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [allergyToggle, setAllergyToggle] = useState(false);
  const [allergyInput, setAllergyInput] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [chronicDiseases, setChronicDiseases] = useState([]);

  // Add validation errors state
  const [errors, setErrors] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
  });

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleAllergyToggle = () => {
    setAllergyToggle(!allergyToggle);
  };

  const handleAllergyInputChange = (e) => {
    setAllergyInput(e.target.value);
  };

  const handleAddAllergy = async () => {
    if (allergyInput.trim()) {
      // Normalize to lowercase for comparison but store original input
      const normalizedInput = allergyInput.trim().toLowerCase();
      const isDuplicate = allergies.some(
        (allergy) => allergy.toLowerCase() === normalizedInput
      );

      if (isDuplicate) {
        toast.warning("This allergy has already been added.");
        return;
      }

      const updatedAllergies = [...allergies, allergyInput.trim()]; // Create the updated list here
      setAllergies(updatedAllergies);
      setAllergyInput("");
      setAllergyToggle(false);

      try {
        const userDocRef = doc(db, "Demographics", uid);
        const userDoc = await getDoc(userDocRef);

        const data = {
          Allergies: updatedAllergies, // Use the updated list here
        };

        if (userDoc.exists()) {
          await setDoc(userDocRef, data, { merge: true }); // Merge updates existing fields without overwriting the entire document
          toast.success("Details updated successfully!");
        } else {
          await setDoc(userDocRef, data);
          toast.success("Details submitted successfully!");
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while submitting your details.");
      }
    }
  };

  const handleRemoveAllergy = async (indexToRemove) => {
    try {
      const updatedAllergies = allergies.filter(
        (_, index) => index !== indexToRemove
      );
      setAllergies(updatedAllergies);

      const userDocRef = doc(db, "Demographics", uid);
      await setDoc(
        userDocRef,
        { Allergies: updatedAllergies },
        { merge: true }
      );
      toast.success("Allergy removed successfully!");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while removing the allergy.");
    }
  };

  const handleAddChronicDisease = async (disease) => {
    const updatedChronicDiseases = [...chronicDiseases, disease]; // Create the updated list here
    setChronicDiseases(updatedChronicDiseases);
    setDropdownVisible(false);

    try {
      const userDocRef = doc(db, "Demographics", uid);
      const userDoc = await getDoc(userDocRef);

      const data = {
        ChronicDiseases: updatedChronicDiseases, // Use the updated list here
      };

      if (userDoc.exists()) {
        await setDoc(userDocRef, data, { merge: true }); // Merge updates existing fields without overwriting the entire document
        toast.success("Details updated successfully!");
      } else {
        await setDoc(userDocRef, data);
        toast.success("Details submitted successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while submitting your details.");
    }
  };

  const handleRemoveChronicDisease = async (indexToRemove) => {
    try {
      const updatedChronicDiseases = chronicDiseases.filter(
        (_, index) => index !== indexToRemove
      );
      setChronicDiseases(updatedChronicDiseases);

      const userDocRef = doc(db, "Demographics", uid);
      await setDoc(
        userDocRef,
        { ChronicDiseases: updatedChronicDiseases },
        { merge: true }
      );
      toast.success("Disease removed successfully!");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while removing the disease.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        checkUserDoc(user.uid);
        fetchUserDetails(user.uid);
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const checkUserDoc = async (userId) => {
    const userDocRef = doc(db, "Demographics", userId);
    const userDoc = await getDoc(userDocRef);
    setDocExists(userDoc.exists());
  };

  const fetchUserDetails = async (userId) => {
    try {
      const userDocRef = doc(db, "Demographics", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setName(data.Name);
        setGender(data.Gender);
        setHeight(data.Height);
        setWeight(data.Weight);
        setAge(data.Age);
        setAllergies(data.Allergies || []);
        setChronicDiseases(data.ChronicDiseases || []);
        setDocExists(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while fetching your details.");
    }
  };

  // Add validation function
  const validateForm = () => {
    const newErrors = {
      name: !name1.trim() ? "Please complete this required field." : "",
      age: !age1 || age1 <= 0 ? "Please complete this required field." : "",
      gender: !gender1.trim() ? "Please complete this required field." : "",
      height:
        !height1 || height1 <= 0 ? "Please complete this required field." : "",
      weight:
        !weight1 || weight1 <= 0 ? "Please complete this required field." : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Add input change handlers with error clearing
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleAgeChange = (e) => {
    setAge(Number(e.target.value));
    if (errors.age) {
      setErrors((prev) => ({ ...prev, age: "" }));
    }
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: "" }));
    }
  };

  const handleHeightChange = (e) => {
    setHeight(Number(e.target.value));
    if (errors.height) {
      setErrors((prev) => ({ ...prev, height: "" }));
    }
  };

  const handleWeightChange = (e) => {
    setWeight(Number(e.target.value));
    if (errors.weight) {
      setErrors((prev) => ({ ...prev, weight: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!uid) {
      toast.error("You must be logged in to submit details.");
      return;
    }

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      const userDocRef = doc(db, "Demographics", uid);
      const userDoc = await getDoc(userDocRef);

      const data = {
        Name: name1,
        Gender: gender1,
        Height: height1,
        Weight: weight1,
        Age: age1,
        allergies: allergies,
        ChronicDiseases: chronicDiseases,
      };

      if (userDoc.exists()) {
        await setDoc(userDocRef, data, { merge: true }); // Merge updates existing fields without overwriting the entire document
        toast.success("Details updated successfully!");
      } else {
        await setDoc(userDocRef, data);
        toast.success("Details submitted successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while submitting your details.");
    }
  };

  return (
    <section className="py-12 sm:py-30">
      <div className="3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4 ">
        <div>
          <div className="font-bold text-3xl sm:text-4xl ">Profile Details</div>
          <div className="max-w-[800px] mx-auto mt-[5vh] border rounded-lg px-5  py-[5vh] m-4">
            {/* Name and Age Row */}
            <div className="flex flex-col sm:flex-row justify-between gap-5 sm:gap-[30px] mb-5">
              <div className="form-group w-full sm:w-1/2">
                <label
                  htmlFor="name"
                  className="form-label block mb-[7px] font-medium">
                  Name*
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Type Here"
                  className={`form-control w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  value={name1}
                  onChange={handleNameChange}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.name}
                  </span>
                )}
              </div>
              <div className="form-group w-full sm:w-1/2">
                <label
                  htmlFor="age"
                  className="form-label block mb-[7px] font-medium">
                  Age*
                </label>
                <input
                  type="number"
                  id="age"
                  placeholder="Type Here"
                  className={`form-control w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg ${
                    errors.age ? "border-red-500" : ""
                  }`}
                  value={age1 || ""}
                  onChange={handleAgeChange}
                />
                {errors.age && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.age}
                  </span>
                )}
              </div>
            </div>

            {/* Weight and Height Row */}
            <div className="flex flex-col sm:flex-row justify-between gap-5 sm:gap-[30px] mb-5">
              <div className="form-group w-full sm:w-1/2">
                <label
                  htmlFor="weight"
                  className="form-label block mb-[7px] font-medium">
                  Weight (kg)*
                </label>
                <input
                  type="number"
                  id="weight"
                  placeholder="Type Here"
                  className={`form-control w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg ${
                    errors.weight ? "border-red-500" : ""
                  }`}
                  value={weight1 || ""}
                  onChange={handleWeightChange}
                />
                {errors.weight && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.weight}
                  </span>
                )}
              </div>
              <div className="form-group w-full sm:w-1/2">
                <label
                  htmlFor="height"
                  className="form-label block mb-[7px] font-medium">
                  Height (cm)*
                </label>
                <input
                  type="number"
                  id="height"
                  placeholder="Type Here"
                  className={`form-control w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg ${
                    errors.height ? "border-red-500" : ""
                  }`}
                  value={height1 || ""}
                  onChange={handleHeightChange}
                />
                {errors.height && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.height}
                  </span>
                )}
              </div>
            </div>

            {/* Gender Field */}
            <div className="form-group mb-5">
              <label
                htmlFor="gender"
                className="form-label block mb-[7px] font-medium">
                Gender*
              </label>
              <input
                type="text"
                id="gender"
                placeholder="Type Here"
                className={`form-control w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg ${
                  errors.gender ? "border-red-500" : ""
                }`}
                value={gender1}
                onChange={handleGenderChange}
              />
              {errors.gender && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.gender}
                </span>
              )}
            </div>

            <div className="text-center mt-[50px]">
              <button
                className="bg-black text-white hover:bg-gray-800 transition ease-in px-4 sm:px-8 py-4 rounded-lg font-medium text-sm sm:text-base"
                onClick={handleSubmit}>
                {docExists ? "Update Details" : "Submit Details"}
              </button>
            </div>
          </div>
        </div>

        {/* Chronic Diseases Section */}
        <div className="">
          <div className="flex justify-content pt-[5vh] text-3xl sm:text-4xl font-bold gap-4">
            <div className="">Chronic Diseases</div>
            <div className="flex flex-col gap-1 relative">
              <button
                onClick={toggleDropdown}
                className="text-3xl sm:text-4xl font-bold cursor-pointer"
                type="button">
                +
              </button>
            </div>
          </div>

          {dropdownVisible && (
            <div className="mt-4 max-w-[800px] mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  "Asthma",
                  "Diabetes",
                  "Heart Disease",
                  "Hypertension",
                  "Arthritis",
                  "Obesity",
                ].map((disease) => (
                  <button
                    key={disease}
                    onClick={() => {
                      if (!chronicDiseases.includes(disease)) {
                        handleAddChronicDisease(disease);
                      }
                    }}
                    disabled={chronicDiseases.includes(disease)}
                    className={`px-4 py-2 border rounded-full text-sm ${
                      chronicDiseases.includes(disease)
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-white hover:bg-gray-100 cursor-pointer"
                    }`}>
                    {disease}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border border-gray-300 p-4 m-4 max-w-[800px] mx-auto rounded-lg">
            {chronicDiseases.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {chronicDiseases.map((disease, index) => (
                  <li key={index} className="flex items-center">
                    <span className="px-4 py-2 bg-gray-100 rounded-full">
                      {disease}
                      <button
                        onClick={() => handleRemoveChronicDisease(index)}
                        className="ml-2 text-red-500 font-bold">
                        ×
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No chronic diseases added</p>
            )}
          </div>
        </div>

        {/* Allergies Section */}
        <div className="">
          <div className="flex items-center justify-content pt-[5vh] gap-4">
            <div className="text-3xl sm:text-4xl font-bold">Allergies</div>
            <div className="hidden sm:block">
              {" "}
              {/* Desktop version - hidden on mobile */}
              {!allergyToggle ? (
                <button
                  onClick={handleAllergyToggle}
                  className="text-3xl sm:text-4xl font-bold cursor-pointer">
                  +
                </button>
              ) : (
                <div className="flex flex-row gap-2 w-full max-w-[800px]">
                  <input
                    placeholder="Enter Food Item"
                    value={allergyInput}
                    onChange={handleAllergyInputChange}
                    className="bg-gray-100 px-4 py-2 rounded-full border flex-grow"
                    onKeyPress={(e) => e.key === "Enter" && handleAddAllergy()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddAllergy}
                      className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                      Add
                    </button>
                    <button
                      onClick={() => setAllergyToggle(false)}
                      className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Mobile toggle button - hidden on desktop */}
            <button
              onClick={handleAllergyToggle}
              className="text-3xl sm:text-4xl font-bold cursor-pointer sm:hidden">
              {allergyToggle ? "−" : "+"}
            </button>
          </div>

          {/* Combined input field that works for both mobile and desktop */}
          {allergyToggle && (
            <div className="sm:hidden mt-4 max-w-[800px] mx-auto">
              {" "}
              {/* Mobile layout */}
              <div className="flex flex-col gap-2 sm:flex-row">
                {" "}
                {/* Responsive layout */}
                <input
                  placeholder="Enter Food Item"
                  value={allergyInput}
                  onChange={handleAllergyInputChange}
                  className="bg-gray-100 px-4 py-2 rounded-full border w-full"
                  onKeyPress={(e) => e.key === "Enter" && handleAddAllergy()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddAllergy}
                    className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex-grow sm:flex-grow-0">
                    Add
                  </button>
                  <button
                    onClick={() => setAllergyToggle(false)}
                    className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors flex-grow sm:flex-grow-0">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="border border-gray-300 p-4 m-4 max-w-[800px] mx-auto rounded-lg">
            {allergies.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {allergies.map((allergy, index) => (
                  <li key={index} className="flex items-center">
                    <span className="px-4 py-2 bg-gray-100 rounded-full">
                      {allergy}
                      <button
                        onClick={() => handleRemoveAllergy(index)}
                        className="ml-2 text-red-500 font-bold hover:text-red-700">
                        ×
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No allergies added</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
