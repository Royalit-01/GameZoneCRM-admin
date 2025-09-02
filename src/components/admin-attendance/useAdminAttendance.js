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
  
  const fetchAttendanceForDate = async (date) => {
    try {
      console.log("Fetching attendance for date:", date);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/attendance?date=${date}`
      );
      const data = await res.json();
      console.log("Attendance records for", date, ":", data);
      
      // Create initial state with all staff marked as null
      const initial = {};
      staffList.forEach((staff) => {
        initial[staff._id] = null;
      });
      console.log("Initial ", initial);

      // Update with existing attendance records
      if (Array.isArray(data) && data.length > 0) {
        // Get the first attendance record for the day
        const todayAttendance = data[0];
        
        console.log("Staff List:", staffList);
        
        if (todayAttendance && Array.isArray(todayAttendance.records)) {
          console.log("Processing records:", todayAttendance.records);
          
          todayAttendance.records.forEach((record) => {
            console.log("Processing record:", record);
            // Normalize phone numbers for comparison by removing any non-digit characters
            const normalizedRecordPhone = String(record.phone).replace(/\D/g, '');
            
            const staff = staffList.find(s => {
              // Ensure we're working with strings
              const staffPhone = s.number !== undefined && s.number !== null ? String(s.number) : '';
              const normalizedStaffPhone = staffPhone.replace(/\D/g, '');
              const match = normalizedStaffPhone === normalizedRecordPhone;
              console.log(`Comparing staff ${s.name} (${staffPhone} -> ${normalizedStaffPhone}) with record (${record.phone} -> ${normalizedRecordPhone}): ${match}`);
              return match;
            });
            
            if (staff) {
              console.log(`Found matching staff:`, staff);
              initial[staff._id] = record.status;
            } else {
              console.log(`No staff found for phone:`, record.phone);
            }
          });
        }
      }
      
      console.log("Final attendance state:", initial);
      setAttendance(initial);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/staff`
        );
        const data = await res.json();
        console.log("Fetched staff data:", data);
        
        // Filter out any staff without valid phone numbers and normalize phone numbers
        const validStaff = data.map(staff => ({
          ...staff,
          number: staff.number !== undefined && staff.number !== null ? String(staff.number) : null
        })).filter(staff => staff.number);
        
        if (validStaff.length !== data.length) {
          console.warn(`Found ${data.length - validStaff.length} staff members without phone numbers`);
        }
        
        console.log("Processed staff data:", validStaff);
        
        setStaffList(validStaff);
        const initial = {};
        validStaff.forEach((staff) => {
          console.log(`Initializing staff ${staff.name} with ID ${staff._id} and phone ${staff.number}`);
          initial[staff._id] = null;
        });
        setAttendance(initial);
      } catch (err) {
        console.error("Error fetching staff:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Fetch attendance when date changes
  useEffect(() => {
    if (staffList.length > 0) {
      fetchAttendanceForDate(selectedDate);
    }
  }, [selectedDate, staffList]);

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
    setLoading(true);
    try {
      console.log("Current attendance state:", attendance);
      const date = selectedDate;
      const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      // Filter out null values and map to the schema format
      const records = Object.entries(attendance)
        .filter(([, status]) => status)
        .map(([staffId, status]) => {
          const staff = staffList.find((s) => s._id === staffId);
          if (!staff) throw new Error(`Staff member not found for ID: ${staffId}`);
          
          return {
            name: staff.name,
            phone: staff.number,
            store: staff.store,
            status,
          };
        });

      if (records.length === 0) {
        throw new Error("No attendance records to save");
      }

      console.log("Submitting records:", { date, time, records });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/attendance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            date,
            time,
            records 
          }),
        }
      );

      const result = await response.json();
      console.log("Submit response:", result);
      
      if (!response.ok) throw new Error(result.message);
      
      // Small delay to ensure backend has processed the data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refetch the attendance to ensure we have the latest data
      await fetchAttendanceForDate(selectedDate);
      alert("✅ Attendance saved successfully");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("❌ Error saving attendance: " + (error.message || "Unknown error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/attendance/summary?month=${viewMonth}`
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
