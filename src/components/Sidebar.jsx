import { useState } from 'react';
import { BsHouse, BsPeople, BsJoystick, BsGear, BsPersonPlus, BsCreditCard, BsController, BsCup,BsGift,BsClipboardCheck,BsShop } from 'react-icons/bs';


const navItems = [
  { label: 'Dashboard', icon: <BsHouse /> },
  { label: 'Customers', icon: <BsPeople /> },
  { label: 'Employees', icon: <BsPersonPlus /> },
  { label: 'Ledger', icon: <BsCreditCard /> },
  { label: 'Snacks', icon: <BsCup /> },
  { label: 'Discounts', icon: <BsGift /> },
  { label: 'Attendance', icon: <BsClipboardCheck /> },
  { label: 'Employee Log', icon: <BsJoystick /> },
  { label: 'GameStoreManager', icon: <BsController /> },
  { label: 'Store Details', icon: <BsShop /> }
];

function Sidebar({ darkMode, activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`d-flex flex-column h-100 p-3 shadow ${darkMode ? 'bg-dark text-white' : 'bg-white text-dark'}`}
      style={{ width: collapsed ? '60px' : '220px', transition: '0.3s' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        {!collapsed && <h4>GameZone</h4>}
        <button
          className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
          onClick={() => setCollapsed(!collapsed)}
        >
          ≡
        </button>
      </div>
      <ul className="nav nav-pills flex-column">
        {navItems.map((item) => (
          <li className="nav-item mb-2" key={item.label}>
            <button
              className={`nav-link d-flex align-items-center ${activePage === item.label ? 'active bg-secondary text-white' : darkMode ? 'text-light' : 'text-dark'}`}
              onClick={() => onNavigate(item.label)}
            >
              <span className="me-2">{item.icon}</span>
              {!collapsed && item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
