import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
const useEmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const soundRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(console.error);
    }
  };

  const toastWithSound = (msg, type = "success") => {
    toast[type](msg);
    playSound();
  };

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/staff`)
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .finally(setLoading(false))
      .catch(() => toastWithSound("Error fetching employees", "error"));
  }, []);

  const handleDelete = async (id) => {
    toast.info("Deleting employee...");
    try {
      const res = await fetch(`${backendUrl}/api/admin/staff/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        toastWithSound("Employee deleted successfully");
      } else {
        toastWithSound("Failed to delete employee", "error");
      }
    } catch (err) {
      toastWithSound("Error deleting employee: " + err.message, "error");
    }
  };

  const handleEdit = (employee) => {
    console.log("mkjdsghisuho");
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleSave = (savedEmployee) => {
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === savedEmployee._id ? savedEmployee : emp))
      );
      toastWithSound("Employee updated");
    } else {
      setEmployees((prev) => [...prev, savedEmployee]);
      toastWithSound("Employee added");
    }

    setShowModal(false);
  };

  return {
    employees,
    handleAdd,
    handleSave,
    playSound,
    handleEdit,
    handleDelete,
    toastWithSound,
    soundRef,
    backendUrl,
    setEmployees,
    showModal,
    loading,
    setLoading,
    setShowModal,
    editingEmployee,
    setEditingEmployee,
  };
};

export default useEmployeeTable;
