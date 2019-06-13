//TODO: Hier eure zusätzliche Module einfügen (i.d.R. fehlt nur noch "serialport")
var http       = require("http");
var express    = require('express');
var app        = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');

//TODO: Auf eure Datenbank-Daten anpassen (user, password, database)
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

  console.log("Example App listening at http://%s:%s", host, port)

}); 
//end create app server

/* TODO: Hier muss der Code aus der vorherigen script.js hin, in dem die Daten vom Arduino in die Datenbank geschrieben werden
*  Das umfasst die Initialisierung des serialport-Moduls sowie des Parsers, und Benni's sendIt-Funktion inklusive dem von euch
*  hinzugefügten SQL-INSERT-TEIL. Dieser Teil hat nichts mit der UI zu tun und ist nur für die Kommunikation Arduino-Datenbank da.
*/



/* TODO: Ab hier müsst ihr die SQL-Kommandos auf eure Gegebenheiten anpassen (ab 'SELECT...').
*  Dabei gilt: Alles was nicht durchgehend in Großschreibung ist, sind Tabellen- oder Spaltennamen, diese müssen
*  wahrscheinlich angepasst werden. Ob die "Endpoints" funktionieren, könnt ihr im Browser testen, indem ihr
*  http://localhost:3000/<namedesendpoints> aufruft, wobei der Name das ist was bei app.get() am Anfang steht,
*  also z.B. "/station". Dann solltet ihr einen JSON-String mit den jeweiligen Daten im Browser sehen.
*
*  Dieser Teil ist nur für die Kommunikation UI-Datenbank da, und hat nichts mit dem Arduino zu tun. Bitte beachten, dass
*  in den UI-Files u.U. auch kleine Änderungen nötig sind (siehe dortige TODOs).
*
*  ACHTUNG: Je nach dem ob ihr pro Sensor eine Spalte in der Datentabelle habt oder nur eine Datenspalte und eine Sensortyp-Spalte
*  müsst ihr unten die jeweilige Funktion benutzen, und die andere löschen (komplett, also ab app.get bis zu "});"). Kommentare
*  genau lesen! Wenn ihr beide Funktionen im Script lasst startet das Script nicht!
* 
*/ 


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

//REST-Endpoint um alle Sensoren einer Station auszugeben MIT Sensortypspalte - Felder werden hier umbenannt!
app.get('/station/:id/sensors/', function (req, res, next) {
   connection.query('SELECT DISTINCT sensor_type AS "text", sensor_type AS "value" FROM sensordata WHERE id_station=? GROUP BY sensor_type ORDER BY sensor_type', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//REST-Endpoint um alle Sensoren einer Station auszugeben OHNE Sensortypspalte 
app.get('/station/:id/sensors/', function (req, res, next) {
    res.end(JSON.stringify([
        {text: "Sensorname", value: "Sensorspaltenname in DB"},
        {text: "Sensorname2", value: "Sensorspaltenname 2 in DB"},
    ]));
});

//REST-Endpoint um alle Daten einer Station auszugeben
app.get('/station/:id/data', function (req, res, next) {
   connection.query('SELECT * FROM sensordata WHERE id_station=?', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//REST-Endpoint um Daten eines Sensors einer Station auszugeben - MIT Sensortypspalte
app.get('/station/:id/:sid/data', function (req, res, next) {
   console.log([req.params.id, req.params.sid]);
   connection.query('SELECT DATE_FORMAT(timestamp, "%Y-%m-%dT%TZ") AS "x", value AS "y" FROM sensordata WHERE id_station=? AND sensor_type=? ORDER BY timestamp', [req.params.id, req.params.sid], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//REST-Endpoint um Daten eines Sensors einer Station auszugeben - OHNE Sensortypspalte
app.get('/station/:id/:sid/data', function (req, res, next) {
   console.log([req.params.id, req.params.sid]);
   connection.query('SELECT DATE_FORMAT(timestamp, "%Y-%m-%dT%TZ") AS "x", '+req.params.sid+' AS "y" FROM sensordata WHERE id_station=? ORDER BY timestamp', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});