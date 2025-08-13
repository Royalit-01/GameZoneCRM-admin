import { useState, useRef, useEffect } from "react";
import useHeader from "./useHeader";

export default function Header({ title, darkMode, setDarkMode }) {
  const {
    showDropdown,
    setShowDropdown,
    profileImage,
    setProfileImage,
    dropdownRef,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    handleLogout,
  } = useHeader();

  return (
    <div
      className={`px-4 py-3 border-bottom d-flex justify-content-between align-items-center position-relative ${
        darkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      {/* Left - Title */}
      <h5 className="m-0">{title}</h5>

      {/* Right - Controls */}
      <div className="d-flex align-items-center gap-3" ref={dropdownRef}>
        {/* Profile + Theme Toggle Group */}
        <div className="d-flex align-items-center gap-2">
          {/* Theme Toggle */}
          <div className="form-check form-switch m-0">
            <input
              className="form-check-input"
              type="checkbox"
              id="darkModeToggle"
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
              style={{ cursor: "pointer" }}
            />
            {/* Label visible only on md+ screens */}
            <label
              className="form-check-label ms-2 d-none d-md-inline"
              htmlFor="darkModeToggle"
            >
              {darkMode ? "Dark" : "Light"} Mode
            </label>
          </div>

          {/* Profile avatar */}
          <div className="position-relative">
            <img
              src={profileImage || "https://ui-avatars.com/api/?name=Admin"}
              alt="User Avatar"
              className="rounded-circle"
              style={{
                cursor: "pointer",
                width: "35px",
                height: "35px",
                objectFit: "cover",
              }}
              onClick={() => setShowDropdown((prev) => !prev)}
            />

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                className={`dropdown-menu dropdown-menu-end shadow mt-2 show ${
                  darkMode ? "bg-dark text-white" : "bg-white text-dark"
                }`}
                style={{
                  display: "block",
                  position: "absolute",
                  right: 0,
                  zIndex: 1050,
                  transition: "all 0.2s ease",
                }}
              >
                <button
                  className="dropdown-item"
                  onClick={() => alert("Profile clicked")}
                >
                  👤 Profile
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => alert("Settings clicked")}
                >
                  ⚙️ Settings
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => fileInputRef.current.click()}
                >
                  📸 Change Photo
                </button>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleRemoveImage}
                >
                  ❌ Remove Photo
                </button>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
