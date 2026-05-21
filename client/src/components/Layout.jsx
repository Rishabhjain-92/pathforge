import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <main className="ml-56 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;