import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <Topbar />
      <main className="ml-56 pt-14 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;