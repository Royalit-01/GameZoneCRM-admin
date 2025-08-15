import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/header/Header";
import Dashboard from "./pages/Dashboard";
import CustomerTablePage from "./components/customer-table/CustomerTable";
import Settings from "./pages/Settings";
import SnacksPage from "./pages/SnacksPage";
import GameStoreManagerPage from "./components/game-store-manager/GameStoreManager";
import PaymentPage from "./pages/PaymentPage";
import EmployeesPage from "./pages/EmployeesPage";
import DiscountManagerPage from "./pages/DiscountManagerPage";
import AdminAttendancePage from "./pages/AdminAttendancePage";
import EmployeeLogPage from "./components/employee-log/EmployeeLog";
import CreateCouponPage from "./pages/CreateCouponPage";
import CouponListPage from "./pages/CouponListPage";
import StoreDetailsPage from "./pages/StoreDetailsPage";
import Login from "./pages/Login";
// import Loading from './components/Loading';

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

 const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return localStorage.getItem("isLoggedIn") === "true";
});


  useEffect(() => {
    document.body.className = darkMode
      ? "bg-dark text-white"
      : "bg-light text-dark";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // 🔁 Function to switch pages
  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Customers":
        return <CustomerTablePage />;
      case "Settings":
        return <Settings />;
      case "Snacks":
        return <SnacksPage />;
      case "GameStoreManager":
        return <GameStoreManagerPage />;
      case "Ledger":
        return <PaymentPage />;
      case "Employee Log":
        return <EmployeeLogPage />;
      case "Employees":
        return <EmployeesPage />;
      case "Discounts":
        return <DiscountManagerPage onNavigate={setActivePage} />;
      case "Attendance":
        return <AdminAttendancePage />;
      case "Create Coupon":
        return <CreateCouponPage />;
      case "View Coupons":
        return <CouponListPage />;
      case "Store Details":
        return <StoreDetailsPage />;
      default:
        return <Dashboard />;
    }
  };

  // ✅ Show login screen first
  if (!isLoggedIn) {
    return<Login
  onLoginSuccess={() => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  }}
/>;
  }

  return (
    <div
      className={`app-wrapper d-flex ${
        darkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      {/* Fixed Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        darkMode={darkMode}
      />

      {/* Main Layout */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ height: "100vh" }}
      >
        {/* Fixed Header */}
        <Header
          title={activePage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Scrollable Content */}
        <div
          className="scrollable-content p-4 flex-grow-1 overflow-auto"
          style={{ backgroundColor: darkMode ? "#1f1f1f" : "#eff1f4ff" }}
        >
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
