import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const useDiscountManager = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const soundRef = useRef(null);
  const [gameStores, setGameStores] = useState([]);
  const [form, setForm] = useState({
    store: 0,
    startDate: "",
    endDate: "",
    startTime: "14:00",
    endTime: "18:00",
    discountType: "percent",
    discountValue: "",
  });

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(console.error);
    }
  };

  const toastWithSound = (msg, type = "info") => {
    toast[type](msg);
    playSound();
  };

  //get all game stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch("https://gamezonecrm.onrender.com/api/admin/dashboard/getall-store");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Expected array of stores but got ' + typeof data);
        }
        setGameStores(data);
      } catch (error) {
        console.error("Error fetching game stores:", error);
        setError(error.message);
        toastWithSound("Failed to load game stores: " + error.message, "error");
      }
    };
    fetchStores();
  }, []);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await fetch("https://gamezonecrm.onrender.com/api/admin/discounts");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Expected array of discounts but got ' + typeof data);
      }
      setDiscounts(data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      setError(error.message);
      toastWithSound("Failed to load discounts: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { startDate, endDate, discountValue, store } = form;

    if (!startDate || !endDate || !discountValue || !store) {
      toastWithSound("All fields are required", "warning");
      return;
    }

    try {
      const res = await fetch(
        "https://gamezonecrm.onrender.com/api/admin/discounts/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        fetchDiscounts();
        setForm({
          store: 0,
          startDate: "",
          endDate: "",
          startTime: "14:00",
          endTime: "18:00",
          discountType: "percent",
          discountValue: "",
        });
        toastWithSound("Discount rule added successfully", "success");
      } else {
        toastWithSound("Failed to create discount", "error");
      }
    } catch {
      toastWithSound("Server error while creating discount", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(
        `https://gamezonecrm.onrender.com/api/admin/discounts/${id}`,
        {
          method: "DELETE",
        }
      );
      setDiscounts(discounts.filter((d) => d._id !== id));
      toastWithSound("Discount rule deleted", "success");
    } catch {
      toastWithSound("Failed to delete rule", "error");
    }
  };
  return {
    discounts,
    setDiscounts,
    form,
    setForm,
    loading,
    setLoading,
    error,
    playSound,
    toastWithSound,
    fetchDiscounts,
    handleChange,
    handleSubmit,
    handleDelete,
    gameStores,
    soundRef
  };
};

export default useDiscountManager;
