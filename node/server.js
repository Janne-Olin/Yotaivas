var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var port = 3002;
var hostname = "127.0.0.1";

var cors = function (req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(cors);

const observationRoutes = require('./routes/observationRoutes');
const skyobjectRoutes = require('./routes/skyobjectRoutes');
const typeRoutes = require('./routes/typeRoutes');
app.use(observationRoutes);
app.use(skyobjectRoutes);
app.use(typeRoutes);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});