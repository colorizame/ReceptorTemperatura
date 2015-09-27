//Receptor de Temperatura
//  -- Lee datos del serial, que envia una arduino con un sensor TMP36... 
//  -- los tabula en un documento de excel.. y los guarda en una base de datos de MongoDB

// Autor: Daniel Xutuc (dahngeek.com)

sp = require("serialport");
SerialPort = sp.SerialPort;
var excelbuilder = require('msexcel-builder');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/temperature');
var tempScheme = mongoose.Schema({
   	temp: String,
   	val: String
});
var temperaturaModel = mongoose.model('Temp', tempScheme);

var portName = 'COM32'; //Puerto serial del arduino
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("Conectado a la base de datos");
});
function recibeSerial(debug) {
	var receivedData = "";
    serialPort = new SerialPort(portName, {
        baudrate: 4800, //velocidad
        // defaults para arduino...
        parser: sp.parsers.readline("\n")
    });
    serialPort.on('open', function(){
    	console.log('Se estableció conexión serial.');
    	var infoData = [];
    	infoData.push({temp: "Temperatura", val:"Valor"});
    	//Documento de excel
    	var workbook = excelbuilder.createWorkbook('./', 'datosTemp.xlsx');
    	  //var sheet1 = workbook.createSheet('Prueba2', 10, 12); //Hoja de excel

    	serialPort.on('data', function(data) {
                receivedData += data.toString();
                
    		if (receivedData.length !== 0 || receivedData !="") {
                //console.log(receivedData);
    			var temperatura = receivedData.substring(0, receivedData.indexOf('*'));
    			var voltaje = receivedData.substring(receivedData.indexOf('*')+1,receivedData.length);
                
                //Guardarlo en la base de datos de Mongo
    			var mytemp = new temperaturaModel({temp: temperatura, val: voltaje});
    			mytemp.save(function (err, dis) {
				  if (err) return console.error(err);
				  //process.stdout.write("+");
                  console.log("temp: "+dis.temp+" val:"+dis.val);
				});
    			infoData.push({temp: temperatura, val: voltaje});
    			receivedData = "";
    			//Si se termina .. aqui usar cualquier temperatura
    			if (parseInt(temperatura)>10) {
                    //Cerrar puerto Serial
    				serialPort.close();
                    //Crear hoja en el documento de excel
    				var sheet1 = workbook.createSheet('prueba2', 3, infoData.length);
                    

                    //Registrar fila con dato
    				function registraColumna(elem, index, arr) {
                        console.log("registrnado row: "+elem.temp+" | "+elem.val+" index:"+index);
    					sheet1.set(1, index+1, elem.temp);
    					sheet1.set(2, index+1, elem.val);
    				}
    				infoData.forEach(registraColumna);

                    //Guardar
    				workbook.save(function(ok){
					    if (!ok) 
					      workbook.cancel();
					    else
					      console.log('congratulations, your workbook created');
                            //Sacar todos los datos de MongoDB.. innecesario pero para debug
                          temperaturaModel.find(function (err, temperaturass) {
                              if (err) return console.error(err);
                              console.log(temperaturass);
                            });
					  });
    			};

    		};
    	});
    });
}

//Inizializar :D
recibeSerial();