const DeliveryValidation = (deliveryInfo) => {
    if (!deliveryInfo.deliveryType) {
        return {
            status: "error",
            message: "Delivery type is required. Please select a delivery type.",
        };
    }
    if (!deliveryInfo.state) {
        return {
            status: "error",
            message: "State is required for delivery. Please select a valid state.",
        };
    }
    if (!deliveryInfo.city) {
        return {
            status: "error",
            message: "City is required for delivery. Please select a valid city.",
        };
    }
    if (!deliveryInfo.address) {
        return {
            status: "error",
            message: "Delivery address is required. Please provide a valid delivery address.",
        };
    }
    if (!deliveryInfo.phoneNo) {
        return {
            status: "error",
            message: "Phone number is required for delivery. Please provide a valid phone number.",
        };
    }
    // if (!deliveryInfo.latitude || !deliveryInfo.longitude) {
    //     return {
    //         status: "error",
    //         message: "Geolocation is required for delivery. Please allow access to your device's location.",
    //     };
    // }
    if (deliveryInfo.deliverNote && deliveryInfo.deliverNote.length > 200) {
        return {
            status: "error",
            message: "Delivery note is too long. Please provide a note with a maximum of 200 characters.",
        };
    }
    return {
        status: "success",
        message: "Validation successful.",
    };
};

export default DeliveryValidation;
