const crypto = require('crypto');

/**
 * Generates a unique Staff Code in the format STF-XXXXX
 * where X is uppercase alphanumeric.
 * @returns {string}
 */
const generateStaffCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'STF-';
  const bytes = crypto.randomBytes(5);
  for (let i = 0; i < 5; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
};

/**
 * Generates a cryptographically secure random token (hex string).
 * @param {number} byteLength
 * @returns {string}
 */
const generateSecureToken = (byteLength = 32) => {
  return crypto.randomBytes(byteLength).toString('hex');
};

/**
 * SHA-256 hash of a string.
 * @param {string} input
 * @returns {string}
 */
const hashToken = (input) => {
  return crypto.createHash('sha256').update(input).digest('hex');
};

module.exports = { generateStaffCode, generateSecureToken, hashToken };
