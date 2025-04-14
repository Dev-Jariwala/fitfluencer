const FormatPrice = ({ price, showRupee = true }) => {
    if (!showRupee) {
        // Format the price without currency
        return Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    }

    // Format the price with the rupee symbol
    return Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
};

export default FormatPrice;