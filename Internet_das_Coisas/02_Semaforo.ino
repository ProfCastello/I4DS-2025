// Definimos os pinos onde os LEDs do semáforo estão conectados
const int ledvermelho = 32; // LED vermelho está no pino 32
const int ledamarelo = 25;  // LED amarelo está no pino 25
const int ledverde = 27;    // LED verde está no pino 27

// Função de configuração inicial, executada apenas uma vez ao iniciar o ESP32
void setup()
{
    // Inicializamos a comunicação serial para enviar mensagens ao computador
    Serial.begin(115200);

    // Configuramos os pinos dos LEDs como saída
    pinMode(ledvermelho, OUTPUT);
    pinMode(ledamarelo, OUTPUT);
    pinMode(ledverde, OUTPUT);
}

// Função principal que roda continuamente após o setup
void loop()
{
    // Acendemos o LED verde e apagamos os outros LEDs
    digitalWrite(ledvermelho, LOW);
    digitalWrite(ledamarelo, LOW);
    digitalWrite(ledverde, HIGH);

    // Mantemos o LED verde aceso por 7 segundos
    delay(7000);

    // Acendemos o LED amarelo e apagamos os outros LEDs
    digitalWrite(ledvermelho, LOW);
    digitalWrite(ledamarelo, HIGH);
    digitalWrite(ledverde, LOW);

    // Mantemos o LED amarelo aceso por 3 segundos
    delay(3000);

    // Acendemos o LED vermelho e apagamos os outros LEDs
    digitalWrite(ledvermelho, HIGH);
    digitalWrite(ledamarelo, LOW);
    digitalWrite(ledverde, LOW);

    // Mantemos o LED vermelho aceso por 10 segundos
    delay(10000);
}
