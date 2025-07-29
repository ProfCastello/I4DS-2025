const int ledvermelho = 32;
const int ledamarelo = 25;
const int ledverde = 27;

void setup()
{
    // put your setup code here, to run once:
    Serial.begin(115200);
    pinMode(ledvermelho, OUTPUT);
    pinMode(ledamarelo, OUTPUT);
    pinMode(ledverde, OUTPUT);
}

void loop()
{
    digitalWrite(ledvermelho, LOW);
    digitalWrite(ledamarelo, LOW);
    digitalWrite(ledverde, HIGH);

    delay(7000); // this speeds up the simulation

    digitalWrite(ledvermelho, LOW);
    digitalWrite(ledamarelo, HIGH);
    digitalWrite(ledverde, LOW);

    delay(3000);

    digitalWrite(ledvermelho, HIGH);
    digitalWrite(ledamarelo, LOW);
    digitalWrite(ledverde, LOW);

    delay(10000);
}
