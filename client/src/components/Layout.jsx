import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Sidebar />
      <Topbar />
      <main
        style={{ marginLeft: "224px", marginTop: "56px" }}
        className="flex-1 p-4 md:p-6 lg:p-8 min-h-screen"
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;