import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Pagination,
  Container,
  Card,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import Loader from "../../pages/Loader";
import useCustomerTable from "../../components/customer-table/useCustomerTable";



function CustomerTable() {

  
  const {setCurrentPage,setSearch, setSelectedDate,setShowModal,setSelectedCustomer, customers, search, currentPage, selectedCustomer, showModal, selectedDate, storeFilter, loading, handleSearch,setStoreFilter, handleRowClick,filtered, formatDateTime,calculateFinalTotal,totalPages,displayed}=useCustomerTable()
  
 
 

 
 

  if(loading){
    return(
      <Loader/>
    )
  }

  return (
    <Container fluid className="p-3">
      <h2 className="mb-4">Customer List</h2>

      {/* Filter Row */}
      <Row className="align-items-end g-3 mb-4">
        <Col md={3} sm={12}>
          <Form.Group>
            <Form.Label>📅 Filter by Date</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSearch("");
                setCurrentPage(1);
              }}
            />
          </Form.Group>
        </Col>

        <Col md={3} sm={12}>
          <Form.Group>
            <Form.Label>🏬 Filter by Store</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter store number"
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={6} sm={12}>
          <Form.Label>🔍 Search Customers</Form.Label>
          <InputGroup className="shadow-sm">
            <Form.Control
              type="text"
              placeholder="Search by name, phone, amount..."
              value={search}
              onChange={handleSearch}
              className="py-1"
              style={{ fontSize: "14px" }}
            />
            <Button variant="dark" size="sm" className="px-3">
              Search
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Desktop Table */}
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <Table bordered striped hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Online Amount</th>
                <th>Cash Amount</th>
                <th>Final Total Amount</th>
                <th>Store</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((cust, idx) => (
                <tr
                  key={cust._id}
                  onClick={() => handleRowClick(cust)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{idx + 1}</td>
                  <td>{cust.name}</td>
                  <td>{cust.phone}</td>
                  <td>₹{cust.onlineAmount || 0}</td>
                  <td>₹{cust.cashAmount || 0}</td>
                  <td>₹{calculateFinalTotal(cust)}</td>
                  <td>{cust.store}</td>
                  <td>{cust.status}</td>
                  <td>{formatDateTime(cust.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="d-md-none">
        {displayed.map((cust) => (
          <Card
            key={cust._id}
            className="mb-2 shadow-sm mx-auto"
            style={{ maxWidth: "95%", cursor: "pointer" }}
            onClick={() => handleRowClick(cust)}
          >
            <Card.Body className="py-2 px-3">
              <p className="mb-1"><strong>ID:</strong> {cust._id.slice(-6)}</p>
              <p className="mb-1"><strong>Name:</strong> {cust.name}</p>
              <p className="mb-1"><strong>Phone:</strong> {cust.phone}</p>
              <p className="mb-1"><strong>Online:</strong> ₹{cust.onlineAmount || 0}</p>
              <p className="mb-1"><strong>Cash:</strong> ₹{cust.cashAmount || 0}</p>
              <p className="mb-1"><strong>Total:</strong> ₹{calculateFinalTotal(cust)}</p>
              <p className="mb-1"><strong>Status:</strong> {cust.status}</p>
              <p className="mb-1"><strong>Created:</strong> {formatDateTime(cust.created_at)}</p>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="justify-content-center mt-3">
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i}
            active={i + 1 === currentPage}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Customer Full Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer ? (
            <div>
              {["name", "phone", "store", "screen", "duration", "snacks", "drink",
                "paid", "nonPlayingMembers", "total_amount", "payment", "players",
                "wallet", "status", "extended_amount", "extended_time",
                "extraSnacksPrice", "created_at"].map((field) => (
                <p key={field} className="mb-1">
                  <strong>{field === "total_amount" ? "First Time Total Amount" : field.replace(/([A-Z])/g, " $1")}: </strong>
                  {field === "created_at"
                    ? new Date(selectedCustomer[field]).toLocaleString()
                    : selectedCustomer[field] ?? "—"}
                </p>
              ))}
              <p className="mb-1">
                <strong>Final Total Amount: </strong>
                ₹{calculateFinalTotal(selectedCustomer)}
              </p>
            </div>
          ) : (
            <p>No data</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CustomerTable;
