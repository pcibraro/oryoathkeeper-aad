const express = require("express");

const app = express();

app.use("/api/echo", (req, res) => {
  
  var username = req.headers["x-auth-username"] || "none";
  var email = req.headers["x-auth-email"] || "none";

  console.log(`username ${username}`);
  console.log(`email ${email}`);

  return res.json({
    username,
    email
  });
});

const port = process.env.SERVER_PORT || 9002;
const host = process.env.SERVER_HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log(`protected api listening at http://${host}:${port}`);
});