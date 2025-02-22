// Layout.js
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex gap-[15vh]">
      <div className="w-[35vh] fixed h-screen">
        <Sidebar />
      </div>
      <div className="ml-[35vh] w-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;
