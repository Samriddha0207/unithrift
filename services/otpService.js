const crypto = require("crypto");

/**
 * Generate secure 6-digit OTP
 */
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

/**
 * Hash OTP before storing
 */
function hashOTP(otp) {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
}

/**
 * Compare entered OTP with stored hash
 */
function verifyOTP(inputOTP, storedHash) {
    const inputHash = hashOTP(inputOTP);
    return inputHash === storedHash;
}

/**
 * Create expiry timestamp
 */
function createExpiry(minutes = 10) {
    return new Date(Date.now() + minutes * 60 * 1000);
}

/**
 * Check if OTP expired
 */
function isExpired(expiryDate) {
    return new Date() > new Date(expiryDate);
}

module.exports = {
    generateOTP,
    hashOTP,
    verifyOTP,
    createExpiry,
    isExpired
};