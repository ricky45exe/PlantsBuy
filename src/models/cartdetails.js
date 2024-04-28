function loginUser(sessionId) {
  localStorage.setItem("sessionId", sessionId);
  console.log("Session ID: " + sessionId);
}
module.exports = loginUser;
