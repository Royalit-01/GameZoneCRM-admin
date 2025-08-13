import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Pagination,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import Loader from "../pages/Loader";

const itemsPerPage = 8;

function Payment_Table() {
  const [ledgers, setLedgers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("VITE_BACKEND_PATH/api/admin")
      .then((res) => res.json())
      .then((data) => {
        setLedgers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ledgers:", err);
        setLoading(false);
      });
  }, []);

  const handleSearchName = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchPhone = (e) => {
    setSearchPhone(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchName("");
    setSearchPhone("");
    setCurrentPage(1);
  };

  const filtered = ledgers.filter((ledger) => {
    const nameMatch = ledger.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const phoneMatch = ledger.phoneNumber?.includes(searchPhone);
    return nameMatch && phoneMatch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPageNumbers = () => {
    const pages = [];
    const range = 2; // current ± range pages visible
    let start = Math.max(1, currentPage - range);
    let end = Math.min(totalPages, currentPage + range);

    if (start > 1) {
      pages.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (start > 2)
        pages.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1)
        pages.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      pages.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <Container fluid className="p-3">
      <h2 className="mb-4 text-center text-success">Ledger Records</h2>

      {/* Filters */}
      <Row className="mb-3 g-2 justify-content-center">
        <Col xs={12} sm={6} md={4}>
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={handleSearchName}
          />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Form.Control
            type="text"
            placeholder="Search by phone"
            value={searchPhone}
            onChange={handleSearchPhone}
          />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Button
            variant="outline-danger"
            className="w-100"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Col>
      </Row>

      {/* Table View (Desktop) */}
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <Table bordered hover striped className="text-center shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Ledger Amount</th>
              </tr>
            </thead>
            {/* No data found message */}
            {!loading && filtered.length === 0 && (
              <div className="text-center my-5 text-muted fs-4">
                <span role="img" aria-label="empty">
                  📭
                </span>{" "}
                No matching records found.
              </div>
            )}
            <tbody>
              {displayed.map((ledger, idx) => (
                <tr key={ledger._id}>
                  <td>{idx + 1}</td>
                  <td>{ledger.name}</td>
                  <td>{ledger.phoneNumber}</td>
                  <td
                    style={{
                      color: ledger.ledgerAmount < 0 ? "red" : "#22c55e",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{ledger.ledgerAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Card View (Mobile) */}
      <div className="d-md-none">
        {displayed.map((ledger) => (
          <Card key={ledger._id} className="mb-3 shadow-sm">
            <Card.Body>
              <div>
                <strong>Customer ID:</strong> {ledger.customerId}
              </div>
              <div>
                <strong>Name:</strong> {ledger.name}
              </div>
              <div>
                <strong>Phone:</strong> {ledger.phoneNumber}
              </div>
              <div>
                <strong>Ledger Amount:</strong>{" "}
                <span
                  style={{
                    color: ledger.ledgerAmount < 0 ? "red" : "#22c55e",
                    fontWeight: "bold",
                  }}
                >
                  ₹{ledger.ledgerAmount.toLocaleString()}
                </span>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          <Pagination.First
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          />
          {renderPageNumbers()}
          <Pagination.Next
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </Container>
  );
}

export default Payment_Table;
