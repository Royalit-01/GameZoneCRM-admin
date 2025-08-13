const useAdminCouponPrintWrapper = () => {
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
    return { issueDate,formattedStart,formattedExpiry,getThemeColors,cardStyle ,primary, secondary}
}

export default useAdminCouponPrintWrapper