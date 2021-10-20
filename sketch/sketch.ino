#include <WebUSB.h>

/**
 * Creating an instance of WebUSBSerial will add an additional USB interface to
 * the device that is marked as vendor-specific (rather than USB CDC-ACM) and
 * is therefore accessible to the browser.
 *
 * The URL here provides a hint to the browser about what page the user should
 * navigate to to interact with the device.
 */
WebUSB WebUSBSerial(1 /* https:// */, "jumshudivanych.github.io/test-technologies/");

#define Serial WebUSBSerial

const int redPin = 9;
const int greenPin = 10;
const int bluePin = 11;
const int ledPin = 13;
int color[3];
int colorIndex;
int ledStatus;

void setup() {
  while (!Serial) {
    ;
  }
  Serial.begin(9600);
  Serial.write("Sketch begins.\r\n");
  Serial.flush();
  colorIndex = 0;
  
  ledStatus = 0;
  pinMode(ledPin,OUTPUT);
}

void loop() {
  if (Serial && Serial.available()) {
    ledStatus = Serial.read();
    if (ledStatus == 0) {
    digitalWrite(ledPin,LOW);
    }
    if (ledStatus == 1) {
      digitalWrite(ledPin,HIGH);
    }  
    color[colorIndex++] = Serial.read();
    if (colorIndex == 3) {
      analogWrite(redPin, color[0]);
      analogWrite(greenPin, color[1]);
      analogWrite(bluePin, color[2]);
      Serial.print("Set LED to ");
      Serial.print(color[0]);
      Serial.print(", ");
      Serial.print(color[1]);
      Serial.print(", ");
      Serial.print(color[2]);
      Serial.print(".\r\n");
      Serial.flush();
      colorIndex = 0;
    }
  }
}
