// Pinos
const int potPin = 34; // Entrada analógica
const int redPin = 25;
const int greenPin = 26;
const int bluePin = 27;

void setup()
{
    // Inicia a comunicação serial
    Serial.begin(115200);

    // Pinos de saída
    pinMode(redPin, OUTPUT);
    pinMode(greenPin, OUTPUT);
    pinMode(bluePin, OUTPUT);
}

void loop()
{
    int potValue = analogRead(potPin); // 0 a 4095 no ESP32

    // Mapear para faixa de 0 a 255
    int val = map(potValue, 0, 4095, 0, 255);

    // Exemplo de variação de cores baseado no valor do potenciômetro
    // Transição de Vermelho -> Verde -> Azul
    int r, g, b;

    if (val < 85)
    {
        r = 255 - val * 3;
        g = val * 3;
        b = 0;
    }
    else if (val < 170)
    {
        val -= 85;
        r = 0;
        g = 255 - val * 3;
        b = val * 3;
    }
    else
    {
        val -= 170;
        r = val * 3;
        g = 0;
        b = 255 - val * 3;
    }

    // Como o LED é de ânodo comum, precisamos inverter os valores (PWM)
    analogWrite(redPin, 255 - r);
    analogWrite(greenPin, 255 - g);
    analogWrite(bluePin, 255 - b);

    // Imprimir valores RGB na serial
    Serial.print("R: ");
    Serial.print(r);
    Serial.print(" | G: ");
    Serial.print(g);
    Serial.print(" | B: ");
    Serial.println(b);

    delay(10);
}
