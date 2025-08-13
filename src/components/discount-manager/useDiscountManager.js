import React, { useEffect, useRef, useState } from "react";
import { use } from "react";
import { toast } from "react-toastify";

const useDiscountManager = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetch("VITE_BACKEND_PATH/api/admindashboard/getall-store")
      .then((res) => res.json())
      .then((data) => {
        setGameStores(data);
      });
  }, []);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = () => {
    fetch("VITE_BACKEND_PATH/api/admin/discounts/")
      .then((res) => res.json())
      .then((data) => setDiscounts(data))
      .finally(setLoading(false))
      .catch(() => toastWithSound("Failed to load discounts", "error"));
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
      const res = await fetch("VITE_BACKEND_PATH/api/admin/discounts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

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
      await fetch(`VITE_BACKEND_PATH/api/admin/discounts/${id}`, {
        method: "DELETE",
      });
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
    playSound,
    toastWithSound,
    fetchDiscounts,
    handleChange,
    handleSubmit,
    handleDelete,
    gameStores,
  };
};

export default useDiscountManager;
