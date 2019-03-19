require("dotenv").config();
const express = require('express');
const http = require('http');
const bp = require('body-parser');
const app = express();
const server = http.Server(app);
const session = require("express-session");
const cp = require("cookie-parser");
const cors = require("cors");
// const routes = require("./Src/Routes/Login");
const flash = require("connect-flash");

// app.use(cp("somesecret"));
// app.use(
//     session({
//         secret: "somesecret"
//     })
// );

app.use(cors());
// app.use(function(request, response, next) {
//     response.header("Access-Control-Allow-Origin", "*");
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(flash());


app.post("/do", function(req, res) {
    console.log(req);
    res.send("hello");
})

server.listen(1800, function () {
    console.log("Server started on http://localhost:1234");
});
