const allowedOrigins = [
  "https://www.google.com",
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.BACKEND_URL || "http://localhost:8000",
];

module.exports = allowedOrigins;
