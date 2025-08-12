import { useState, useEffect } from "react";
import Paho from "paho-mqtt";

export function useMQTT(brokerHost, brokerPort, topic) {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    // Criando cliente MQTT
    const mqttClient = new Paho.Client(
      brokerHost,
      brokerPort,
      `client_${Math.random()}`
    );

    const onConnect = () => {
      console.log("Conectado ao broker MQTT");
      setIsConnected(true);
      setConnectionAttempts(0);
      mqttClient.subscribe(topic);
    };

    const onFailure = (error) => {
      console.error("Falha na conexão:", error);
      setIsConnected(false);
      setConnectionAttempts((prev) => prev + 1);
    };

    const onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log("Conexão perdida:", responseObject.errorMessage);
        setIsConnected(false);
      }
    };

    const onMessageArrived = (message) => {
      try {
        const data = JSON.parse(message.payloadString);
        setTemperature(data.temperatura);
        setHumidity(data.umidade);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Erro ao parsear JSON:", error);
      }
    };

    // Configurando callbacks
    mqttClient.onConnectionLost = onConnectionLost;
    mqttClient.onMessageArrived = onMessageArrived;

    // Conectando ao broker
    mqttClient.connect({
      onSuccess: onConnect,
      onFailure: onFailure,
      useSSL: true,
      reconnect: true,
    });

    return () => {
      if (mqttClient.isConnected()) {
        mqttClient.disconnect();
      }
    };
  }, [brokerHost, brokerPort, topic]);

  return {
    temperature,
    humidity,
    isConnected,
    lastUpdate,
    connectionAttempts,
  };
}
