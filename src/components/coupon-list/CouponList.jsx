import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import useCouponList from "./useCouponList";

const CouponList = ({ showExpired = false }) => {
  const {
    coupons,
    setCoupons,
    filteredCoupons,
    setFilteredCoupons,
    loading,
    setLoading,
    currentPage,
    setCurrentPage,
    filters,
    setFilters,
    fetchCoupons,
    applyDateFilter,
    downloadCSV,
    offset,
    currentCoupons,
    pageCount,
    usedCount,
    unusedCount,
  } = useCouponList(showExpired);

  return (
    <div className="container-fluid mt-4">
      <div className="mb-3 d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <h5>🎟️ Coupon Summary</h5>
        <div className="d-flex gap-2">
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="form-control"
            placeholder="From"
          />
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="form-control"
            placeholder="To"
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => setFilters({ from: "", to: "" })}
          >
            Reset
          </button>
          <button className="btn btn-primary" onClick={downloadCSV}>
            Download CSV
          </button>
        </div>
      </div>

      <div className="mb-3">
        <span className="badge bg-primary me-2">
          Total: {filteredCoupons.length}
        </span>
        <span className="badge bg-success me-2">Used: {usedCount}</span>
        <span className="badge bg-warning text-dark">
          Unused: {unusedCount}
        </span>
      </div>

      {loading ? (
        <p>Loading coupons...</p>
      ) : filteredCoupons.length === 0 ? (
        <p>No coupons to show.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center table-striped">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Start Date</th>
                  <th>Expires</th>
                  <th>Used</th>
                  <th>Free Snacks</th>
                  <th>Store</th>
                </tr>
              </thead>
              <tbody>
                {currentCoupons.map((c, i) => (
                  <tr key={c._id}>
                    <td>{offset + i + 1}</td>
                    <td>{c.code}</td>
                    <td>{c.discountType}</td>
                    <td>
                      {c.discountType === "percentage"
                        ? `${c.value}%`
                        : `₹${c.value}`}
                    </td>
                    <td>{new Date(c.startDate).toLocaleDateString()}</td>
                    <td>{new Date(c.expiresAt).toLocaleDateString()}</td>
                    <td>{c.used ? "✅" : "❌"}</td>
                    <td>
                      {Array.isArray(c.freeSnacks) && c.freeSnacks.length > 0
                        ? c.freeSnacks
                            .map(
                              (s) =>
                                `${s.snackName} (x${s.snackQuantity}, ₹${s.snackPrice})`
                            )
                            .join(", ")
                        : "—"}
                    </td>
                    <td>{c.store}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            containerClassName="pagination justify-content-center mt-3"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
          />
        </>
      )}
    </div>
  );
};

export default CouponList;
