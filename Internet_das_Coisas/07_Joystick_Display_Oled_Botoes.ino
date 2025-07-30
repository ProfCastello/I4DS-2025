// Inclui as bibliotecas necessárias para comunicação I2C e controle do display OLED
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Define as dimensões do display OLED
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
// Cria um objeto para o display OLED
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Definição dos pinos dos botões
const int btnAzul = 12;     // Botão azul
const int btnVerde = 13;    // Botão verde
const int btnAmarelo = 14;  // Botão amarelo
const int btnVermelho = 27; // Botão vermelho
const int btnPreto = 26;    // Botão preto
const int btnBranco = 25;   // Botão branco

// Definição dos pinos do joystick
const int joyX = 34;   // Eixo X do joystick
const int joyY = 35;   // Eixo Y do joystick
const int joyBtn = 32; // Botão do joystick

// Definição dos limites do joystick
const int centro = 2048;   // Valor central do joystick
const int zonaMorta = 500; // Tolerância para considerar o joystick parado

void setup()
{
    // Inicializa a comunicação serial para depuração
    Serial.begin(115200);

    // Inicializa o display OLED
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) // Endereço I2C do display
    {
        Serial.println(F("Erro OLED")); // Mensagem de erro caso o display não seja inicializado
        for (;;)
            ; // Loop infinito em caso de erro
    }
    display.clearDisplay();              // Limpa o display
    display.setTextColor(SSD1306_WHITE); // Define a cor do texto
    display.setTextSize(1);              // Define o tamanho do texto
    display.setCursor(0, 0);             // Define a posição inicial do texto
    display.println("Inicializando..."); // Exibe mensagem de inicialização
    display.display();                   // Atualiza o display
    delay(1000);                         // Aguarda 1 segundo

    // Configura os pinos dos botões como entrada com pull-up interno
    pinMode(btnAzul, INPUT_PULLUP);
    pinMode(btnVerde, INPUT_PULLUP);
    pinMode(btnAmarelo, INPUT_PULLUP);
    pinMode(btnVermelho, INPUT_PULLUP);
    pinMode(btnPreto, INPUT_PULLUP);
    pinMode(btnBranco, INPUT_PULLUP);
    pinMode(joyBtn, INPUT_PULLUP); // Botão do joystick
}

void loop()
{
    display.clearDisplay();  // Limpa o display para atualizar as informações
    display.setCursor(0, 0); // Define a posição inicial do texto

    // Lê os valores do joystick
    int xValue = analogRead(joyX); // Lê o valor do eixo X
    int yValue = analogRead(joyY); // Lê o valor do eixo Y

    String mensagem = ""; // Variável para armazenar a mensagem do botão pressionado

    // Verifica qual botão foi pressionado
    if (digitalRead(btnAzul) == LOW)
        mensagem = "Botao Azul";
    else if (digitalRead(btnVerde) == LOW)
        mensagem = "Botao Verde";
    else if (digitalRead(btnAmarelo) == LOW)
        mensagem = "Botao Amarelo";
    else if (digitalRead(btnVermelho) == LOW)
        mensagem = "Botao Vermelho";
    else if (digitalRead(btnPreto) == LOW)
        mensagem = "Botao Preto";
    else if (digitalRead(btnBranco) == LOW)
        mensagem = "Botao Branco";
    else if (digitalRead(joyBtn) == LOW)
        mensagem = "Botao Joystick";
    else
        mensagem = "Pressione um botao"; // Mensagem padrão caso nenhum botão esteja pressionado

    // Exibe a mensagem do botão pressionado no display
    display.println(mensagem);

    // Determina a direção do joystick com base nos valores lidos
    String direcao = "";

    if (xValue > centro + zonaMorta)
        direcao = "Esquerda";
    else if (xValue < centro - zonaMorta)
        direcao = "Direita";
    else if (yValue > centro + zonaMorta)
        direcao = "Cima";
    else if (yValue < centro - zonaMorta)
        direcao = "Baixo";
    else
        direcao = "Centro"; // Joystick está parado

    // Exibe a direção do joystick no display
    display.print("Direcao: ");
    display.println(direcao);

    display.display(); // Atualiza o display com as informações
    delay(100);        // Aguarda 100ms antes de repetir o loop
}
