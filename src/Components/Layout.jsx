import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import { useState } from "react";

const Layout = ({ children, logOut }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar - fixed position */}
      <div className={`hidden md:block fixed h-full  transition-all ease-in-out duration-300 ${
        collapsed ? "w-15" : "w-64"
      }`}>
        <Sidebar logOut={logOut} collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all ease-in-out duration-300 ${
        collapsed ? "md:ml-15" : "md:ml-64"
      }`}>
        {children}
      </div>
      
      {/* Mobile Bottom Navigation - fixed position */}
      <div className="md:hidden fixed bottom-0 left-0 right-0">
        <MobileSidebar logOut={logOut} />
      </div>
    </div>
  );
};

export default Layout;
// // // Layout.js
// import Sidebar from "./Sidebar";
// import MobileSidebar from "./MobileSidebar";

// const Layout = ({ children,logOut }) => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header could go here if needed */}
//       <div className="flex flex-1">
//         <div className="hidden md:block">
//           <Sidebar logOut={logOut} />
//         </div>
//         <main className="flex-1">{children}</main>
//       </div>
//       <div className="md:hidden">
//         <MobileSidebar logOut={logOut} />
//       </div>
//     </div>
//   );
// };

// export default Layout;

// import Sidebar from "./Sidebar";
// import MobileSidebar from "./MobileSidebar";
// const Layout = ({ children }) => {
//   return (
//     <div className="">
//       <div className="">
//         <Sidebar className="hidden md:block"/>
//         <MobileSidebar className="block md:hidden"/>
//       </div>
//       <div className="">{children}</div>
//     </div>
//   );
// };

// export default Layout;
