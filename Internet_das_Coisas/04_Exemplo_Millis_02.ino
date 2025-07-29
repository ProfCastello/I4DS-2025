// Define os pinos digitais onde os LEDs estão conectados
const int led1 = 25;  // LED 1 está conectado ao pino 25
const int led2 = 26;  // LED 2 está conectado ao pino 26
const int botao = 27; // Botão conectado ao pino 27

// Define os intervalos de tempo (em milissegundos) para piscar os LEDs
unsigned long intervalo1 = 300;  // LED 1 pisca a cada 300ms
unsigned long intervalo2 = 1000; // LED 2 pisca a cada 1000ms (1 segundo)

// Variáveis para armazenar o último tempo em que os LEDs foram atualizados
unsigned long tempoAnterior1 = 0; // Última vez que o LED 1 mudou de estado
unsigned long tempoAnterior2 = 0; // Última vez que o LED 2 mudou de estado

// Variável para controlar o tempo dos 2 segundos com o botão
unsigned long tempoBotaoPressionado = 0;

// Variáveis para armazenar o estado atual dos LEDs (ligado ou desligado)
bool estadoLed1 = false; // false = desligado, true = ligado
bool estadoLed2 = false;
bool botaoAtivo = true;

void setup()
{
    // Configura os pinos dos LEDs como saída
    pinMode(led1, OUTPUT);
    pinMode(led2, OUTPUT);
    pinMode(botao, INPUT_PULLUP);
    Serial.begin(115200);
}

void loop()
{
    // Obtém o tempo atual desde que o programa começou (em milissegundos)
    unsigned long tempoAtual = millis();

    // Verifica se o botão foi pressionado (nível LOW, pois está em INPUT_PULLUP)
    if (digitalRead(botao) == HIGH && !botaoAtivo)
    {
        botaoAtivo = false;
        tempoBotaoPressionado = tempoAtual;

        // Acende os dois LEDs imediatamente
        digitalWrite(led1, HIGH);
        digitalWrite(led2, HIGH);
    }

    // Se o botão estiver ativo, espera 2 segundos antes de voltar ao piscar normal
    if (botaoAtivo)
    {
        if (tempoAtual - tempoBotaoPressionado >= 2000)
        {
            botaoAtivo = false;
            tempoAnterior1 = tempoAtual; // Reset para evitar salto no tempo
            tempoAnterior2 = tempoAtual;
        }
        return; // Sai do loop para evitar o piscar enquanto os LEDs estão acesos
    }

    // --- Controle do LED 1 ---
    // Verifica se já se passou o tempo definido no intervalo1
    if (tempoAtual - tempoAnterior1 >= intervalo1)
    {
        // Atualiza o tempo anterior para o tempo atual
        tempoAnterior1 = tempoAtual;

        // Inverte o estado do LED (se estava ligado, desliga; se estava desligado, liga)
        estadoLed1 = !estadoLed1;

        // Atualiza o estado físico do pino conforme o novo estado
        digitalWrite(led1, estadoLed1);
    }

    // --- Controle do LED 2 ---
    // Verifica se já se passou o tempo definido no intervalo2
    if (tempoAtual - tempoAnterior2 >= intervalo2)
    {
        // Atualiza o tempo anterior para o tempo atual
        tempoAnterior2 = tempoAtual;

        // Inverte o estado do LED
        estadoLed2 = !estadoLed2;

        // Atualiza o pino físico com o novo estado
        digitalWrite(led2, estadoLed2);
    }
}
