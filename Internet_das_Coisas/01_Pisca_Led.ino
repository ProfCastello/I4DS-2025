// Definimos os pinos onde os LEDs estão conectados
const int ledVermelho = 25; // LED vermelho está no pino 25
const int ledVerde = 27;    // LED verde está no pino 27

// Variável que controla o estado dos LEDs (ligado ou desligado)
bool estado = false;

// Função de configuração inicial, executada apenas uma vez ao iniciar o ESP32
void setup()
{
    // Configuramos os pinos dos LEDs como saída
    pinMode(ledVermelho, OUTPUT);
    pinMode(ledVerde, OUTPUT);

    // Inicializamos a comunicação serial para enviar mensagens ao computador
    Serial.begin(115200);
}

// Função principal que roda continuamente após o setup
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

    // Escrevemos o estado atual no LED verde
    digitalWrite(ledVerde, estado);

    // Invertemos o estado (se estava ligado, desliga; se estava desligado, liga)
    estado = !estado;

    // Escrevemos o estado invertido no LED vermelho
    digitalWrite(ledVermelho, estado);

    // Aguardamos 1 segundo antes de repetir o processo
    delay(1000);
}