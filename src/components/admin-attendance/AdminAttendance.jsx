import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from '../../pages/Loader';
import useAdminAttendance from './useAdminAttendance';
import CustomButton from "../../components/common-components/CustomButton"

// const STATUS_OPTIONS = ['present', 'absent', 'half-day'];
// const STATUS_LABELS = {
//   present: 'Present',
//   absent: 'Absent',
//   'half-day': 'Half Day',
// };
// const STATUS_CLASSES = {
//   present: 'btn-success',
//   absent: 'btn-danger',
//   'half-day': 'btn-warning',
// };

const AdminAttendance = () => {
  const { attendance, selectedDate, setSelectedDate, summaryData, viewMonth, setViewMonth, searchName, setSearchName, searchPhone, setSearchPhone, searchStore, setSearchStore, summarySearchName, setSummarySearchName, summarySearchStore, setSummarySearchStore, loading, STATUS_OPTIONS, STATUS_CLASSES, STATUS_LABELS, handleStatusChange, filteredSummary, filteredStaff, fetchSummary, submitAttendance, handleUndo } = useAdminAttendance();


  // const [staffList, setStaffList] = useState([]);
  // const [attendance, setAttendance] = useState({});
  // const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().substr(0, 10));
  // const [summaryData, setSummaryData] = useState([]);
  // const [viewMonth, setViewMonth] = useState('');

  // const [searchName, setSearchName] = useState('');
  // const [searchPhone, setSearchPhone] = useState('');
  // const [searchStore, setSearchStore] = useState('');

  // const [summarySearchName, setSummarySearchName] = useState('');
  // const [summarySearchStore, setSummarySearchStore] = useState('');
  // const [loading,setLoading]=useState(true)
  //  useEffect(() => {
  //   const fetchStaff = async () => {
  //     try {
  //       const res = await fetch('VITE_BACKEND_PATH/api/admin/staff');
  //       const data = await res.json();
  //       setStaffList(data);
  //       const initial = {};
  //       data.forEach(staff => {
  //         initial[staff._id] = null;
  //       });
  //       setAttendance(initial);
  //     } catch (err) {
  //       console.error("Error fetching staff:", err);
  //     } finally {
  //       setLoading(false); // 👈 loader yahan off hoga
  //     }
  //   };

  //   fetchStaff();
  // }, []);


  // const handleStatusChange = (staffId, status) => {
  //   setAttendance(prev => ({
  //     ...prev,
  //     [staffId]: status,
  //   }));
  // };

  // const handleUndo = (staffId) => {
  //   setAttendance(prev => ({
  //     ...prev,
  //     [staffId]: null,
  //   }));
  // };

  // const submitAttendance = async () => {
  //   const date = selectedDate;
  //   const records = Object.entries(attendance)
  //     .filter(([, status]) => status)
  //     .map(([staffId, status]) => {
  //       const staff = staffList.find(s => s._id === staffId);
  //       return {
  //         name: staff.name,
  //         phone: staff.number,
  //         store: staff.store,
  //         status,
  //       };
  //     });

  //   try {
  //     const response = await fetch('VITE_BACKEND_PATH/api/admin/attendance', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ date, records }),
  //     });

  //     const result = await response.json();
  //     if (!response.ok) throw new Error(result.message);
  //     alert('✅ Attendance saved successfully');
  //   } catch (error) {
  //     console.error('Error submitting attendance:', error.message);
  //     alert('❌ Error saving attendance: ' + error.message);
  //   }
  // };

  // const fetchSummary = async () => {
  //   try {
  //     const res = await fetch(`VITE_BACKEND_PATH/api/admin/attendance/summary?month=${viewMonth}`);
  //     const data = await res.json();
  //     setSummaryData(data);
  //   } catch (err) {
  //     console.error('Error fetching summary:', err);
  //   }
  // };

  // const filteredStaff = staffList.filter(staff =>
  //   staff.name.toLowerCase().includes(searchName.toLowerCase()) &&
  //   String(staff.number || '').toLowerCase().includes(searchPhone.toLowerCase()) &&
  //   String(staff.store || '').includes(searchStore)
  // );

  // const filteredSummary = summaryData.filter(emp =>
  //   emp.name.toLowerCase().includes(summarySearchName.toLowerCase()) &&
  //   String(emp.store).includes(summarySearchStore)
  // );
  if (loading) {
    return (
      <Loader />
    )
  }
  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🗓️ Staff Attendance</h2>
      </div>

      {/* Attendance Filters */}
      <div className="row mb-3 g-2">
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Search by Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Search by Phone" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Search by Store" value={searchStore} onChange={(e) => setSearchStore(e.target.value)} />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="mb-3">
        <label className="form-label">Select Date</label>
        <input type="date" className="form-control" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
      </div>

      <div className="table-responsive mb-4">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Store</th>
              <th>Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map(staff => {
              const selectedStatus = attendance[staff._id];
              return (
                <tr key={staff._id}>
                  <td>{staff.name}</td>
                  <td>{staff.number || 'N/A'}</td>
                  <td>{staff.store}</td>
                  <td>
                    {selectedStatus ? (
                      <>
                        <button className={`btn btn-sm ${STATUS_CLASSES[selectedStatus]} me-2`} disabled>
                          {STATUS_LABELS[selectedStatus]}
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleUndo(staff._id)}>
                          Undo
                        </button>
                      </>
                    ) : (
                      <div className="btn-group">
                        {STATUS_OPTIONS.map(status => (
                          <button key={status} className="btn btn-sm btn-outline-secondary" onClick={() => handleStatusChange(staff._id, status)}>
                            {STATUS_LABELS[status]}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary me-3" onClick={submitAttendance}>💾 Submit Attendance</button>

      <hr className="my-5" />

      {/* Summary Section */}
      <h4>📊 Monthly Summary</h4>
      <div className="row g-3 align-items-center mb-3">
        <div className="col-md-3">
          <input type="month" className="form-control" value={viewMonth} onChange={(e) => setViewMonth(e.target.value)} />
        </div>
        <div className="col-auto">
          <button className="btn btn-secondary" onClick={fetchSummary}>View Summary</button>
        </div>
      </div>

      {summaryData.length > 0 && (
        <>
          {/* Filters */}
          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="Filter by Name" value={summarySearchName} onChange={(e) => setSummarySearchName(e.target.value)} />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="Filter by Store" value={summarySearchStore} onChange={(e) => setSummarySearchStore(e.target.value)} />
            </div>
          </div>

          {/* Totals Table */}
          <h5>Total Attendance Summary</h5>
          <div className="table-responsive mb-4">
            <table className="table table-bordered">
              <thead className="table-success">
                <tr>
                  <th>Name</th>
                  <th>Store</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Half Day</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummary.map(emp => (
                  <tr key={`${emp.name}-${emp.store}`}>
                    <td>{emp.name}</td>
                    <td>{emp.store}</td>
                    <td>{emp.present}</td>
                    <td>{emp.absent}</td>
                    <td>{emp.halfDay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Table */}
          <h5>Day-wise Attendance</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Store</th>
                  {summaryData[0].days.map(day => (
                    <th key={day.date}>{day.date.split('-')[2]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSummary.map(emp => (
                  <tr key={`${emp.name}-${emp.store}`}>
                    <td>{emp.name}</td>
                    <td>{emp.store}</td>
                    {emp.days.map(day => (
                      <td key={day.date}>
                        <span
                          style={{
                            color:
                              day.status === 'present'
                                ? 'green'
                                : day.status === 'absent'
                                  ? 'red'
                                  : 'orange',
                            fontWeight: 'bold'
                          }}
                        >
                          {day.status === 'present' ? 'P' : day.status === 'absent' ? 'A' : 'H'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAttendance;
