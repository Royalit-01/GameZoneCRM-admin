// components/PrintableView.jsx
import React, { forwardRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const PrintableView = forwardRef(({ coupons, discountType, value, expiresAt }, ref) => {
  return (
    <div ref={ref} style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Coupon List</h2>
      {coupons.map((coupon, i) => (
        <div key={i} style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <p><strong>Code:</strong> {coupon.code}</p>
            <p><strong>Discount:</strong> {value} ({discountType})</p>
            <p><strong>Expires:</strong> {expiresAt}</p>
             {/* ✅ Free Snacks Display */}
            {coupon.freeSnacks && coupon.freeSnacks.length > 0 && (
              <p>
                <strong>Free Snacks:</strong>{" "}
                {coupon.freeSnacks.map(snack =>
                  `${snack.name} (x${snack.quantity}, ₹${snack.price})`
                ).join(", ")}
              </p>
            )}
          </div>
          <QRCodeCanvas value={coupon.code} size={64} />
        </div>
      ))}
    </div>
  );
});

export default PrintableView;
