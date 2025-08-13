import React from 'react';
import gameLogo from '../../assets/logo.jpg';
import Barcode from 'react-barcode';

const AdminCouponPrintWrapper = ({ code, discountType, value, startDate, endDate, freeSnacks }) => {
  const issueDate = new Date().toLocaleDateString();
  const formattedStart = new Date(startDate).toLocaleDateString();
  const formattedExpiry = new Date(endDate).toLocaleDateString();
  
  const getThemeColors = () => {
    if (discountType === 'flat') {
      return value >= 200 ? ['#ff3c3c', '#6a1b9a'] : ['#f06292', '#283593'];
    } else {
      return value >= 50 ? ['#00c853', '#1b5e20'] : ['#00bcd4', '#0d47a1'];
    }
  };

  const [primary, secondary] = getThemeColors();

  const cardStyle = {
    ...styles.card,
    background: `linear-gradient(135deg, ${primary}, ${secondary})`,
    boxShadow: `0 0 10px ${primary}88`,
    border: `2px solid #ffffff22`,
  };

  return (
    <div style={styles.outer}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={styles.header}>
          <img src={gameLogo} alt="Game Zone" style={styles.logo} />
          <h2 style={styles.title}>🎮 GAME ZONE COUPON</h2>
        </div>

        {/* Info Section */}
        <div style={styles.infoBox}>
          <div style={styles.row}>
            <span style={styles.label}>Code</span>
            <span style={styles.code}>{code}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Discount</span>
            <span style={styles.discount}>
              {discountType === 'flat' ? `₹${value}` : `${value}%`}
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Valid From</span>
            <span style={styles.expiry}>{formattedStart}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Expires</span>
            <span style={styles.expiry}>{formattedExpiry}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Issued</span>
            <span style={styles.issued}>{issueDate}</span>
          </div>

          {/* Free Snacks Optional */}
{freeSnacks?.length > 0 && (
  <div style={styles.rowColumn}>
    <span style={styles.label}>Free Snacks</span>
    <p style={styles.snackList}>
    {freeSnacks
  .map((snack) => `${snack.snackName} (x${snack.snackQuantity}, ₹${snack.snackPrice})`)
  .join(', ')}


    </p>
  </div>
)}

        </div>

        {/* Barcode */}
        <div style={styles.barcode}>
          <Barcode value={code} width={1.5} height={40} displayValue={false} background="transparent" />
        </div>

        {/* Terms */}
        <div style={styles.termsBox}>
          <p style={styles.termsTitle}>📌 Terms & Conditions</p>
          <ul style={styles.termsList}>
            <li>Valid for one-time use only.</li>
            <li>Cannot be exchanged for cash.</li>
            <li>Redeemable only at GameZone outlets.</li>
            <li>Must be used before the expiry date.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  outer: {
    padding: '10px',
    display: 'inline-block',
    breakInside: 'avoid',
  },
  card: {
    color: '#fff',
    width: '320px',
    padding: '18px',
    borderRadius: '16px',
    fontFamily: "'Orbitron', sans-serif",
    overflow: 'hidden',
  },
  header: {
    textAlign: 'center',
    marginBottom: '12px',
  },
  logo: {
    width: '140px',
    height: '70px',
    borderRadius: '10px',
    marginBottom: '6px',
    objectFit: 'cover',
    boxShadow: '0 0 8px #000',
  },
  title: {
    fontSize: '1.1rem',
    letterSpacing: '1px',
    textShadow: '1px 1px 2px #000',
  },
  infoBox: {
    background: 'rgba(255,255,255,0.08)',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '14px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  rowColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '6px',
  },
  label: {
    fontSize: '0.85rem',
    color: '#ddd',
  },
  code: {
    fontSize: '1rem',
    fontWeight: 'bold',
    background: '#212121',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  discount: {
    fontWeight: 'bold',
    color: '#fff176',
  },
  expiry: {
    color: '#fdd835',
  },
  issued: {
    color: '#b2ebf2',
  },
  snackList: {
    listStyle: 'disc',
    paddingLeft: '20px',
    margin: 0,
    color: '#ffecb3',
    fontSize: '0.85rem',
  },
  snackItem: {
    marginBottom: '2px',
  },
  barcode: {
    background: '#fff',
    padding: '6px',
    borderRadius: '6px',
    textAlign: 'center',
    marginTop: '10px',
  },
  termsBox: {
    borderTop: '1px dashed #ffffff44',
    marginTop: '12px',
    paddingTop: '8px',
  },
  termsTitle: {
    fontSize: '0.9rem',
    color: '#ffc107',
    marginBottom: '6px',
  },
  termsList: {
    fontSize: '0.75rem',
    color: '#eee',
    paddingLeft: '16px',
    margin: 0,
    listStyle: 'square',
  },
};

export default AdminCouponPrintWrapper;
