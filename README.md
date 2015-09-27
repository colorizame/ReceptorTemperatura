# ReceptorTemperatura 
Código encargado de leer el serial y tabular datos a excel e ingresarlos a una base de datos de Mongo.


# Para ejecutar
1. Primero debes tener una base de datos de mongoDB corriendo.. ´´´mongod´´´
2. Conectar el arduino con el código de la carpeta ´´´temperaturaSerial_ino´´´ al puerto usb.. y modificar el programa para el puerto serial correcto.
3. inicializar con ´´´node index.js´´´
4. oops.. error.. olvidamos instalar los paquetes de npm ´´´npm install´´´