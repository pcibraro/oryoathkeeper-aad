const express = require("express");

const app = express();

app.use("/api/echo", (req, res) => {
  
  var headers = [];

  for (var key in req.headers) {
    if(key.startsWith('x-auth-')){
      headers.push({
        key,
        value: req.headers[key]
      });
    }
  }

  console.log(headers);

  return res.json(headers);
});

const port = process.env.SERVER_PORT || 9006;
const host = process.env.SERVER_HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log(`protected api listening at http://${host}:${port}`);
});