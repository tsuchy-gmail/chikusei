const functions = require("firebase-functions");
const express = require("express");
const basicAuth = require("basic-auth-connect");

const app = express();

const userId = encodeURIComponent(functions.config().user.id);
const userPw = encodeURIComponent(functions.config().user.pw);

app.all(
  "/*",
  basicAuth((user, password) => user === userId && password === userPw)
);

app.use(express.static(__dirname + "/app/build/"));

exports.app = functions.https.onRequest(app);
