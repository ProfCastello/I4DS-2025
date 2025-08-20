# 🌡️ Monitor IoT - Temperatura e Umidade

Um moderno dashboard React para monitoramento de dados IoT em tempo real via MQTT com temas claro/escuro e componentes modulares.

## ✨ Funcionalidades

### 🚀 Core Features

- **Conexão MQTT**: Conecta automaticamente ao broker `broker.hivemq.com`
- **Monitoramento em Tempo Real**: Dados de temperatura e umidade via tópico `profcastello/temperatura`
- **Temas Light/Dark**: Alternância inteligente com preferência do sistema
- **Arquitetura Modular**: Componentes React reutilizáveis e hooks customizados
- **Interface Responsiva**: Design adaptável para desktop e mobile

### 📊 Recursos Avançados

- **Estatísticas da Sessão**: Valores mínimos, máximos e médias
- **Indicadores Visuais**: Animações, pulsos e transições suaves
- **Status de Conexão**: Feedback visual em tempo real
- **Reconexão Automática**: Tentativas de reconexão em caso de falha
- **Persistência de Tema**: Preferência salva no localStorage

### 🎨 UI/UX

- **Design Glassmorphism**: Efeitos de vidro fosco e blur
- **Animações Fluidas**: Transições CSS avançadas
- **Typography Moderna**: Fonte Inter otimizada
- **Cores Semânticas**: Esquema de cores intuitivo
- **Micro-interações**: Hover effects e feedback visual

## 🛠️ Tecnologias

- **React 19** - Framework de interface moderna
- **Vite** - Build tool ultrarrápida
- **Paho MQTT** - Cliente MQTT para JavaScript
- **Bootstrap 5** - Sistema de design responsivo
- **Font Awesome 6** - Ícones vetoriais premium
- **CSS3** - Animações e efeitos avançados

## 📦 Instalação e Execução

```bash
# Clonar e navegar para o diretório
cd Programacao_Front_End/01-TemperaturaUmidade

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Abrir no navegador
http://localhost:5173
```

## 🏗️ Arquitetura do Projeto

```
src/
├── components/           # Componentes React
│   ├── Header.jsx       # Cabeçalho com toggle de tema
│   ├── SensorCard.jsx   # Cards de sensores
│   ├── StatsCard.jsx    # Estatísticas da sessão
│   └── ConnectionInfo.jsx # Informações de conexão
├── contexts/            # Context API
│   └── ThemeContext.jsx # Gerenciamento de tema
├── hooks/               # Custom Hooks
│   ├── useMQTT.js      # Hook para MQTT
│   └── useTheme.js     # Hook para tema
├── App.jsx             # Componente principal
├── main.jsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## 📊 Formato dos Dados MQTT

```json
{
  "temperatura": 25.5,
  "umidade": 60.2
}
```

### ⚙️ Configurações MQTT

- **Broker**: `broker.hivemq.com`
- **Porta**: `8884` (WebSocket Secure)
- **Tópico**: `profcastello/temperatura`
- **SSL**: Habilitado
- **Reconexão**: Automática

## 🎨 Temas

### 🌞 Tema Claro

- Gradiente azul/roxo de fundo
- Cards com glassmorphism claro
- Tipografia escura para contraste

### 🌙 Tema Escuro

- Gradiente escuro noturno
- Cards com glassmorphism escuro
- Tipografia clara otimizada

### 🔄 Alternância Inteligente

- Detecta preferência do sistema
- Persiste escolha do usuário
- Transições suaves entre temas

## 📱 Recursos Responsivos

### 📱 Mobile

- Layout vertical empilhado
- Toggle de tema fixo
- Touch-friendly

### 💻 Desktop

- Layout horizontal otimizado
- Hover effects avançados
- Atalhos de teclado

## 🔄 Estados da Aplicação

### ✅ Conectado

- Indicador verde pulsante
- Dados atualizados em tempo real
- Animações ativas nos cards

### ❌ Desconectado

- Indicador vermelho
- Mensagem de reconexão
- Cards em estado de espera

### 📊 Estatísticas

- Cálculo automático de min/max/média
- Reset manual das estatísticas
- Contador de leituras

## 🧪 Testando a Aplicação

### Usando mosquitto_pub:

```bash
mosquitto_pub -h broker.hivemq.com -t profcastello/temperatura -m '{"temperatura": 24.5, "umidade": 65.3}'
```

### Usando cliente MQTT online:

1. Conectar em `broker.hivemq.com:8884`
2. Publicar no tópico `profcastello/temperatura`
3. Formato JSON com temperatura e umidade

## 🚨 Solução de Problemas

| Problema            | Causa Possível         | Solução                            |
| ------------------- | ---------------------- | ---------------------------------- |
| Não conecta ao MQTT | Firewall/Proxy         | Verificar porta 8884               |
| Dados não aparecem  | Formato JSON incorreto | Validar estrutura                  |
| Tema não persiste   | localStorage bloqueado | Verificar configurações do browser |
| Performance lenta   | Muitas reconexões      | Verificar conexão de rede          |

## 🔮 Funcionalidades Futuras

- [ ] Gráficos históricos
- [ ] Alertas configuráveis
- [ ] Export de dados
- [ ] Múltiplos sensores
- [ ] Notificações push
- [ ] Dashboard customizável

## 📝 Licença

Projeto educacional - Internet das Coisas (IoT) 2025

---

**Desenvolvido com ❤️ para demonstrar integração IoT + React**
