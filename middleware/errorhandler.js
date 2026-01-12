const { logevents } = require("./logevent");
const errorhandler = function (err, req, res, next) {
  if (err.stack) console.error("Stack:", err.stack);
  logevents(`${err.name}: ${err.message}`, "errLog.txt");

  const status = err.status || 500;
  res.status(status).send(err.message || "Internal Server Error");
};

module.exports = errorhandler;
