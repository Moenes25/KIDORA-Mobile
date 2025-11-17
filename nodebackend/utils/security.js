// utils/security.js

// Escape HTML to prevent XSS attacks
function escapeHTML(str) {
  if (!str) return "";
  
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;");
}

// Clean user input automatically
function sanitizeInput(input) {
  if (typeof input === "string") {
    return escapeHTML(input.trim());
  }

  if (typeof input === "object" && input !== null) {
    const sanitized = {};
    for (let key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }

  return input;
}

module.exports = {
  escapeHTML,
  sanitizeInput
};
