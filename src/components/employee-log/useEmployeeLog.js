import axios from "axios";
import React, { useEffect, useState } from "react";

const useEmployeeLog = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const logsPerPage = 10;

  // Fetch logs from backend with optional date range
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate && endDate) {
        params.start = startDate.toISOString();
        params.end = endDate.toISOString();
      }

      const response = await axios.get(
        "https://gamezonecrm.onrender.com/api/admin/activity/logs",
        {
          params,
        }
      );

      const cleanedLogs = response.data.map((log) => ({
        id: log._id,
        user: log.employee,
        action: log.action,
        timestamp: log.timestamp,
        ip: log.ip,
        store: log.store,
        userAgent: log.userAgent,
        details: log.details || null,
      }));

      setLogs(cleanedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  // Load today's logs by default on first render
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setStartDate(today);
    setEndDate(tomorrow);
  }, []);

  // Fetch logs when dates change
  useEffect(() => {
    if (startDate && endDate) {
      fetchLogs();
    }
  }, [startDate, endDate]);

  // Filter by search term
  useEffect(() => {
    let tempLogs = [...logs];
    if (searchTerm) {
      tempLogs = tempLogs.filter(
        (log) =>
          log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredLogs(tempLogs);
    setCurrentPage(1);
  }, [searchTerm, logs]);

  const userStats = filteredLogs.reduce((acc, log) => {
    const user = log.user;
    const action = log.action.toLowerCase();

    if (!acc[user]) {
      acc[user] = {
        login: 0,
        logout: 0,
        "create-order": 0,
        "stop-order": 0,
        "add-transaction": 0,
        totalActions: 0,
      };
    }

    if (action.includes("login")) acc[user].login += 1;
    else if (action.includes("logout")) acc[user].logout += 1;
    else if (action.includes("create")) acc[user]["create-order"] += 1;
    else if (action.includes("stop")) acc[user]["stop-order"] += 1;
    else if (action.includes("add transaction"))
      acc[user]["add-transaction"] += 1;

    acc[user].totalActions += 1;
    return acc;
  }, {});

  const indexOfLastItem = currentPage * logsPerPage;
  const indexOfFirstItem = indexOfLastItem - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return {
    logs,
    setLogs,
    setSearchTerm,
    filteredLogs,
    indexOfLastItem,
    totalPages,
    currentLogs,
    indexOfFirstItem,
    userStats,
    setFilteredLogs,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedLog,
    setSelectedLog,
    currentPage,
    setCurrentPage,
    loading,
    searchTerm,
    setLoading,
    fetchLogs,
  };
};

export default useEmployeeLog;
