#include "DHT.h" // Biblioteca para o sensor DHT22

#define DHTPIN 15     // GPIO15 do ESP32
#define DHTTYPE DHT22 // Tipo do sensor DHT

DHT dht(DHTPIN, DHTTYPE); // Instancia do sensor

void setup()
{
  Serial.begin(115200);
  dht.begin();
  Serial.println("Iniciando leitura do DHT22...");
}

void loop()
{
  delay(2000); // Intervalo entre leituras (2 segundos)

  float temperatura = dht.readTemperature(); // Celsius
  float umidade = dht.readHumidity();        // %

  // Verifica se houve erro na leitura
  if (isnan(temperatura) || isnan(umidade))
  {
    Serial.println("Erro ao ler os dados do DHT22");
    return;
  }

  // Mostra resultados no Serial Monitor
  Serial.print("Temperatura: ");
  Serial.print(temperatura);
  Serial.println(" °C");

  Serial.print("Umidade: ");
  Serial.print(umidade);
  Serial.println(" %");
}
