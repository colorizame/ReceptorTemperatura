int tempPin = A0;
int resistPin = A1;
int old_value = 0;
int datos = 0;
float tempValue;
float voltage;
int tempRead;
int resistValue;
void setup() {
  Serial.begin(4800);
  analogReference(EXTERNAL);
}

void loop() {
  //Leer La temperatura
  tempRead = analogRead(tempPin);    
  resistValue = analogRead(resistPin);
  voltage = tempRead * 3.3;
  voltage /= 1024.0; 
  tempValue = (voltage - 0.5) * 100;
  
  if  (old_value != tempValue) {
    old_value = tempValue;
    datos = 0;
    Serial.print(tempValue);
    Serial.print( "*" );
    Serial.print(resistValue);
    Serial.print( "\n" );
  } else {
    if (datos < 2) {
        Serial.print(tempValue);
        Serial.print( "*" );
        Serial.print(resistValue);
        Serial.print( "\n" );
        datos = datos+1;
    }
  }
  delay(1000);
}
