import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Bookmarks = () => {
  const [user] = useAuthState(auth);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBookmarks = async () => {
      try {
        const q = query(
          collection(db, "bookmarks"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const userBookmarks = [];

        querySnapshot.forEach((doc) => {
          userBookmarks.push({ id: doc.id, ...doc.data() });
        });

        setBookmarks(userBookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast.error("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading your bookmarked recipes...
      </div>
    );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-8">
        Bookmarked Recipes
      </h1>

      {selectedRecipe ? (
        <div className="mb-6">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="mb-4 text-blue-600 hover:underline flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to bookmarks
          </button>

          <div className="p-6 bg-white rounded-lg shadow-lg">
            {/* <h2 className="text-xl font-bold mb-4">{selectedRecipe.title}</h2> */}
            <ReactMarkdown
              className="prose max-w-none"
              rehypePlugins={[rehypeRaw, rehypeSanitize]}>
              {selectedRecipe.recipeText}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <>
          {bookmarks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No bookmarks yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
                  onClick={() => setSelectedRecipe(bookmark)}>
                  <h3 className="font-semibold text-lg mb-2 text-black line-clamp-3 min-h-20">
                    {bookmark.title}
                  </h3>
                  <div className="text-sm text-gray-400">
                    {bookmark.createdAt?.toDate()?.toLocaleDateString() ||
                      "No date"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Bookmarks;
