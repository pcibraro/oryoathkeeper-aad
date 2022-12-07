const express = require("express");
const request = require("request-promise");
const cookie = require("cookie-parser");
const { json } = require("express");
const jwt_decode = require("jwt-decode");

require('dotenv').config();

const app = express();
app.use(cookie());

const OATHKEEPER_URL = process.env.OATHKEEPER_URL;
const AAD_URL = process.env.AAD_URL;
const AAD_CLIENT_ID = process.env.AAD_CLIENT_ID;
const AAD_CLIENT_SECRET = process.env.AAD_CLIENT_SECRET;

const AAD_REDIRECT_URL = `${OATHKEEPER_URL}/aad/exchange`;
const COOKIE_KEY = "id_token";

const cookieOptions = ({ expiresIn = 900000 }) => ({
  expires: new Date(Date.now() + expiresIn),
  httpOnly: true,
  // secure: true, // disabled for testing locally
});

const exchangeToken = async ({ code, redirect_uri }) => {
  const uri = `${AAD_URL}/token`;
  const payload = {
    client_id: AAD_CLIENT_ID,
    client_secret: AAD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri,
  };
  
  const response = await request(uri, {
    method: "POST",
    form: payload,
  });

  const body = JSON.parse(response);

  return body;
};

app.use("/aad/authorize", (req, res) => {
  const scope = [ "openid", "profile", "email" ]
  const redirect_uri = req.query.redirect_uri || "http://localhost:9000/aad/whoaim";
  const query = [
    "response_type=code",
    `client_id=${AAD_CLIENT_ID}`,
    `redirect_uri=${AAD_REDIRECT_URL}`,
    `scope=${scope.join("%20")}`,
    `state=${return_uri}`
  ];
  const redirectUrl = `${AAD_URL}/authorize?` + query.join("&");
  return res.redirect(redirectUrl);
});

app.use("/aad/exchange", (req, res) => {
  console.log("req.headers", req.headers);
  console.log("req.query", req.query);
  console.log("req.cookie", req.cookies);
  const code = req.query.code;
  const redirect_uri = AAD_REDIRECT_URL;
  exchangeToken({ code, redirect_uri })
  .then((data) => {
      res.cookie(COOKIE_KEY, data.id_token, cookieOptions({}));
      return res.redirect(req.query.state);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use("/aad/logout", (req, res) => {
    const query = [
    `client_id=${AAD_CLIENT_ID}`,
    `post_logout_redirect_uri=${req.query.redirect_uri}`,
  ];
  const logoutUrl = `${AAD_URL}/logout?${query.join("&")}`;
  res.cookie(COOKIE_KEY, null, { expires: new Date(0) });
  res.redirect(logoutUrl)
});

app.use("/aad/whoaim", (req, res) => {
    var idtoken = req.cookies[COOKIE_KEY];
    var decoded = jwt_decode(idtoken);
    return res.json(decoded);
});

app.use("/aad/ack", (req, res) => {
    return res.json({msg: 'hello'});
});

const port = process.env.SERVER_PORT || 9001;
const host = process.env.SERVER_HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log(`auth service listening at http://${host}:${port}`);
});