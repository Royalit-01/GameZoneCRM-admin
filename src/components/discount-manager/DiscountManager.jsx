import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Table, Container, Card } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import { BsTrash, BsPlusLg } from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";
import { BsEye, BsTicket } from "react-icons/bs";
import Loader from "../../pages/Loader";
import useDiscountManager from "./useDiscountManager";

export default function DiscountManager({ onNavigate }) {
  const {
    discounts,
    form,
    loading,
    soundRef,
    handleChange,
    handleSubmit,
    handleDelete,
    gameStores,
  } = useDiscountManager();

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="mt-4 px-2">
      {/* Use relative path so it works under subpaths after deployment */}
      <audio ref={soundRef} src="/toast-sound.wav" preload="auto" />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Slide}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">🎮 Game Time Discount Rules</h3>
        <div>
          <Button
            variant="outline-success"
            className="me-2"
            onClick={() => onNavigate("Create Coupon")}
          >
            <BsTicket className="me-1" /> Create Coupon
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => onNavigate("View Coupons")}
          >
            <BsEye className="me-1" /> View Coupons
          </Button>
        </div>
      </div>

      <Card className="mb-4 shadow-sm rounded-4 discount-form">
        <Card.Header className="bg-success text-white">
          <strong>
            <BsPlusLg className="me-2" /> Add Discount Rule
          </strong>
        </Card.Header>
        <Card.Body>
          <Form className="row g-3">
            <Form.Group className="col-md-6">
              <Form.Label>Select Store</Form.Label>
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
            <Form.Group className="col-md-6">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Discount Type</Form.Label>
              <Form.Select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Flat Amount (₹)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Discount Value</Form.Label>
              <Form.Control
                type="number"
                name="discountValue"
                value={form.discountValue}
                onChange={handleChange}
                placeholder={
                  form.discountType === "percent"
                    ? "e.g. 10 for 10%"
                    : "e.g. 50 for ₹50 off"
                }
              />
            </Form.Group>
            <div className="col-12">
              <Button
                className="w-100 mt-2"
                variant="primary"
                onClick={handleSubmit}
              >
                Save Discount Rule
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm rounded-4">
        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
          <span>Active Discounts</span>
          <span className="badge bg-light text-dark">
            {discounts.length} rule(s)
          </span>
        </Card.Header>
        <Card.Body className="p-0">
          <Table bordered hover responsive className="mb-0">
            <thead className="table-light text-uppercase text-secondary">
              <tr>
                <th>Dates</th>
                <th>Times</th>
                <th>Type</th>
                <th>Value</th>
                <th>Store</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts && discounts.length > 0 ? (
                discounts.map((rule) => (
                  <tr key={rule._id}>
                    <td>
                      {rule.startDate.slice(0, 10)} to {rule.endDate.slice(0, 10)}
                    </td>
                    <td>
                      {rule.startTime} – {rule.endTime}
                    </td>
                    <td>
                      {rule.discountType === "percent" ? "Percentage" : "Flat"}
                    </td>
                    <td>
                      {rule.discountType === "percent"
                        ? `${rule.discountValue}%`
                        : `₹${rule.discountValue}`}
                    </td>
                    <td>{rule.store}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(rule._id)}
                      >
                        <BsTrash className="me-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No discount rules found. Create your first discount rule above.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          .discount-form {
            margin: 0 auto;
            padding: 10px !important;
          }
          .discount-form .form-label {
            font-size: 0.9rem;
          }
          .discount-form .form-control,
          .discount-form .form-select {
            font-size: 0.9rem;
            padding: 6px 10px;
          }
        }
        button svg {
          vertical-align: middle;
        }
      `}</style>
    </Container>
  );
}
