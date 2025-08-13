import React, { useEffect, useState } from "react";

const useCouponList = (showExpired = false) => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({ from: "", to: "" });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("VITE_BACKEND_PATH/api/admin/getAll-coupons");
      const data = await res.json();
      if (res.ok) {
        const filtered = data.filter(
          (c) => showExpired || new Date(c.expiresAt) >= new Date()
        );
        setCoupons(filtered);
      } else {
        toast.error(data.message || "Failed to fetch coupons");
      }
    } catch (err) {
      toast.error("Server error while fetching coupons");
    }
    setLoading(false);
  };

  const applyDateFilter = () => {
    if (!filters.from && !filters.to) {
      setFilteredCoupons(coupons);
      return;
    }

    const fromDate = filters.from ? new Date(filters.from) : null;
    const toDate = filters.to ? new Date(filters.to) : null;

    const result = coupons.filter((c) => {
      const date = new Date(c.expiresAt);
      return (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
    });

    setFilteredCoupons(result);
    setCurrentPage(0);
  };

  const downloadCSV = () => {
    const csv = [
      [
        "Coupon Code",
        "Type",
        "Value",
        "Start Date",
        "Expires",
        "Used",
        "Free Snacks",
      ],
      ...filteredCoupons.map((c) => [
        c.code,
        c.discountType,
        c.value,
        new Date(c.startDate).toLocaleDateString(),
        new Date(c.expiresAt).toLocaleDateString(),
        c.used ? "Yes" : "No",
        Array.isArray(c.freeSnacks)
          ? c.freeSnacks
              .map(
                (s) => `${s.snackName} (x${s.snackQuantity}, ₹${s.snackPrice})`
              )
              .join(" | ")
          : "—",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "filtered_coupons.csv";
    link.click();
  };

  const itemsPerPage = 10;

  useEffect(() => {
    fetchCoupons();
  }, [showExpired]);

  useEffect(() => {
    applyDateFilter();
  }, [coupons, filters]);
  const offset = currentPage * itemsPerPage;
  const currentCoupons = filteredCoupons.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredCoupons.length / itemsPerPage);

  const usedCount = filteredCoupons.filter((c) => c.used).length;
  const unusedCount = filteredCoupons.length - usedCount;

  return {
    coupons,
    setCoupons,
    filteredCoupons,
    setFilteredCoupons,
    loading,
    setLoading,
    currentPage,
    setCurrentPage,
    filters,
    setFilters,
    fetchCoupons,
    applyDateFilter,
    downloadCSV,
    offset,
    currentCoupons,
    pageCount,
    usedCount,
    unusedCount,
  };
};

export default useCouponList;
