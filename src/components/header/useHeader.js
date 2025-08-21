import React, { useEffect, useRef, useState } from "react";

const useHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load saved profile photo from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    localStorage.removeItem("profileImage");
    setShowDropdown(false);
  };

  const handleLogout = () => {
    // Clear all storage data
    localStorage.clear();
    // Redirect to the root URL
    window.location.href = "/";
    localStorage.removeItem("profileImage");

    // Redirect to login or refresh page
    window.location.href = "/login"; // 👈 or navigate using react-router if available
  };

  return {
    showDropdown,
    setShowDropdown,
    profileImage,
    setProfileImage,
    dropdownRef,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    handleLogout,
  };
};

export default useHeader;
