const int ledVermelho = 25;
const int ledVerde = 27;
bool estado = false;

void setup()
{
    pinMode(ledVermelho, OUTPUT);
    pinMode(ledVerde, OUTPUT);
    Serial.begin(115200);
}

void loop()
{
    // digitalWrite(ledVerde, HIGH);
    // digitalWrite(ledVermelho, LOW);
    // Serial.println("LIGADO");
    // delay(1000);
    // digitalWrite(ledVerde, LOW);
    // digitalWrite(ledVermelho, HIGH);
    // Serial.println("DESLIGADO");
    // delay(1000);
    digitalWrite(ledVerde, estado);
    estado = !estado;
    digitalWrite(ledVermelho, estado);
    delay(1000);
}