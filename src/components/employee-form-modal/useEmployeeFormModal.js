import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
const useEmployeeFormModal = (employee, show, onSave, onHide) => {
  const [form, setForm] = useState({
    name: "",
    number: "",
    password: "",
    adhar: "",
    role: "staff",
    store: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const soundRef = useRef(null);
  const [gameStores, setGameStores] = useState([]);
  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || "",
        number: employee.number || "",
        password: "", // Never prefill password
        adhar: employee.adhar || "",
        role: employee.role || "staff",
        store: employee.store || 0,
      });
    } else {
      setForm({
        name: "",
        number: "",
        password: "",
        adhar: "",
        role: "staff",
        store: 0,
      });
    }
  }, [employee, show]);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
  };

  const toastWithSound = (message, type = "success") => {
    toast[type](message);
    playSound();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "store" ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return; // 🔒 Prevent double submission

    const requiredFields = [
      "name",
      "number",
      "password",
      "adhar",
      "role",
      "store",
    ];
    const missing = requiredFields.filter(
      (field) => !form[field] && form[field] !== 0
    );
    if (missing.length > 0) {
      toastWithSound("Please fill in all fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const url = employee
        ? `https://gamezonecrm.onrender.com/api/admin/staff/${employee._id}`
        : "https://gamezonecrm.onrender.com/api/admin/staff/add";

      const method = employee ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      const savedEmployee = await response.json();
      toastWithSound(`Employee ${employee ? "updated" : "added"} successfully`);
      onSave(savedEmployee);
      onHide();
    } catch (error) {
      toastWithSound(error.message || "Failed to save employee.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  //get all game stores
  useEffect(() => {
    fetch("https://gamezonecrm.onrender.com/api/admindashboard/getall-store")
      .then((res) => res.json())
      .then((data) => {
        setGameStores(data);
      });
  }, []);

  return {
    form,
    setForm,
    submitting,
    setSubmitting,
    soundRef,
    playSound,
    toastWithSound,
    handleChange,
    handleSubmit,
    gameStores,
  };
};

export default useEmployeeFormModal;
