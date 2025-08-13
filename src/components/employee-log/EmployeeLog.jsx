import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
} from 'react-icons/fa';
import Loader from '../../pages/Loader';
import useEmployeeLog from './useEmployeeLog';

const getIcon = (action) => {
  if (action.includes('login')) return <FaSignInAlt className="text-success me-2" />;
  if (action.includes('logout')) return <FaSignOutAlt className="text-danger me-2" />;
  if (action.includes('create')) return <FaPlus className="text-primary me-2" />;
  if (action.includes('update')) return <FaEdit className="text-warning me-2" />;
  if (action.includes('delete')) return <FaTrash className="text-danger me-2" />;
  return null;
};

const getBadgeClass = (action) => {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes('login')) return 'bg-success';
  if (lowerAction.includes('logout')) return 'bg-danger';
  if (lowerAction.includes('create')) return 'bg-primary';
  if (lowerAction.includes('update')) return 'bg-warning text-dark';
  if (lowerAction.includes('delete')) return 'bg-danger';
  if (lowerAction.includes('stop')) return 'bg-dark text-white';
  if (lowerAction.includes('add transaction')) return 'bg-info text-dark';
  return 'bg-light text-dark';
};

const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleString();

const EmployeeLog = () => {

  const  {logs, setLogs,filteredLogs,setSearchTerm,indexOfLastItem,totalPages,currentLogs,indexOfFirstItem,response, userStats,setFilteredLogs,startDate, setStartDate,endDate, setEndDate,selectedLog, setSelectedLog,currentPage, setCurrentPage,loading,searchTerm, setLoading,fetchLogs}= useEmployeeLog()

if(loading){
  return(
    <Loader/>
  )
}
  return (
    <div className="container my-5">
      <h4 className="mb-3">Employee Activity Log</h4>

      <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search user or action"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="btn-group">
          <button className="btn btn-outline-secondary" onClick={() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            const end = new Date(yesterday);
            end.setHours(23, 59, 59, 999);
            setStartDate(yesterday);
            setEndDate(end);
          }}>Yesterday</button>

          <button className="btn btn-outline-secondary" onClick={() => {
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            const start = new Date();
            start.setDate(start.getDate() - 6);
            start.setHours(0, 0, 0, 0);
            setStartDate(start);
            setEndDate(end);
          }}>Last 7 Days</button>

          <button className="btn btn-outline-danger" onClick={() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            setStartDate(today);
            setEndDate(tomorrow);
          }}>Today</button>
        </div>

        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="form-control"
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className="form-control"
          placeholderText="End Date"
        />
      </div>

      {/* Stats Table */}
      {Object.keys(userStats).length > 0 && (
        <div className="table-responsive mb-4">
          <table className="table table-bordered table-striped table-sm">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Total Actions</th>
                <th>Login</th>
                <th>Logout</th>
                <th>Create Order</th>
                <th>Stop Order</th>
                <th>Add Transaction</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(userStats).map(([user, stats]) => (
                <tr key={user}>
                  <td className="text-capitalize">{user}</td>
                  <td>{stats.totalActions}</td>
                  <td>{stats.login}</td>
                  <td>{stats.logout}</td>
                  <td>{stats['create-order']}</td>
                  <td>{stats['stop-order']}</td>
                  <td>{stats['add-transaction']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Logs Table */}
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>IP</th>
              <th>Store</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.length > 0 ? (
              currentLogs.map((log, index) => (
                <tr key={log.id} onClick={() => setSelectedLog(log)} style={{ cursor: 'pointer' }}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td className="text-capitalize">{log.user}</td>
                  <td>
                    {getIcon(log.action)}
                    <span className={`badge ${getBadgeClass(log.action)}`}>{log.action}</span>
                  </td>
                  <td>{formatTimestamp(log.timestamp)}</td>
                  <td>{log.ip || '-'}</td>
                  <td>{log.store || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <FaSearch className="text-muted mb-2" size={32} />
                  <p className="text-muted mb-0">No logs found for current filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Prev</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              )
              .map((page, i, arr) => {
                const prevPage = arr[i - 1];
                const isEllipsis = prevPage && page - prevPage > 1;
                return (
                  <React.Fragment key={page}>
                    {isEllipsis && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    <li className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                    </li>
                  </React.Fragment>
                );
              })}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
            </li>
          </ul>
        </nav>
      )}

      {/* Modal */}
      {selectedLog && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedLog(null)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Log Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedLog(null)}></button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  <li className="list-group-item"><strong>User:</strong> {selectedLog.user}</li>
                  <li className="list-group-item"><strong>Action:</strong> {selectedLog.action}</li>
                  <li className="list-group-item"><strong>Timestamp:</strong> {formatTimestamp(selectedLog.timestamp)}</li>
                  <li className="list-group-item"><strong>IP Address:</strong> {selectedLog.ip || 'N/A'}</li>
                  <li className="list-group-item"><strong>Store:</strong> {selectedLog.store || 'N/A'}</li>
                  <li className="list-group-item"><strong>User Agent:</strong> {selectedLog.userAgent || 'N/A'}</li>
                  {selectedLog.details && (
                    <li className="list-group-item">
                      <strong>Details:</strong>
                      <ul className="mt-2">
                        {Object.entries(selectedLog.details).map(([key, value]) => (
                          <li key={key}>
                            {key}: <strong>{String(value)}</strong>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedLog(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLog;
