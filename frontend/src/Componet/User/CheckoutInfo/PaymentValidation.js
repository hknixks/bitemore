const PaymentValidation = (cart, deliveryInfo, user) => {
    if (cart.length === 0) {
        return {
            status: "error",
            message: "Your cart is empty. Please add items to your cart before proceeding to payment.",
        };
    }
    if (!user.email) {
        return {
            status: "error",
            message: "Email is required for payment. Please provide a valid email address.",
        };
    }
    if (!deliveryInfo.address) {
        return {
            status: "error",
            message: "Delivery address is required. Please provide a valid delivery address.",
        };
    }
    if (!deliveryInfo.city) {
        return {
            status: "error",
            message: "City is required for delivery. Please provide a valid city.",
        };
    }
    if (!deliveryInfo.state) {
        return {
            status: "error",
            message: "State is required for delivery. Please provide a valid state.",
        };
    }
    if (!deliveryInfo.phoneNo) {
        return {
            status: "error",
            message: "Phone number is required for delivery. Please provide a valid phone number.",
        };
    }
    if (!deliveryInfo.latitude || !deliveryInfo.longitude) {
        return {
            status: "error",
            message: "Geolocation is required for delivery verification. Please allow access to your device's location.",
        };
    }
    if (!deliveryInfo.amount || deliveryInfo.amount <= 0) {
        return {
            status: "error",
            message: "Invalid payment amount. Please check your order details and try again.",
        };
    }
    return {
        status: "success",
        message: "Validation successful.",
    };
};

export default PaymentValidation;
