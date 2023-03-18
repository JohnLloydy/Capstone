#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>

#include <SocketIoClient.h>

WiFiMulti WiFiMulti;
SocketIoClient webSocket;

const int trigPin = 13;
const int echoPin = 12;
// const char *ssid = "BukSU_WiFi-Zone";
// const char *password = "";
// CONST VARIABLES
const char *ssid = "camskie";
const char *pass = "Nelymilocharm@123";
const char *HOST = "192.168.1.20";

// define sound speed in cm/uS
#define SOUND_SPEED 0.034
#define CM_TO_INCH 0.393701
#define CAMERA_MODEL_AI_THINKER // Has PSRAM

long duration;
float distanceCm;
float distanceInch;

void setup()
{
  Serial.begin(115200);     // Starts the serial communication
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT);  // Sets the echoPin as an Input

  // Connect to WIFI
  WiFiMulti.addAP(ssid, pass);

  Serial.println("Connecting Wifi...");
  if (WiFiMulti.run() == WL_CONNECTED)
  {
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    webSocket.begin(HOST, 3000);
  }
}

void loop()
{

  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);

  // Calculate the distance
  distanceCm = duration * SOUND_SPEED / 2;

  // Convert to inches
  distanceInch = distanceCm * CM_TO_INCH;

  // Prints the distance in the Serial Monitor
  Serial.print("Distance (cm): ");
  Serial.println(distanceCm);
  Serial.print("Distance (inch): ");
  Serial.println(distanceInch);
  char result[8]; // Buffer big enough for 7-character float
  dtostrf(distanceInch, 6, 2, result);
  webSocket.loop();
  webSocket.emit("distanceInch", result);
}