/*
 * GROUND NODE FIRMWARE (ESP32)
 * Manages RS485 NPK Sensor and Capacitive Moisture Sensor
 */

#include <WiFi.h>
#include <HardwareSerial.h>
#include "ThingSpeak.h"

// --- Credentials ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
unsigned long myChannelNumber = 123456;
const char * myWriteAPIKey = "YOUR_THINGSPEAK_API_KEY";

// --- Pin Definitions ---
#define MOISTURE_PIN 34  // Analog pin for Capacitive Moisture Sensor
#define RE_PIN 4         // RS485 RE Pin
#define DE_PIN 5         // RS485 DE Pin

// RX=16, TX=17 for RS485 (Serial2)
HardwareSerial mod(2);

// --- NPK Query Frame (Modbus RTU) ---
const byte npk_query[] = {0x01, 0x03, 0x00, 0x1e, 0x00, 0x03, 0x65, 0xce};
byte values[11];

WiFiClient client;

void setup() {
  Serial.begin(115200);
  mod.begin(9600, SERIAL_8N1, 16, 17);
  
  pinMode(RE_PIN, OUTPUT);
  pinMode(DE_PIN, OUTPUT);
  
  WiFi.mode(WIFI_STA);
  ThingSpeak.begin(client);
  
  Serial.println("Premium Soil Intelligence Node Online");
}

float readMoisture() {
  int raw = analogRead(MOISTURE_PIN);
  // Calibration: Air ~ 3200, Water ~ 1500 (adjust for your sensor)
  float percentage = map(raw, 3200, 1500, 0, 100);
  return constrain(percentage, 0, 100);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  }

  // --- Read NPK ---
  digitalWrite(DE_PIN, HIGH);
  digitalWrite(RE_PIN, HIGH);
  delay(10);
  mod.write(npk_query, sizeof(npk_query));
  mod.flush();
  
  digitalWrite(DE_PIN, LOW);
  digitalWrite(RE_PIN, LOW);
  delay(100);

  float n = 0, p = 0, k = 0;
  if (mod.available() >= 11) {
    for (byte i = 0; i < 11; i++) values[i] = mod.read();
    n = (values[3] << 8) | values[4];
    p = (values[5] << 8) | values[6];
    k = (values[7] << 8) | values[8];
  }

  float moisture = readMoisture();

  Serial.printf("N: %.1f, P: %.1f, K: %.1f, Moisture: %.1f%%\n", n, p, k, moisture);

  ThingSpeak.setField(1, n);
  ThingSpeak.setField(2, p);
  ThingSpeak.setField(3, k);
  ThingSpeak.setField(4, moisture);

  int x = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  if(x == 200) Serial.println("ThingSpeak Update: OK");
  
  delay(20000); 
}
