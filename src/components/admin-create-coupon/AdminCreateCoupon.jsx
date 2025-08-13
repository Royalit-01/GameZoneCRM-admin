import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import AdminCouponPrintWrapper from "../admin-coupon-print-Wrapper/AdminCouponPrintWrapper";
import { BsStars } from "react-icons/bs";
import SnackSelector from "../SnackSelector";
import Loader from "../../pages/Loader";
import useAdminCreateCoupon from "./useAdminCreateCoupon";

const AdminCreateCoupon = () => {
  const {
    formData,
    setFormData,
    generatedCoupons,
    setGeneratedCoupons,
    selectedSnackItems,
    setSelectedSnackItems,
    loading,
    setLoading,
    handleChange,
    generateCoupons,
    handleSubmit,
    downloadPDF,
    gameStores,
  } = useAdminCreateCoupon();

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={styles.container}>
      <ToastContainer />
      <div style={styles.header}>
        <BsStars style={{ color: "#ff9800", marginRight: "8px" }} />
        <h2 style={styles.title}>Create Game Zone Coupons</h2>
      </div>

      <form onSubmit={handleSubmit} style={styles.formWrapper}>
        <div style={styles.formColumn}>
          <label htmlFor="prefix">Add Prefix</label>
          <input
            style={styles.input}
            name="prefix"
            placeholder="Prefix (e.g. GZ2025)"
            value={formData.prefix}
            onChange={handleChange}
            required
          />
          <select
            style={styles.select}
            name="store"
            onChange={handleChange}
            value={formData.store}
          >
            <option value="all">Select Store</option>
            {gameStores.map((store) => (
              <option key={store._id} value={store.number}>
                {store.name} - {store.number}
              </option>
            ))}
          </select>
          <label htmlFor="discountType">Select Discount Type</label>
          <select
            style={styles.select}
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
          >
            <option value="flat">Flat ₹</option>
            <option value="percentage">Percentage %</option>
          </select>

          <input
            style={styles.input}
            type="number"
            name="value"
            placeholder="Value (e.g. 100)"
            value={formData.value}
            onChange={handleChange}
            required
          />
          <label htmlFor="count">Number of Coupons to be Generated</label>
          <input
            style={styles.input}
            type="number"
            name="count"
            min="1"
            max="500"
            value={formData.count}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formColumn}>
          <label>Start Date</label>
          <input
            style={styles.input}
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />

          <label>End Date</label>
          <input
            style={styles.input}
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        {/* Multi-select Snack Dropdown */}
        <SnackSelector
          onChange={({ selectedItems }) => setSelectedSnackItems(selectedItems)}
        />

        <button type="submit" style={styles.button}>
          Generate Coupons
        </button>
      </form>

      {generatedCoupons.length > 0 && (
        <>
          <div style={styles.couponGrid}>
            {generatedCoupons.map((code, idx) => (
              <div key={code} id={`coupon-${idx}`}>
                <AdminCouponPrintWrapper
                  code={code}
                  discountType={formData.discountType}
                  value={formData.value}
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  freeSnacks={selectedSnackItems}
                />
              </div>
            ))}
          </div>
          <button style={styles.downloadBtn} onClick={downloadPDF}>
            📄 Download All as PDF
          </button>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f7f9fb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "40px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "1.8rem",
    color: "#333",
    margin: 0,
  },
  formWrapper: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "660px",
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    justifyContent: "space-between",
  },
  formColumn: {
    flex: "1 1 45%",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "10px 12px",
    fontSize: "0.9rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "10px 12px",
    fontSize: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    background: "#28a745",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "0.8rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
  couponGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "16px",
    marginTop: "32px",
  },
  downloadBtn: {
    marginTop: "20px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  multiSelectWrapper: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "bold",
    fontSize: "0.8rem",
    color: "#333",
  },
  dropdown: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px 12px",
    cursor: "pointer",
    background: "#fff",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#fff",
    zIndex: 10,
    marginTop: "4px",
    maxHeight: "160px",
    overflowY: "auto",
  },
  dropdownItem: {
    padding: "8px 12px",
    cursor: "pointer",
  },
  selectedSnacks: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "6px",
  },
  snackTag: {
    background: "#e0f2fe",
    borderRadius: "16px",
    padding: "4px 10px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  removeIcon: {
    cursor: "pointer",
    fontWeight: "bold",
    color: "#ef4444",
  },
};

export default AdminCreateCoupon;
