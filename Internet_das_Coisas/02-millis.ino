const int led1 = 25;
const int led2 = 26;

unsigned long intervalo1 = 300;
unsigned long intervalo2 = 1000;

unsigned long tempoAnterior1 = 0;
unsigned long tempoAnterior2 = 0;

bool estadoLed1 = false;
bool estadoLed2 = false;

void setup()
{
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
}

void loop()
{
  unsigned long tempoAtual = millis();

  // Led1
  if (tempoAtual - tempoAnterior1 >= intervalo1)
  {
    tempoAnterior1 = tempoAtual;
    estadoLed1 = !estadoLed1;
    digitalWrite(led1, estadoLed1);
  }

  // Led2
  if (tempoAtual - tempoAnterior2 >= intervalo2)
  {
    tempoAnterior2 = tempoAtual;
    estadoLed2 = !estadoLed2;
    digitalWrite(led2, estadoLed2);
  }
}