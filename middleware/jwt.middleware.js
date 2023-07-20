/** @format */

const { expressjwt: jwt } = require("express-jwt");

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
  //   getToken: (req) => getTokenFromHeaders(req),
});

// Authorization: "Bearer sdfgöerlko6234p23ok<söf"
// Function used to extracts the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7); // Remove "Bearer " from the token

    return  token;
  }

  return null;
}

// Export the middleware so that we can use it to create a protected routes
module.exports = {
  isAuthenticated,
};
