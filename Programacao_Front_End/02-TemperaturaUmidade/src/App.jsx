import { useMQTT } from "./hooks/useMQTT.js";
import Header from "./components/Header";
import SensorCard from "./components/SensorCard.jsx";
import StatsCard from "./components/StatsCard.jsx";
import ConnectionInfo from "./components/ConnectionInfo.jsx";

function App() {
  // Configurações do MQTT
  const brokerHost = "broker.hivemq.com";
  const brokerPort = 8884;
  const topic = "profcastello/temperatura";

  // Hook customizado para gerenciar MQTT
  const { temperature, humidity, isConnected, lastUpdate, connectionAttempts } =
    useMQTT(brokerHost, brokerPort, topic);

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          {/* Header com controle de tema */}
          <Header isConnected={isConnected} lastUpdate={lastUpdate} />

          {/* Cards de Sensores */}
          <div className="row g-4 mb-4">
            <SensorCard
              title="Temperatura"
              value={temperature}
              unit="°C"
              icon="fas fa-thermometer-half"
              colorClass="temperature-icon"
              isConnected={isConnected}
            />

            <SensorCard
              title="Umidade"
              value={humidity}
              unit="%"
              icon="fas fa-tint"
              colorClass="humidity-icon"
              isConnected={isConnected}
            />
          </div>

          {/* Estatísticas */}
          <StatsCard temperature={temperature} humidity={humidity} />

          {/* Informações de Conexão */}
          <ConnectionInfo
            brokerHost={brokerHost}
            topic={topic}
            isConnected={isConnected}
            connectionAttempts={connectionAttempts}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
