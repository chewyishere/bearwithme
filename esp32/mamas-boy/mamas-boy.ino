#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>

#define TOP_SENSOR 21
#define BOTTOM_SENSOR 19
#define H_BRIDGE_1 5
#define H_BRIDGE_2 18
//#define POT 34
#define ENABLE 5
#define STEP 4
#define DIR 18
//#define PIN 23
#define NUMPIXELS 8
#define TOUCHPIN 13
#define LEDPIN 23


//Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

const char *ssid = "";
const char *password = "";
const String endpoint = "http://ec2-54-165-19-168.compute-1.amazonaws.com:8000/products/mamas-boy";

int potVal = 0;
int motorSpeed = 255;
int readTimeout = 100;
long lastRead = 0;
long lastDirChange = millis();
long lastRequest = 0;
int requestTimeout = 5000;
bool stepperRunning = false;

DynamicJsonDocument mamasBoy(1024);

enum direction
{
  up = 0,
  down = 1
};

class StepperMotor
{
private:
  direction _currentDir = up;
  int _timeout = 5;
  int _enablePin = -1;
  int _stepPin = -1;
  int _dirPin = -1;
  int _lastUpdate = 0;

public:
  StepperMotor(int enablePin, int stepPin, int dirPin)
  {
    _enablePin = enablePin;
    _stepPin = stepPin;
    _dirPin = dirPin;
  }
  bool validPins()
  {
    if (_enablePin < 0 || _stepPin < 0 || _dirPin < 0)
      return false;
    else
      return true;
  }
  void move()
  {
    if (this->validPins() && millis() - _lastUpdate > _timeout)
    {
      digitalWrite(_stepPin, 1);
      digitalWrite(_stepPin, 0);
      _lastUpdate = millis();
    }
  }
  void setDirection(direction _dir)
  {
    if (this->validPins())
    {
      _currentDir = _dir;
      digitalWrite(_dirPin, _currentDir);
    }
  }
  int getTimeout()
  {
    return _timeout;
  }
  direction getDirection()
  {
    return _currentDir;
  }
};

//void setPixels()
//{
//  for (int i = 0; i < NUMPIXELS; i++)
//  {
//    pixels.setPixelColor(i, pixels.Color(52, 80, 92));
//  }
//  pixels.show();
//}

StepperMotor myStepper = StepperMotor(ENABLE, STEP, DIR);

void setup()
{

  Serial.begin(115200);

//  pixels.begin();

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
//  setPixels();
  pinMode(TOP_SENSOR, INPUT);
  pinMode(BOTTOM_SENSOR, INPUT);
  pinMode(STEP, OUTPUT);   //step pin
  pinMode(DIR, OUTPUT);    //direction pin
  pinMode(ENABLE, OUTPUT); //enable pin
  pinMode(LEDPIN, OUTPUT);
  digitalWrite(ENABLE, 0);
  digitalWrite(DIR, 0);

  Serial.println("Connected to the WiFi network");
  Serial.print("Timeout: ");
  Serial.println(myStepper.getTimeout());
  Serial.print("Direction: ");
  Serial.println(myStepper.getDirection());
}

void handleLED(){
  if(touchRead(TOUCHPIN) < 20) {
    digitalWrite(LEDPIN, HIGH);
  }
  else {
    digitalWrite(LEDPIN, LOW);
  }
}

void loop()
{
  handleLED();
  if (stepperRunning)
  {
    if (millis() - lastRead > readTimeout)
    {
      int topSensor = digitalRead(TOP_SENSOR);
      int bottomSensor = digitalRead(BOTTOM_SENSOR);
      direction currentDir = myStepper.getDirection();
      if (topSensor == 0 && currentDir == up)
        myStepper.setDirection(down);
      if (bottomSensor == 0 && currentDir == down)
        myStepper.setDirection(up);
      lastRead = millis();
    }
    myStepper.move();
  }

  if ((WiFi.status() == WL_CONNECTED) && (millis() - lastRequest > requestTimeout))
  { //Check the current connection status

    HTTPClient http;

    http.begin(endpoint);      //Specify the URL
    int httpCode = http.GET(); //Make the request

    if (httpCode > 0)
    { //Check for the returning code

      // Deserialize the JSON document
      deserializeJson(mamasBoy, http.getString());
      JsonObject obj = mamasBoy.as<JsonObject>();

      // Fetch values.
      const char *id = obj["id"];
      int pos = obj["pos"];
      int dir = obj["dir"];
      if (dir == 1)
        stepperRunning = true;
      else
        stepperRunning = false;
    }

    else
    {
      Serial.println("Error on HTTP request");
    }

    http.end(); //Free the resources
    lastRequest = millis();
  }
}
