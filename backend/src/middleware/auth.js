// This middleware checks if the user is authenticated by looking for a valid session token in the signed cookies.
// If the token is valid, it attaches the user session to the request object and allows the request to proceed.
// If not, it responds with a 401 Unauthorized error.
const sessions = require("../sessions");

module.exports = (req, res, next) => {
  const token = req.signedCookies.authToken;
  const session = token && sessions[token];
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  next();
};
