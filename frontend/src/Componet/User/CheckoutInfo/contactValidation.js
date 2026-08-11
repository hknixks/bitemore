const ContactValidation = (deliveryInfo) => {
    if (!deliveryInfo.address) {
        return {
            status: "error",
            message: "Delivery address is required. Please provide a valid delivery address.",
        };
    }
    if (!deliveryInfo.phoneNo) {
        return {
            status: "error",
            message: "Phone number is required. Please provide a valid phone number.",
        };
    } else if (!/^\d{10,11}$/.test(deliveryInfo.phoneNo)) {
        return {
            status: "error",
            message: "Invalid phone number format. Please provide a 10 or 11 digit phone number.",
        };
    }
    if (!deliveryInfo.state) {
        return {
            status: "error",
            message: "State is required. Please select a state from the list.",
        };
    }
    if (!deliveryInfo.city) {
        return {
            status: "error",
            message: "City is required. Please select a city from the list.",
        };
    }
    return {
        status: "success",
        message: "Validation successful.",
    };
};

export default ContactValidation;
