import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-toastify";

function GoalLogs({ uid }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  // Fetch goal logs from Firestore
  const fetchGoalLogs = async () => {
    if (!uid) {
      console.log("No UID, skipping fetch");
      return;
    }

    try {
      setIsLoading(true);
      const logsQuery = query(
        collection(db, "GoalLogs"),
        where("userId", "==", uid),
        orderBy("timestamp", "desc"),
        limit(20)
      );

      const querySnapshot = await getDocs(logsQuery);
      
      if (querySnapshot.empty) {
        console.log("No logs found for user");
        setLogs([]);
        return;
      }

      const logsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert Firestore timestamp to JavaScript Date if needed
        let timestamp = data.timestamp;
        if (timestamp && typeof timestamp.toDate === 'function') {
          timestamp = timestamp.toDate();
        }
        return {
          id: doc.id,
          ...data,
          timestamp: timestamp || serverTimestamp(),
        };
      });

      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching goal logs:", error);
      toast.error("Failed to fetch goal logs. Please try again later.");
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Log goal activity
  const logGoalActivity = async (action, goalId, additionalData = {}) => {
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

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";

    try {
      // Handle Firestore Timestamp object
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      }
      // Handle JavaScript Date object
      else if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
      }
      // Handle string timestamp
      else if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleString();
      }
      return "Invalid timestamp";
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Invalid timestamp";
    }
  };

  // Get action display text
  const getActionText = (log) => {
    switch (log.action) {
      case "created":
        return "Created goal";
      case "progress_update":
        return `Updated progress to ${log.newProgress || 0}`;
      case "completed":
        return "Completed goal";
      case "edited":
        return "Edited goal";
      case "deleted":
        return "Deleted goal";
      case "viewed_logs":
        return "Viewed goal logs";
      default:
        return log.action;
    }
  };

  // Get action color
  const getActionColor = (action) => {
    switch (action) {
      case "created":
        return "bg-green-100 text-green-800";
      case "progress_update":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "edited":
        return "bg-yellow-100 text-yellow-800";
      case "deleted":
        return "bg-red-100 text-red-800";
      case "viewed_logs":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    if (showLogs && uid) {
      fetchGoalLogs();
      // Log that the user viewed their logs
      logGoalActivity("viewed_logs", "logs_viewed");
    }
  }, [showLogs, uid]);

  if (!uid) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        {/* <h2 className="text-2xl font-bold">Goal Activity</h2> */}
        {/* <button
          onClick={() => setShowLogs(!showLogs)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition duration-300">
          {showLogs ? "Hide Logs" : "Show Logs"}
        </button> */}
      </div>

      {showLogs && (
        <div className="bg-white border rounded-lg p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading activity logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No activity logs found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                        log.action
                      )}`}>
                      {log.action}
                    </span>
                    <span className="text-sm text-gray-700">
                      {getActionText(log)}
                    </span>
                    {log.goalId && log.goalId !== "logs_viewed" && (
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        ID: {log.goalId}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {logs.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={fetchGoalLogs}
                className="text-blue-600 hover:text-blue-800 text-sm">
                Refresh Logs
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GoalLogs;