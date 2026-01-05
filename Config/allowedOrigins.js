const allowedOrigins = [
  "https://www.google.com",
  process.env.FRONTEND_URL || "http://localhost:3000",
];

module.exports = allowedOrigins;
