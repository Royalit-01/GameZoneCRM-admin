import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Card, Badge } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { BsPlus, BsPencilSquare, BsTrash } from 'react-icons/bs';
import 'react-toastify/dist/ReactToastify.css';
import EmployeeFormModal from '../employee-form-modal/EmployeeFormModal';
import Loader from '../../pages/Loader';
import useEmployeeTable from './useEmployeeTable';

export default function EmployeesTable() {
  
    const {employees,handleAdd, handleSave,playSound ,handleEdit,handleDelete ,toastWithSound,soundRef,backendUrl, setEmployees,showModal,loading,setLoading, setShowModal,editingEmployee, setEditingEmployee}= useEmployeeTable()


  if(loading){
    return(
      <Loader/>
    )
  }

  return (
    <>
      <audio ref={soundRef} src="/toast-sound.wav" preload="auto" />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">👥 Employee Management</h3>
        <Button variant="success" onClick={handleAdd}>
          <BsPlus className="me-2" />
          Add Employee
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="d-none d-md-block">
        <Card className="shadow-sm rounded-4">
          <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
            <span>All Employees</span>
            <Badge bg="light" text="dark">{employees.length} total</Badge>
          </Card.Header>
          <Card.Body className="p-0">
            <Table hover responsive className="mb-0 table-borderless">
              <thead className="bg-light text-secondary text-uppercase">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Password</th>
                  <th>Adhar No</th>
                  <th>Store</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={emp._id} className="align-middle">
                    <td>{idx + 1}</td>
                    <td>{emp.name}</td>
                    <td>{emp.role}</td>
                    <td>{emp.number}</td>
                    <td>{emp.password}</td>
                    <td>{emp.adhar}</td>
                    <td>{emp.store}</td>
                    <td className="text-end">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(emp)}
                      >
                        <BsPencilSquare />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(emp._id)}
                      >
                        <BsTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="d-md-none">
        {employees.map(emp => (
          <Card key={emp._id} className="mb-3 shadow-sm rounded-4">
            <Card.Body className="py-3 px-4">
              <p className="mb-1"><strong>ID:</strong> {emp._id}</p>
              <p className="mb-1"><strong>Name:</strong> {emp.name}</p>
              <p className="mb-1"><strong>Role:</strong> {emp.role}</p>
              <p className="mb-1"><strong>Phone:</strong> {emp.number}</p>
              <p className="mb-1"><strong>Password:</strong> {emp.password}</p>
              <p className="mb-1"><strong>Adhar No:</strong> {emp.adhar}</p>
              <p className="mb-3"><strong>Store:</strong> {emp.store}</p>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => handleEdit(emp)}
                >
                  <BsPencilSquare className="me-1" />
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(emp._id)}
                >
                  <BsTrash className="me-1" />
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Employee Form Modal */}
      <EmployeeFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        employee={editingEmployee}
      />
    </>
  );
}
