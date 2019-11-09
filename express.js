
const express = require('express');
const bot = require("./index2.js")
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
  request.send("Ok")
  request.sendFiles("index.html")
});
app.listen(process.env.PORT);

console.log("bitch")