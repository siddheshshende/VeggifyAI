// Layout.js
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="">
      <div className="">
        <Sidebar />
      </div>
      <div className="">
        {children}
      </div>
    </div>
  );
};

export default Layout;
