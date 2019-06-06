var http       = require("http");
var express    = require('express');
var app        = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');

//start mysql connection
var connection = mysql.createConnection({
  host     : 'localhost', //mysql database host name
  user     : 'dev', //mysql database user name
  password : 'iotdb', //mysql database password
  database : 'weather' //mysql database name
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})
//end mysql connection

//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration

//enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//end enable cors

//create app server
var server = app.listen(3000,  "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

}); 


//REST-Endpoint um alle Stationen auszugeben
app.get('/station', function (req, res, next) {
   connection.query('SELECT * FROM stations', function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//REST-Endpoint um die Daten einer Station auszugeben
app.get('/station/:id', function (req, res, next) {
   connection.query('SELECT * FROM stations WHERE idstations=?', [req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//REST-Endpoint um alle Sensoren einer Station auszugeben - Felder werden hier umbenannt!
app.get('/station/:id/sensors/', function (req, res, next) {
   connection.query('SELECT DISTINCT sensor_type AS "text", sensor_type AS "value" FROM sensordata WHERE id_station=? GROUP BY sensor_type ORDER BY sensor_type', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//REST-Endpoint um alle Daten einer Station auszugeben
app.get('/station/:id/data', function (req, res, next) {
   connection.query('SELECT * FROM sensordata WHERE id_station=?', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//REST-Endpoint um Daten eines Sensors einer Station auszugeben
app.get('/station/:id/:sid/data', function (req, res, next) {
   console.log([req.params.id, req.params.sid]);
   connection.query('SELECT date_format(timestamp, "%Y-%m-%dT%TZ") AS "x", value AS "y" FROM sensordata WHERE id_station=? AND sensor_type=? ORDER BY timestamp', [req.params.id, req.params.sid], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});