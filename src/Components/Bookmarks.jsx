// import React, { useEffect, useState } from "react";
// import { db } from "../config/firebase";
// import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../config/firebase";
// import ReactMarkdown from "react-markdown";
// import rehypeRaw from "rehype-raw";
// import rehypeSanitize from "rehype-sanitize";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Bookmarks = () => {
//   const [user] = useAuthState(auth);
//   const [bookmarks, setBookmarks] = useState([]);
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user) return;

//     const fetchBookmarks = async () => {
//       try {
//         const q = query(
//           collection(db, "bookmarks"),
//           where("userId", "==", user.uid),
//           orderBy("createdAt", "desc")
//         );

//         const querySnapshot = await getDocs(q);
//         const userBookmarks = [];

//         querySnapshot.forEach((doc) => {
//           userBookmarks.push({ id: doc.id, ...doc.data() });
//         });

//         setBookmarks(userBookmarks);
//       } catch (error) {
//         console.error("Error fetching bookmarks:", error);
//         toast.error("Failed to load bookmarks");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookmarks();
//   }, [user]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         Loading your bookmarked recipes...
//       </div>
//     );

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-8">
//         Bookmarked Recipes
//       </h1>

//       {selectedRecipe ? (
//         <div className="mb-6">
//           <button
//             onClick={() => setSelectedRecipe(null)}
//             className="mb-4 text-blue-600 hover:underline flex items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-1"
//               viewBox="0 0 20 20"
//               fill="currentColor">
//               <path
//                 fillRule="evenodd"
//                 d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Back to bookmarks
//           </button>

//           <div className="p-6 bg-white rounded-lg shadow-lg">
//             {/* <h2 className="text-xl font-bold mb-4">{selectedRecipe.title}</h2> */}
//             <ReactMarkdown
//               className="prose max-w-none"
//               rehypePlugins={[rehypeRaw, rehypeSanitize]}>
//               {selectedRecipe.recipeText}
//             </ReactMarkdown>
//           </div>
//         </div>
//       ) : (
//         <div>
//           {bookmarks.length === 0 ? (
//             <div className="text-center py-10 ">
//               <p className="text-gray-500">No bookmarks yet.</p>
//             </div>
//           ) : (
//             <div className="bg-green-200 p-2 border border-green-400 rounded-lg">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
//                 {bookmarks.map((bookmark) => (
//                   <div
//                     key={bookmark.id}
//                     className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
//                     onClick={() => setSelectedRecipe(bookmark)}>
//                     <h3 className="font-semibold text-lg mb-2 text-black line-clamp-3 min-h-20">
//                       {bookmark.title}
//                     </h3>
//                     <div className="text-sm text-gray-400">
//                       {bookmark.createdAt?.toDate()?.toLocaleDateString() ||
//                         "No date"}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Bookmarks;
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Trash2 } from "lucide-react";
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

  const handleDeleteBookmark = async (bookmarkId, e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    try {
      await deleteDoc(doc(db, "bookmarks", bookmarkId));
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== bookmarkId));
      toast.success("Bookmark removed successfully");
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading your bookmarked recipes...
      </div>
    );

  return (
    <div className="3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-8">
        Bookmarked Recipes
      </h1>

      {selectedRecipe ? (
        <div className="mb-6 ">
          <div className="flex flex-col sm:flex-row gap-2 items-center mb-3">
            <button
              onClick={() => setSelectedRecipe(null)}
              className=" text-blue-600 hover:text-white hover:bg-blue-600 transition-colors ease-in-out duration-300 flex items-center border border-blue-400 rounded-full px-2 py-1">
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
            <button
              onClick={(e) => handleDeleteBookmark(selectedRecipe.id, e)}
              className="text-red-600  flex items-center  hover:text-white hover:bg-red-600 transition-colors ease-in-out duration-300 border border-red-400 rounded-full px-2 py-1"
              title="Remove bookmark">
              <Trash2 className="h-5 w-5 mr-1" />
              Delete bookmark
            </button>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              {/* <h2 className="text-xl font-bold">{selectedRecipe.title}</h2> */}
            </div>
            <ReactMarkdown
              className="prose max-w-none"
              rehypePlugins={[rehypeRaw, rehypeSanitize]}>
              {selectedRecipe.recipeText}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div>
          {bookmarks.length === 0 ? (
            <div className="text-center py-10 ">
              <p className="text-gray-500">No bookmarks yet.</p>
            </div>
          ) : (
            <div className="bg-green-200 p-2 border border-green-400 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="p-4 border rounded-lg shadow-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                    onClick={() => setSelectedRecipe(bookmark)}>
                    <h3 className="font-semibold text-lg mb-2 text-black line-clamp-3 min-h-20 pr-5">
                      {bookmark.title}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      {bookmark.createdAt?.toDate()?.toLocaleDateString() ||
                        "No date"}
                      <button
                        onClick={(e) => handleDeleteBookmark(bookmark.id, e)}
                        className=" text-red-500 hover:text-red-700"
                        title="Remove bookmark">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
