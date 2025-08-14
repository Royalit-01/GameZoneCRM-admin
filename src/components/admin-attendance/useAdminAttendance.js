import { useEffect, useState } from "react";

const useAdminAttendance = () => {
  const [staffList, setStaffList] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().substr(0, 10)
  );
  const [summaryData, setSummaryData] = useState([]);
  const [viewMonth, setViewMonth] = useState("");

  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchStore, setSearchStore] = useState("");

  const [summarySearchName, setSummarySearchName] = useState("");
  const [summarySearchStore, setSummarySearchStore] = useState("");
  const [loading, setLoading] = useState(true);
  const STATUS_OPTIONS = ["present", "absent", "half-day"];
  const STATUS_LABELS = {
    present: "Present",
    absent: "Absent",
    "half-day": "Half Day",
  };
  const STATUS_CLASSES = {
    present: "btn-success",
    absent: "btn-danger",
    "half-day": "btn-warning",
  };
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch(
          "https://gamezonecrm.onrender.com/api/admin/staff"
        );
        const data = await res.json();
        setStaffList(data);
        const initial = {};
        data.forEach((staff) => {
          initial[staff._id] = null;
        });
        setAttendance(initial);
      } catch (err) {
        console.error("Error fetching staff:", err);
      } finally {
        setLoading(false); // 👈 loader yahan off hoga
      }
    };

    fetchStaff();
  }, []);
  const handleStatusChange = (staffId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [staffId]: status,
    }));
  };

  const handleUndo = (staffId) => {
    setAttendance((prev) => ({
      ...prev,
      [staffId]: null,
    }));
  };

  const submitAttendance = async () => {
    const date = selectedDate;
    const records = Object.entries(attendance)
      .filter(([, status]) => status)
      .map(([staffId, status]) => {
        const staff = staffList.find((s) => s._id === staffId);
        return {
          name: staff.name,
          phone: staff.number,
          store: staff.store,
          status,
        };
      });

    try {
      const response = await fetch(
        "https://gamezonecrm.onrender.com/api/admin/attendance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, records }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      alert("✅ Attendance saved successfully");
    } catch (error) {
      console.error("Error submitting attendance:", error.message);
      alert("❌ Error saving attendance: " + error.message);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(
        `https://gamezonecrm.onrender.com/api/admin/attendance/summary?month=${viewMonth}`
      );
      const data = await res.json();
      setSummaryData(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchName.toLowerCase()) &&
      String(staff.number || "")
        .toLowerCase()
        .includes(searchPhone.toLowerCase()) &&
      String(staff.store || "").includes(searchStore)
  );

  const filteredSummary = summaryData.filter(
    (emp) =>
      emp.name.toLowerCase().includes(summarySearchName.toLowerCase()) &&
      String(emp.store).includes(summarySearchStore)
  );

  return {
    staffList,
    setStaffList,
    attendance,
    setAttendance,
    selectedDate,
    setSelectedDate,
    summaryData,
    setSummaryData,
    viewMonth,
    setViewMonth,
    searchName,
    setSearchName,
    searchPhone,
    setSearchPhone,
    searchStore,
    setSearchStore,
    summarySearchName,
    setSummarySearchName,
    summarySearchStore,
    setSummarySearchStore,
    loading,
    setLoading,
    STATUS_OPTIONS,
    STATUS_CLASSES,
    STATUS_LABELS,
    handleStatusChange,
    filteredSummary,
    filteredStaff,
    fetchSummary,
    submitAttendance,
    handleUndo,
  };
};
export default useAdminAttendance;
