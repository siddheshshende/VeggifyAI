import React, { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoalLogs from "./GoalLogs";

// Helper function to log goal activities
const logGoalActivity = async (uid, action, goalId, additionalData = {}) => {
  if (!uid) return;

  try {
    await addDoc(collection(db, "GoalLogs"), {
      userId: uid,
      action,
      goalId,
      timestamp: serverTimestamp(),
      ...additionalData,
    });
  } catch (error) {
    console.error("Error logging goal activity:", error);
  }
};

function GoalsTracking() {
  const [uid, setUid] = useState(null);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalType, setGoalType] = useState("Recipe");
  const [targetAmount, setTargetAmount] = useState(1);
  const [frequencyValue, setFrequencyValue] = useState(1);
  const [frequencyPeriod, setFrequencyPeriod] = useState("week");
  const [deadline, setDeadline] = useState("");
  const [recipeId, setRecipeId] = useState("");
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // User health data
  const [userAllergies, setUserAllergies] = useState([]);
  const [userChronicDiseases, setUserChronicDiseases] = useState([]);

  // Goal types
  const goalTypes = ["Recipe", "Nutrition", "Health", "Other"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        fetchGoals(user.uid);
        fetchUserHealthData(user.uid);
      } else {
        setUid(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserHealthData = async (userId) => {
    try {
      const userDocRef = doc(db, "Demographics", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserAllergies(data.Allergies || []);
        setUserChronicDiseases(data.ChronicDiseases || []);
      }
    } catch (error) {
      console.error("Error fetching user health data:", error);
    }
  };

  const fetchGoals = async (userId) => {
    try {
      setIsLoading(true);
      const goalsDocRef = doc(db, "GoalsTracking", userId);
      const goalsDoc = await getDoc(goalsDocRef);

      if (goalsDoc.exists()) {
        const data = goalsDoc.data();
        setGoals(data.goals || []);
      } else {
        setGoals([]);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Failed to fetch goals.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setGoalTitle("");
    setGoalDescription("");
    setGoalType("Recipe");
    setTargetAmount(1);
    setFrequencyValue(1);
    setFrequencyPeriod("week");
    setDeadline("");
    setRecipeId("");
    setEditingGoalId(null);
    setShowForm(false);
  };

  const today = new Date().toISOString().split("T")[0];

  const handleAddGoal = async (e) => {
    e.preventDefault();

    if (deadline && new Date(deadline) < new Date()) {
      toast.error("Deadline must be in the future");
      return;
    }

    if (!goalTitle.trim()) {
      toast.error("Please enter a goal title.");
      return;
    }

    try {
      const deadlineDate = deadline ? new Date(deadline) : null;
      const newGoal = {
        title: goalTitle.trim(),
        description: goalDescription.trim(),
        type: goalType,
        targetAmount: parseInt(targetAmount),
        frequency: {
          value: parseInt(frequencyValue),
          period: frequencyPeriod,
        },
        deadline: deadlineDate,
        recipeId: recipeId.trim(),
        progress: 0,
        completed: false,
        healthFactors: {
          allergies: userAllergies,
          chronicDiseases: userChronicDiseases,
        },
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      let updatedGoals;

      if (editingGoalId) {
        updatedGoals = goals.map((goal) =>
          goal.id === editingGoalId
            ? {
                ...newGoal,
                id: editingGoalId,
                createdAt: goal.createdAt,
              }
            : goal
        );
        toast.success("Goal updated successfully!");
        await logGoalActivity(uid, "edited", editingGoalId, {
          newTitle: goalTitle.trim(),
          newProgress: newGoal.progress,
        });
      } else {
        updatedGoals = [...goals, newGoal];
        toast.success("New goal added!");
        await logGoalActivity(uid, "created", newGoal.id, {
          title: newGoal.title,
          targetAmount: newGoal.targetAmount,
        });
      }

      setGoals(updatedGoals);
      const goalsDocRef = doc(db, "GoalsTracking", uid);
      await setDoc(
        goalsDocRef,
        {
          goals: updatedGoals,
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );

      resetForm();
    } catch (error) {
      console.error("Error adding/updating goal:", error);
      toast.error("Failed to save goal.");
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const goalToDelete = goals.find((goal) => goal.id === goalId);
      const updatedGoals = goals.filter((goal) => goal.id !== goalId);
      setGoals(updatedGoals);

      const goalsDocRef = doc(db, "GoalsTracking", uid);
      await setDoc(goalsDocRef, { goals: updatedGoals }, { merge: true });

      await logGoalActivity(uid, "deleted", goalId, {
        title: goalToDelete.title,
        progress: goalToDelete.progress,
      });
      toast.success("Goal deleted successfully!");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal.");
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoalId(goal.id);
    setGoalTitle(goal.title);
    setGoalDescription(goal.description || "");
    setGoalType(goal.type);
    setTargetAmount(goal.targetAmount);
    setFrequencyValue(goal.frequency.value);
    setFrequencyPeriod(goal.frequency.period);

    let deadlineValue = "";
    if (goal.deadline) {
      try {
        if (goal.deadline.toDate) {
          deadlineValue = goal.deadline.toDate().toISOString().split("T")[0];
        }
        else if (goal.deadline.seconds) {
          deadlineValue = new Date(goal.deadline.seconds * 1000)
            .toISOString()
            .split("T")[0];
        }
        else if (goal.deadline instanceof Date) {
          deadlineValue = goal.deadline.toISOString().split("T")[0];
        }
      } catch (error) {
        console.warn("Invalid deadline format:", goal.deadline, error);
      }
    }
    setDeadline(deadlineValue);

    setRecipeId(goal.recipeId || "");
    setShowForm(true);
  };

  const updateGoalProgress = async (goalId, newProgress) => {
    try {
      const goal = goals.find((g) => g.id === goalId);
      const completed = newProgress >= goal.targetAmount;

      const updatedGoals = goals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            progress: newProgress,
            completed,
            lastUpdated: new Date().toISOString(),
          };
        }
        return goal;
      });

      setGoals(updatedGoals);

      const goalsDocRef = doc(db, "GoalsTracking", uid);
      await setDoc(
        goalsDocRef,
        {
          goals: updatedGoals,
          lastUpdatedServer: serverTimestamp(),
        },
        { merge: true }
      );

      await logGoalActivity(
        uid,
        completed ? "completed" : "progress_update",
        goalId,
        {
          newProgress,
          targetAmount: goal.targetAmount,
        }
      );

      toast.success("Progress updated!");
    } catch (error) {
      console.error("Error updating goal progress:", error);
      setGoals(goals);
      toast.error("Failed to update progress.");
    }
  };

  const calculateGoalStatus = (goal) => {
    if (goal.completed) return "Completed";

    if (goal.deadline) {
      const deadlineDate = goal.deadline.toDate 
        ? goal.deadline.toDate() 
        : goal.deadline.seconds 
          ? new Date(goal.deadline.seconds * 1000)
          : new Date(goal.deadline);
      
      const currentDate = new Date();
      const daysRemaining = Math.ceil(
        (deadlineDate - currentDate) / (1000 * 60 * 60 * 24)
      );

      if (daysRemaining <= 0) return "Overdue";
      if (daysRemaining <= 2) return "Urgent";
      if (daysRemaining <= 7) return "Approaching";
    }

    const progressPercentage = Math.round(
      (goal.progress / goal.targetAmount) * 100
    );
    if (progressPercentage >= 75) return "On Track";
    if (progressPercentage >= 25) return "In Progress";

    return "Not Started";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Overdue":
        return "bg-red-200 text-red-800";
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "Approaching":
        return "bg-yellow-200 text-yellow-800";
      case "On Track":
        return "bg-blue-200 text-blue-800";
      case "In Progress":
        return "bg-purple-100 text-purple-800";
      case "Not Started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";

    try {
      if (deadline.toDate) {
        return deadline.toDate().toLocaleDateString();
      }
      else if (deadline.seconds) {
        return new Date(deadline.seconds * 1000).toLocaleDateString();
      }
      else if (deadline instanceof Date) {
        return deadline.toLocaleDateString();
      }
      else if (typeof deadline === "string") {
        return new Date(deadline).toLocaleDateString();
      }
      return "Invalid date format";
    } catch (error) {
      console.error("Error formatting deadline:", error);
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading your goals...
      </div>
    );
  }

  if (!uid) {
    return (
      <div className="flex justify-center items-center h-64">
        Please log in to view your goals.
      </div>
    );
  }

  return (
    <div className="3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4 py-10">
      <div className="font-bold text-3xl sm:text-4xl block sm:flex justify-between items-center">
        <span className="block">Goals Tracking</span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#2E8B57] text-white text-sm sm:text-base font-semibold py-2 px-4 rounded-lg hover:bg-[#1e6b47] transition duration-300">
          {showForm ? "Cancel" : "Add New Goal"}
        </button>
      </div>

      {showForm && (
        <div className="mt-6 p-6 border rounded-md shadow-sm bg-white">
          <h3 className="text-xl font-medium mb-4">
            {editingGoalId ? "Edit Goal" : "Create New Goal"}
          </h3>
          <form
            onSubmit={handleAddGoal}
            className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Goal Title*</label>
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="What do you want to achieve?"
                className="border p-2 rounded"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1  font-medium">Goal Type</label>
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                className="border p-2 rounded ">
                {goalTypes.map((type) => (
                  <option key={type} value={type} className="capitalize">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 font-medium">Description</label>
              <textarea
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                placeholder="Add details about your goal"
                className="border p-2 rounded h-24"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium">Target Amount</label>
              <input
                type="number"
                min="1"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium">Frequency</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={frequencyValue}
                  onChange={(e) => setFrequencyValue(e.target.value)}
                  className="border p-2 rounded w-1/3"
                />
                <select
                  value={frequencyPeriod}
                  onChange={(e) => setFrequencyPeriod(e.target.value)}
                  className="border p-2 rounded ">
                  <option value="day">per day</option>
                  <option value="week">per week</option>
                  <option value="month">per month</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium">Deadline (Optional)</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={today}
                className="border p-2 rounded"
              />
              {deadline && new Date(deadline) < new Date(today) && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a future date
                </p>
              )}
            </div>

            {/* {goalType === "Recipe" && (
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Recipe ID (Optional)</label>
                <input
                  type="text"
                  value={recipeId}
                  onChange={(e) => setRecipeId(e.target.value)}
                  placeholder="Connect to a specific recipe"
                  className="border p-2 rounded"
                />
              </div>
            )} */}

            {(userAllergies.length > 0 || userChronicDiseases.length > 0) && (
              <div className="md:col-span-2 p-4 bg-blue-50 rounded-md mt-2">
                <h4 className="text-sm font-medium mb-2">
                  Your Health Factors (Will be considered for this goal)
                </h4>

                {userAllergies.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm font-medium">Allergies: </span>
                    <span className="text-sm">{userAllergies.join(", ")}</span>
                  </div>
                )}

                {userChronicDiseases.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">
                      Chronic Conditions:{" "}
                    </span>
                    <span className="text-sm">
                      {userChronicDiseases.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition duration-300">
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#2E8B57] text-white px-6 py-2 rounded hover:bg-[#1e6b47] transition duration-300">
                {editingGoalId ? "Update Goal" : "Create Goal"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        {goals.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed">
            <h3 className="text-xl font-medium text-gray-600">No goals yet</h3>
            <p className="text-gray-500 mt-2">
              Create your first goal to start tracking your progress.
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-[#2E8B57] text-white px-4 py-2 rounded-md hover:bg-[#1e6b47] transition duration-300">
                Create First Goal
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const status = calculateGoalStatus(goal);
              const statusColor = getStatusColor(status);
              const progressPercentage = Math.min(
                Math.round((goal.progress / goal.targetAmount) * 100),
                100
              );

              return (
                <div
                  key={goal.id}
                  className={`border rounded-lg overflow-hidden ${
                    goal.completed
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200"
                  }`}>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium">{goal.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {status}
                      </span>
                    </div>

                    {goal.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {goal.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                      <span>
                        Progress: {goal.progress} of {goal.targetAmount}
                      </span>
                      <span>{progressPercentage}%</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className={`h-2 rounded-full ${
                          goal.completed ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${progressPercentage}%` }}></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium block">Type:</span>
                        <span>{goal.type}</span>
                      </div>
                      <div>
                        <span className="font-medium block">Frequency:</span>
                        <span>
                          {goal.frequency.value} per {goal.frequency.period}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium block">Deadline:</span>
                        <span>{formatDeadline(goal.deadline)}</span>
                      </div>
                      {goal.recipeId && (
                        <div>
                          <span className="font-medium block">Recipe ID:</span>
                          <span className="truncate">{goal.recipeId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateGoalProgress(
                            goal.id,
                            Math.max(0, goal.progress - 1)
                          )
                        }
                        className="text-red-600 hover:text-red-800 font-bold"
                        disabled={goal.progress <= 0}
                        title="Decrease Progress">
                        -
                      </button>
                      <button
                        onClick={() =>
                          updateGoalProgress(goal.id, goal.progress + 1)
                        }
                        className="text-green-600 hover:text-green-800 font-bold"
                        disabled={goal.completed}
                        title="Increase Progress">
                        +
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="text-blue-600 hover:text-blue-800">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <GoalLogs uid={uid} />
    </div>
  );
}

export default GoalsTracking;