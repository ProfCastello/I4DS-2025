// Define o pino do primeiro LED
const int led1 = 25;
// Define o pino do segundo LED
const int led2 = 27;
// Define o pino do botão
const int button = 35;

// Tempo que o LED1 vai ficar ligado antes de piscar de novo (1 segundo)
unsigned long intervalo1 = 1000;
// Tempo que o LED2 vai ficar ligado antes de piscar de novo (0.3 segundos)
unsigned long intervalo2 = 300;

// Guarda o último tempo que o LED1 piscou
unsigned long tempoAnterior1 = 0;
// Guarda o último tempo que o LED2 piscou
unsigned long tempoAnterior2 = 0;
// Guarda o momento em que o botão foi apertado
unsigned long tempoBotaoPressionado = 0;

// O tempoAnterior guarda o momento exato em que cada LED mudou de estado pela última vez.

// Guarda se o LED1 está ligado ou desligado
bool estadoLed1 = false;
// Guarda se o LED2 está ligado ou desligado
bool estadoLed2 = false;
// Indica se o botão foi apertado e está no modo especial de 2 segundos
bool botaoAtivo = false;
// Guarda o estado anterior do botão para detectar clique
bool botaoAnterior;

void setup()
{
  // Define o pino do LED1 como saída (para enviar energia)
  pinMode(led1, OUTPUT);
  // Define o pino do LED2 como saída
  pinMode(led2, OUTPUT);
  // Define o pino do botão como entrada com resistor interno ligado (evita ruído)
  pinMode(button, INPUT_PULLUP);
  // Inicia a comunicação serial para mostrar mensagens no monitor serial
  Serial.begin(115200);
  // Lê o estado inicial do botão (HIGH, pois está solto com PULLUP)
  botaoAnterior = digitalRead(button);
}

void loop()
{
  // Pega o tempo atual desde que o ESP32 foi ligado
  unsigned long tempoAtual = millis();
  // Lê se o botão está apertado (LOW) ou solto (HIGH)
  bool leituraBotao = digitalRead(button);

  // Verifica se o botão foi apertado agora (mudou de HIGH para LOW)
  // E se não está no modo especial de 2 segundos
  if (botaoAnterior == HIGH && leituraBotao == LOW && !botaoAtivo)
  {
    botaoAtivo = true;                  // Ativa o modo especial
    tempoBotaoPressionado = tempoAtual; // Salva quando o botão foi apertado

    // Liga os dois LEDs
    digitalWrite(led1, HIGH);
    digitalWrite(led2, HIGH);
    estadoLed1 = true;
    estadoLed2 = true;

    // Mostra mensagem no monitor serial
    Serial.println("Botão pressionado");
  }

  // Atualiza o estado anterior do botão para próxima leitura
  botaoAnterior = leituraBotao;

  // Se o botão foi apertado, conta 2 segundos com os LEDs acesos
  if (botaoAtivo)
  {
    // Verifica se já passaram 2 segundos
    if (tempoAtual - tempoBotaoPressionado >= 2000)
    {
      botaoAtivo = false; // Sai do modo especial

      // Reinicia os contadores de tempo dos LEDs para não piscar fora de ritmo
      tempoAnterior1 = tempoAtual;
      tempoAnterior2 = tempoAtual;

      // Desliga os LEDs
      estadoLed1 = false;
      estadoLed2 = false;
      digitalWrite(led1, LOW);
      digitalWrite(led2, LOW);
    }
    else
    {
      // Ainda está no tempo de 2 segundos: sai do loop para não piscar
      return;
    }
  }

  // Verifica se é hora de trocar o estado do LED1 (piscando)
  if (tempoAtual - tempoAnterior1 >= intervalo1)
  {
    tempoAnterior1 = tempoAtual;    // Atualiza o tempo do último piscar
    estadoLed1 = !estadoLed1;       // Inverte o estado (se estava ligado, desliga)
    digitalWrite(led1, estadoLed1); // Liga ou desliga o LED1
  }

  // Verifica se é hora de trocar o estado do LED2 (piscando)
  if (tempoAtual - tempoAnterior2 >= intervalo2)
  {
    tempoAnterior2 = tempoAtual;    // Atualiza o tempo do último piscar
    estadoLed2 = !estadoLed2;       // Inverte o estado
    digitalWrite(led2, estadoLed2); // Liga ou desliga o LED2
  }
}
