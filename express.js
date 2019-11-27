const express = require("express");
const http = require("http");
 const bot = require("./index2.js");
const app = express();
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/web/index.html");
});
app.get("/e", (request, response) => {
  response.sendFile(__dirname + "/web/index2.html");
});
app.get("/thankyou", (request, response) => {
  response.sendFile(__dirname + "/web/thanks.html");
});
app.get("/commands", (request, response) => {
  response.sendFile(__dirname + "/web/cmd.html");
});
app.listen(process.env.PORT);

console.log("bitch");
