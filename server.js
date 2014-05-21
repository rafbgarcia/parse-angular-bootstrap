var express = require('express');
var app = express();
var port = process.env.PORT || 8000; 
app.use(express.static(__dirname + "/parse/public/"));
app.listen(port);
console.log("Server started at port " + port);
