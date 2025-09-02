import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

const useAdminCreateCoupon = () => {
  const [formData, setFormData] = useState({
    prefix: "",
    store: 0,
    discountType: "flat",
    value: "",
    startDate: "",
    endDate: "",
    freeSnacks: [],
    count: 10,
  });

  const [generatedCoupons, setGeneratedCoupons] = useState([]);
  const [selectedSnackItems, setSelectedSnackItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gameStores, setGameStores] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "count" ? parseInt(value, 10) || 0 : value,
    }));
  };

  //get all game stores
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard/getall-store`)
      .then((res) => res.json())
      .then((data) => {
        setGameStores(data);
      });
  }, []);

  const generateCoupons = () => {
    const { prefix, count } = formData;
    const generated = new Set();
    while (generated.size < count) {
      const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      generated.add(`${prefix}-${suffix}`);
    }
    return Array.from(generated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { prefix, value, startDate, endDate, count } = formData;

    if (!prefix || !value || !startDate || !endDate || count < 1) {
      return toast.error("Fill all fields and enter valid count");
    }

    setLoading(true); // Show loader

    const coupons = generateCoupons();
    setGeneratedCoupons(coupons);

    try {
      const payload = {
        store: formData.store,
        codes: coupons,
        discountType: formData.discountType,
        value: formData.value,
        startDate: formData.startDate,
        endDate: formData.endDate,
        freeSnacks: selectedSnackItems,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/create-bulk-coupons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(`${coupons.length} Coupons Generated & Saved!`);
      } else {
        toast.error(data.message || "Failed to save to database");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while saving");
    }

    setLoading(false); // Hide loader
  };

  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    for (let i = 0; i < generatedCoupons.length; i++) {
      const couponId = `coupon-${i}`;
      const element = document.getElementById(couponId);
      if (!element) continue;

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const width = pdf.internal.pageSize.getWidth();
      const height = (imgProps.height * width) / imgProps.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
    }

    pdf.save(`${formData.prefix}_Coupons.pdf`);
  };
  return {
    formData,
    setFormData,
    generatedCoupons,
    setGeneratedCoupons,
    selectedSnackItems,
    setSelectedSnackItems,
    loading,
    setLoading,
    handleChange,
    generateCoupons,
    handleSubmit,
    downloadPDF,
    gameStores,
  };
};

export default useAdminCreateCoupon;
