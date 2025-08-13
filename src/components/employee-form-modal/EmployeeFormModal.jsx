import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import useEmployeeFormModal from "./useEmployeeFormModal";

export default function EmployeeFormModal({ show, onHide, onSave, employee }) {
  const {
    form,
    setForm,
    submitting,
    setSubmitting,
    soundRef,
    playSound,
    toastWithSound,
    handleChange,
    handleSubmit,
    savedEmployee,
    gameStores,
  } = useEmployeeFormModal(employee, show, onSave, onHide);

  return (
    <>
      <audio ref={soundRef} src="/toast-sound.wav" preload="auto" />

      <Modal
        show={show}
        onHide={onHide}
        centered
        dialogClassName="responsive-modal"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton className="py-2 px-3">
            <Modal.Title style={{ fontSize: "1.1rem" }}>
              {employee ? "Edit Employee" : "Add Employee"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="py-2 px-3">
            <Form.Group className="mb-2">
              <Form.Label className="small mb-1">Name</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
                disabled={submitting}
                size="sm"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small mb-1">Phone</Form.Label>
              <Form.Control
                name="number"
                value={form.number}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={submitting}
                size="sm"
                type="number"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small mb-1">Password</Form.Label>
              <Form.Control
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                disabled={submitting}
                size="sm"
                type="password"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small mb-1">Aadhaar Number</Form.Label>
              <Form.Control
                name="adhar"
                value={form.adhar}
                onChange={handleChange}
                placeholder="Enter Aadhaar number"
                disabled={submitting}
                size="sm"
                type="number"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small mb-1">Role</Form.Label>
              <Form.Control
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Enter role"
                disabled={submitting}
                size="sm"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small mb-1">Store</Form.Label>
              <Form.Select
                name="store"
                value={form.store}
                onChange={handleChange}
                required
              >
                <option value="">Select a store...</option>
                {/* Map through your store options here */}
                {gameStores.map((store) => (
                  <option key={store._id} value={store.number}>
                    {store.name} - {store.number}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="py-2 px-3">
            <Button
              variant="secondary"
              onClick={onHide}
              disabled={submitting}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
              size="sm"
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : employee ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <style>{`
        @media (max-width: 576px) {
          .responsive-modal .modal-dialog {
            margin: 0.5rem;
          }
          .responsive-modal .modal-content {
            border-radius: 0.5rem;
          }
          .responsive-modal .modal-header,
          .responsive-modal .modal-body,
          .responsive-modal .modal-footer {
            padding: 0.75rem;
          }
          .responsive-modal .form-control {
            font-size: 0.85rem;
          }
          .responsive-modal .btn {
            font-size: 0.85rem;
            padding: 0.3rem 0.6rem;
          }
        }
      `}</style>
    </>
  );
}
