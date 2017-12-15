var express = require('express');
var router = express.Router();
var xlsx = require('node-xlsx');
var fs = require('fs');
var app = express();
var forEach = require('async-foreach').forEach;


var Client = require('node-rest-client').Client;
var client = new Client();



/* GET home page. */
router.get('/', function(req, res, next) {
  // Parse a file
  var datos = [];
  var workSheetsFromFile = xlsx.parse(`${__dirname}/agip.xlsx`);
  var datosExcel = workSheetsFromFile[0].data;
  datosExcel.forEach(function(item) {
    if(typeof item[0] !== 'undefined' && item[0] !== null){
      var cuit = item[3];
      if (cuit) {
        cuit = cuit.replace('-','');
        cuit = cuit.replace('-','');
      }

      var temp = JSON.parse('{ "Fecha": "' + item[0] + '" , "Factura": "' + item[1] + '" , "Nombre": "' + item[2] + '" , "CUIT": "' + item[3] + '" , "Importe": "' + item[4] + '" , "AliCuota": "' + item[5] + '" , "Percepcion": "' + item[6] + '" }');
      datos.push(temp);
    };
  });
  //console.log(datos);
  res.render('index' ,{ datos: datos });
});

router.post('/', function(req, res, next) {
  sesionID = req.body.sesionID;
  // Parse a file
  var datos = [];
  var workSheetsFromFile = xlsx.parse(`${__dirname}/agip.xlsx`);
  var datosExcel = workSheetsFromFile[0].data;
  datosExcel.forEach(function(item) {
    if(typeof item[0] !== 'undefined' && item[0] !== null){
      var cuit = item[3];
      if (cuit) {
        cuit = cuit.replace('-','');
        cuit = cuit.replace('-','');
      }
      var args = {
          //headers: { "Cookie":"AGIP_ID=00d07972-05d9-445b-94a0-94f9cedee0dc; JSESSIONID=d3c02ca6c010761940cd4dd67278; JSESSIONIDVERSION=2f65417263696261:43; JREPLICA=i0402; __utma=165579311.1430963338.1508871447.1512794033.1512854816.50; __utmc=165579311; __utmz=165579311.1512794033.49.3.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); test=" }
          headers: { "Cookie":" JSESSIONID="+ sesionID +";" }
      };
      var url = "http://lb.agip.gob.ar/eArciba/cc/rest/cliente/" + cuit;

      client.get(url, args, function (data, response) {
          //console.log(data);
      });
      var temp = JSON.parse('{ "Fecha": "' + item[0] + '" , "Factura": "' + item[1] + '" , "Nombre": "' + item[2] + '" , "CUIT": "' + item[3] + '" , "Importe": "' + item[4] + '" , "AliCuota": "' + item[5] + '" , "Percepcion": "' + item[6] + '" }');
      datos.push(temp);
    };
  });
  //console.log(datos);
  res.send(datos);
});

module.exports = router;
