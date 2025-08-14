import React, { useEffect, useState } from "react";

const useCustomerTable = () => {
  const itemsPerPage = 8;
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [storeFilter, setStoreFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true); // Start loading
      try {
        const res = await fetch(
          `https://gamezonecrm.onrender.com/api/admin/active?date=${selectedDate}`
        );
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCustomers();
  }, [selectedDate]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleRowClick = (cust) => {
    setSelectedCustomer(cust);
    setShowModal(true);
  };

  const filtered = customers.filter((cust) => {
    const searchTerm = search.toLowerCase();
    const name = cust.name?.toLowerCase() || "";
    const phone = cust.phone || "";
    const status = cust.status?.toLowerCase() || "";
    const firstTimeTotal = String(cust.total_amount || "");
    const createdAt = new Date(cust.created_at);
    const timeStr = createdAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const matchesStore =
      storeFilter === "" || String(cust.store) === String(storeFilter);

    return (
      matchesStore &&
      (name.includes(searchTerm) ||
        phone.includes(searchTerm) ||
        status.includes(searchTerm) ||
        firstTimeTotal.includes(searchTerm) ||
        timeStr.toLowerCase().includes(searchTerm))
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDateTime = (isoDateString) => {
    const createdAt = new Date(isoDateString);
    const now = new Date();

    const isToday =
      createdAt.getDate() === now.getDate() &&
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear();

    const timeStr = createdAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return `Today, ${timeStr}`;
    } else {
      const dateStr = createdAt.toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `${dateStr}, ${timeStr}`;
    }
  };

  const calculateFinalTotal = (cust) => {
    const base = Number(cust.total_amount || 0);
    const extended = Number(cust.extended_amount || 0);
    const snacks = Number(cust.extraSnacksPrice || 0);
    return base + extended + snacks;
  };

  return {
    setCurrentPage,
    setSearch,
    setStoreFilter,
    setSelectedDate,
    setShowModal,
    setSelectedCustomer,
    customers,
    search,
    currentPage,
    selectedCustomer,
    showModal,
    selectedDate,
    storeFilter,
    loading,
    handleSearch,
    handleRowClick,
    filtered,
    formatDateTime,
    calculateFinalTotal,
    totalPages,
    displayed,
  };
};

export default useCustomerTable;
