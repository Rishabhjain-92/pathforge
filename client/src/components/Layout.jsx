import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <Topbar />
      <main
        style={{
          marginLeft: "240px",
          marginTop: "56px",
          padding: "20px",
          minHeight: "calc(100vh - 56px)",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;